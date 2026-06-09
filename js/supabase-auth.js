// ============================================
// SUPABASE AUTHENTICATION & AUTHORIZATION SYSTEM
// ============================================

const SESSION_KEY = "xceedSession";

// SHA256 hashing function (same as before)
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Login function using Supabase
async function login(username, password) {
    try {
        // البحث عن المستخدم
        const { data: user, error } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('username', username)
            .single();
        
        if (error || !user) {
            return { success: false, message: "User not found" };
        }
        
        const hashedPassword = await sha256(password);
        
        if (user.password_hash === hashedPassword) {
            // إنشاء رمز جلسة فريد
            const sessionToken = await sha256(username + Date.now() + Math.random());
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 8); // 8 ساعات
            
            // حفظ الجلسة في Supabase
            const { error: sessionError } = await supabase
                .from(TABLES.SESSIONS)
                .insert({
                    user_id: user.id,
                    session_token: sessionToken,
                    expires_at: expiresAt.toISOString()
                });
            
            if (sessionError) {
                console.error('Session save error:', sessionError);
            }
            
            // إنشاء جلسة محلية
            const session = {
                userId: user.id,
                username: user.username,
                name: user.name,
                permissions: user.permissions,
                mustChangePassword: user.must_change_password || false,
                sessionToken: sessionToken,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            
            if (user.must_change_password) {
                return { success: true, message: "Login successful", mustChangePassword: true };
            }
            
            return { success: true, message: "Login successful", mustChangePassword: false };
        } else {
            return { success: false, message: "Invalid password" };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An error occurred" };
    }
}

// Change password function
async function changePassword(currentPassword, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return { success: false, message: "Not logged in" };
    }
    
    try {
        // جلب المستخدم من Supabase
        const { data: user, error } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('id', currentUser.userId)
            .single();
        
        if (error || !user) {
            return { success: false, message: "User not found" };
        }
        
        const hashedCurrent = await sha256(currentPassword);
        
        if (user.password_hash !== hashedCurrent) {
            return { success: false, message: "Current password is incorrect" };
        }
        
        if (newPassword.length < 6) {
            return { success: false, message: "New password must be at least 6 characters" };
        }
        
        // تحديث كلمة المرور
        const newPasswordHash = await sha256(newPassword);
        const { error: updateError } = await supabase
            .from(TABLES.USERS)
            .update({
                password_hash: newPasswordHash,
                must_change_password: false
            })
            .eq('id', currentUser.userId);
        
        if (updateError) {
            throw updateError;
        }
        
        // تحديث الجلسة
        const session = getCurrentUser();
        session.mustChangePassword = false;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Change password error:", error);
        return { success: false, message: "An error occurred" };
    }
}

// Get all users (admin only)
async function getAllUsers() {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.permissions.manageUsers) {
        return [];
    }
    
    try {
        const { data: users, error } = await supabase
            .from(TABLES.USERS)
            .select('id, username, name, permissions, must_change_password, created_at')
            .order('username');
        
        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }
        
        return users || [];
    } catch (error) {
        console.error('Get users error:', error);
        return [];
    }
}

// Reset user password (admin only)
async function resetUserPassword(username, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.permissions.manageUsers) {
        return { success: false, message: "Unauthorized" };
    }
    
    try {
        const newPasswordHash = await sha256(newPassword);
        
        const { error } = await supabase
            .from(TABLES.USERS)
            .update({
                password_hash: newPasswordHash,
                must_change_password: true
            })
            .eq('username', username);
        
        if (error) {
            return { success: false, message: "User not found" };
        }
        
        return { success: true, message: `Password reset for ${username}` };
    } catch (error) {
        return { success: false, message: "An error occurred" };
    }
}

// Get current user from session
function getCurrentUser() {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch(e) {
        return null;
    }
}

// Validate session with server
async function validateSession() {
    const session = getCurrentUser();
    if (!session) return false;
    
    try {
        const { data, error } = await supabase
            .from(TABLES.SESSIONS)
            .select('*')
            .eq('session_token', session.sessionToken)
            .eq('user_id', session.userId)
            .single();
        
        if (error || !data) {
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
        
        // التحقق من صلاحية الجلسة
        const expiresAt = new Date(data.expires_at);
        if (expiresAt < new Date()) {
            // حذف الجلسة من قاعدة البيانات
            await supabase
                .from(TABLES.SESSIONS)
                .delete()
                .eq('session_token', session.sessionToken);
            localStorage.removeItem(SESSION_KEY);
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}

// Check if user is authenticated
async function isAuthenticated() {
    const session = getCurrentUser();
    if (!session || !session.userId) return false;
    return await validateSession();
}

// Check if user has permission
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.permissions && user.permissions[permission] === true;
}

// Logout
async function logout() {
    const session = getCurrentUser();
    if (session && session.sessionToken) {
        await supabase
            .from(TABLES.SESSIONS)
            .delete()
            .eq('session_token', session.sessionToken);
    }
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Require authentication for protected pages
async function requireAuth() {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        window.location.href = 'login.html';
        return false;
    }
    
    const user = getCurrentUser();
    if (user.mustChangePassword && window.location.pathname.indexOf('change-password.html') === -1) {
        window.location.href = 'change-password.html';
        return false;
    }
    
    return true;
}