// ============================================
// AUTHENTICATION & AUTHORIZATION SYSTEM
// WITH 60 USERS
// ============================================

// Database configuration
const AUTH_DB_NAME = "XceedAuthDB";
const AUTH_STORE_NAME = "users";
const SESSION_KEY = "xceedSession";

// SHA256 hashing function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Default password hash for "123456"
const DEFAULT_PASSWORD_HASH = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92";

// All 60 users data
// All 60 users data - MODIFIED: All users can access tickets
async function getAllUsersData() {
    return [
        { id: 1, name: "Mohamed Magdy", username: "maadminhe", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: true, spareParts: true, dataManagement: true, logs: true, changePassword: true, qrSystem: true } },
        { id: 2, name: "Mohamed Ahmed Abdel Latif", username: "ma00380", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 3, name: "Nesma Mostafa Aly", username: "na04636", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 4, name: "Rasha Mohamed Ali", username: "ra04610", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 5, name: "Zeinab Ahmed Ali", username: "za03415", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 6, name: "AbdEl Rahman Abdelah", username: "am40278", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: false, spareParts: false, dataManagement: true, logs: false, changePassword: true } },
        { id: 7, name: "Wafaa Khaled", username: "wk04615", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: false, spareParts: false, dataManagement: true, logs: false, changePassword: true } },
        { id: 8, name: "Mostafa Yousef", username: "mmadmin", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: false, spareParts: true, dataManagement: true, logs: false, changePassword: true } },
        { id: 9, name: "Magdy Hassan", username: "ma11224", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 10, name: "Ahmed Kamal", username: "ai32656", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 11, name: "Ahmed Awad", username: "aa10047", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 12, name: "Abdel Hamid Hassanein", username: "ah04597", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: true, spareParts: true, dataManagement: true, logs: true, changePassword: true } },
        { id: 13, name: "Abdel-Rahman Sami", username: "am09352", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 14, name: "Ahmed El-Sayed Osman", username: "ae02594", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 15, name: "Ahmed Hassan Abdelwahab Yousef", username: "ay40374", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 16, name: "Ahmed Ismail Mohamed Ismail", username: "ai40500", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 17, name: "Ahmed Khalifa", username: "ak07119", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 18, name: "Ahmed Mohamed Ahmed Nasary", username: "an40253", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 19, name: "Ahmed Saad Ali Hassan", username: "ah31974", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 20, name: "Akram Fathy Abdel Gaber", username: "aa01344", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 21, name: "Alaa ahmed hanafy", username: "am10932", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 22, name: "Ali Hassan AbdElMogeeb Mohamed", username: "am29821", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 23, name: "Amr Ashraf Mansour Aly", username: "aa30915", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 24, name: "Eslam Ragab Mohamed Ali", username: "ea40571", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 25, name: "Fady Nady Fahem Saadan", username: "fs35385", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 26, name: "Farida Frahat Kamel", username: "fh19340", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 27, name: "Hassan Ahmed Hassan Mahmoud", username: "hm19093", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 28, name: "Hossam Ashraf Ali", username: "ha07645", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 29, name: "Hossam Hamada Ali", username: "ha15770", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 30, name: "Laila Hassan Saad Hassan", username: "lh18170", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 31, name: "Mahmoud Ali Ayoub", username: "ma07876", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 32, name: "Mahmoud Essam AbdelSalam El-Sayed", username: "me40280", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 33, name: "Mahmoud Fathy Mahmoud Hassan", username: "mh22210", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 34, name: "Mahmoud Hesham Mohamed Abdelhamed", username: "ma40212", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 35, name: "Mahmoud Yousry Ragab Abdelmagid", username: "ma40371", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 36, name: "Melad Abeed Metry Tadrous", username: "mt28527", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 37, name: "Mohamed Adham Zaki Shaker", username: "ms40285", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 38, name: "Mohamed Ahmed Abdullah Senger", username: "mm40372", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 39, name: "Mohamed Ahmed Ibrahim", username: "ma08177", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 40, name: "Mohamed Ahmed ElBadawy", username: "mm24993", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 41, name: "Mohamed Ali Kamel Hussain", username: "mh29290", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 42, name: "Mohamed ElHouli", username: "me08876", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 43, name: "Mohamed Gamal Hussien Emam", username: "me09652", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 44, name: "Mohamed SaadElDin", username: "ms11484", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 45, name: "Mohamed Saeed ElSayeh Ahmed", username: "ma27083", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 46, name: "Mohammed Osman Mohammed Gabr", username: "mg09369", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 47, name: "Mokhtar Yehia Mokhtar Salama", username: "ms36142", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 48, name: "Muhamed Ali Ahmed Ali Farahat", username: "mf12625", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 49, name: "Nouh Hamdy Mostafa", username: "nm07532", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 50, name: "Omar Ahmed Hussin Ahmed", username: "oa35386", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 51, name: "Osama Farouk Mahmoud Metwaly", username: "om11654", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 52, name: "Shehab Mohamed Fathy Ibrahim", username: "si40584", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 53, name: "Sherif Naser Ramadan Ahmed", username: "sa17115", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 54, name: "Yousef Adel Sharkawi Ahmed", username: "ya40373", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 55, name: "Youssef Elsayed Kamal Rezk", username: "out305008", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 56, name: "Ahmed Rabie Sief", username: "as02595", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 57, name: "Sherif Bayoumi Ali", username: "sa02088", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 58, name: "XceedUser", username: "xceed", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: true, dataManagement: false, logs: false, changePassword: true } },
        { id: 59, name: "Mohamed Magdy", username: "ma13729", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: true, manageUsers: true, spareParts: true, dataManagement: true, logs: true, changePassword: true } },
        { id: 60, name: "Test User", username: "test", passwordHash: DEFAULT_PASSWORD_HASH, mustChangePassword: true, permissions: { dashboard: true, tickets: true, incidents: false, manageUsers: false, spareParts: false, dataManagement: false, logs: false, changePassword: true } }
    ];
}

// Initialize users database
async function initUsersDB() {
    return new Promise(async (resolve, reject) => {
        const request = indexedDB.open(AUTH_DB_NAME, 3);
        
        request.onerror = () => reject(request.error);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };
        
        request.onupgradeneeded = async (event) => {
            const db = event.target.result;
            
            // Drop existing store if exists (for clean update)
            if (db.objectStoreNames.contains(AUTH_STORE_NAME)) {
                db.deleteObjectStore(AUTH_STORE_NAME);
            }
            
            // Create new store
            const store = db.createObjectStore(AUTH_STORE_NAME, { keyPath: "id" });
            store.createIndex("username", "username", { unique: true });
            
            // Add all 60 users
            const users = await getAllUsersData();
            users.forEach(user => {
                store.add(user);
            });
            console.log("Users database initialized with 60 users. Default password: 123456");
        };
    });
}

// Get user from database by username
async function getUserByUsername(username) {
    return new Promise(async (resolve, reject) => {
        const db = await initUsersDB();
        const transaction = db.transaction([AUTH_STORE_NAME], 'readonly');
        const store = transaction.objectStore(AUTH_STORE_NAME);
        const index = store.index("username");
        const request = index.get(username);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Update user in database
async function updateUser(user) {
    return new Promise(async (resolve, reject) => {
        const db = await initUsersDB();
        const transaction = db.transaction([AUTH_STORE_NAME], 'readwrite');
        const store = transaction.objectStore(AUTH_STORE_NAME);
        const request = store.put(user);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Get all users (admin only)
async function getAllUsers() {
    return new Promise(async (resolve, reject) => {
        const db = await initUsersDB();
        const transaction = db.transaction([AUTH_STORE_NAME], 'readonly');
        const store = transaction.objectStore(AUTH_STORE_NAME);
        const request = store.getAll();
        
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
    });
}

// Login function
async function login(username, password) {
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        
        const hashedPassword = await sha256(password);
        
        if (user.passwordHash === hashedPassword) {
            // Create session
            const session = {
                userId: user.id,
                username: user.username,
                name: user.name,
                permissions: user.permissions,
                mustChangePassword: user.mustChangePassword || false,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            
            if (user.mustChangePassword) {
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
        const user = await getUserByUsername(currentUser.username);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        
        const hashedCurrent = await sha256(currentPassword);
        
        if (user.passwordHash !== hashedCurrent) {
            return { success: false, message: "Current password is incorrect" };
        }
        
        if (newPassword.length < 6) {
            return { success: false, message: "New password must be at least 6 characters" };
        }
        
        // Update password
        user.passwordHash = await sha256(newPassword);
        user.mustChangePassword = false;
        await updateUser(user);
        
        // Update session
        const session = getCurrentUser();
        session.mustChangePassword = false;
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        return { success: true, message: "Password changed successfully" };
    } catch (error) {
        console.error("Change password error:", error);
        return { success: false, message: "An error occurred" };
    }
}

// Reset user password (admin only)
async function resetUserPassword(username, newPassword) {
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.permissions.manageUsers) {
        return { success: false, message: "Unauthorized" };
    }
    
    try {
        const user = await getUserByUsername(username);
        if (!user) {
            return { success: false, message: "User not found" };
        }
        
        user.passwordHash = await sha256(newPassword);
        user.mustChangePassword = true;
        await updateUser(user);
        
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

// Check if user is authenticated
function isAuthenticated() {
    const session = getCurrentUser();
    return session && session.userId && session.loginTime;
}

// Check if user has permission
function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.permissions && user.permissions[permission] === true;
}

// Logout
function logout() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
}

// Require authentication for protected pages
function requireAuth() {
    if (!isAuthenticated()) {
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

// Update UI based on user permissions
function updateUIByPermissions() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Get the tickets nav item
    const ticketsNavItem = document.getElementById('ticketsNavItem');
    
    // Show/hide tickets link based on permission
    if (ticketsNavItem) {
        if (user.permissions && user.permissions.tickets === true) {
            ticketsNavItem.style.display = '';
        } else {
            ticketsNavItem.style.display = 'none';
        }
    }
    
    // Update user name display
    const userNameSpan = document.getElementById('userName');
    const userRoleSpan = document.getElementById('userRole');
    
    if (userNameSpan) {
        userNameSpan.textContent = user.name || user.username;
    }
    if (userRoleSpan) {
        userRoleSpan.innerHTML = (user.permissions && user.permissions.manageUsers) ? '<i class="fas fa-shield-alt"></i> Administrator' : '<i class="fas fa-user"></i> Standard User';
    }
}

// Call this function after login
function initUserInterface() {
    if (isAuthenticated()) {
        updateUIByPermissions();
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        updateUIByPermissions();
    } else {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login.html' && currentPage !== 'change-password.html') {
            window.location.href = 'login.html';
        }
    }
});