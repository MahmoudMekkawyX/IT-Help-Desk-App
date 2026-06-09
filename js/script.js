// ============================================
// DARK MODE TOGGLE
// ============================================
(function initDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        const icon = darkModeToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        }
    }
    
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const icon = this.querySelector('i');
        const isDark = body.classList.contains('dark-mode');
        
        if (icon) {
            if (isDark) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        }
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
})();

// ============================================
// GLOBAL SEARCH
// ============================================
(function initGlobalSearch() {
    const globalSearch = document.getElementById('globalSearch');
    if (!globalSearch) return;
    
    globalSearch.addEventListener('keyup', function() {
        const term = this.value.toLowerCase().trim();
        const cards = document.querySelectorAll('.feature-card, .info-card, .cycle-card, .guide-card, .link-card');
        
        cards.forEach(function(card) {
            const text = card.innerText.toLowerCase();
            if (term === '' || text.includes(term)) {
                card.style.display = '';
                const parent = card.closest('.col-md-6, .col-lg-4, .col');
                if (parent) parent.style.display = '';
            } else {
                card.style.display = 'none';
                const parent = card.closest('.col-md-6, .col-lg-4, .col');
                if (parent && parent.querySelectorAll('.feature-card, .info-card, .cycle-card, .guide-card, .link-card:not([style*="display: none"])').length === 0) {
                    parent.style.display = 'none';
                } else if (parent) {
                    parent.style.display = '';
                }
            }
        });
    });
})();

// ============================================
// EXTERNAL LINKS HANDLER
// ============================================
(function initExternalLinks() {
    const links = document.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('file://') || href.startsWith('\\\\'))) {
            if (!href.includes(window.location.hostname) && !href.startsWith('#') && href !== '#') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }
})();

// ============================================
// SCROLL PROGRESS BAR
// ============================================
(function initScrollProgress() {
    let progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = 'position: fixed; top: 0; left: 0; height: 3px; background: linear-gradient(90deg, #2d9c7c, #3dbd98); z-index: 9999; transition: width 0.1s; width: 0%;';
        document.body.appendChild(progressBar);
    }
    
    window.addEventListener('scroll', function() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        progressBar.style.width = scrolled + '%';
    });
})();

// ============================================
// SUPABASE TICKETS SYSTEM
// ============================================
(function initTicketSystem() {
    // Check if we're on the tickets page
    const ticketForm = document.getElementById('ticketForm');
    if (!ticketForm) return;
    
    console.log('Ticket system initializing with Supabase...');
    
    let deletePendingId = null;
    
    // Toast notification function
    function showToast(msg, isError) {
        let toast = document.querySelector('.toast-notify');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast-notify';
            toast.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 40px; z-index: 9999; display: none; font-size: 14px;';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.background = isError ? '#ef4444' : '#10b981';
        toast.style.display = 'block';
        setTimeout(function() { 
            toast.style.display = 'none'; 
        }, 2500);
    }
    
    // Escape HTML to prevent XSS
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    
    // Scripts Library (12 scripts)
    const scriptsLibrary = [
        { id: 1, type: "Access", title: "USB Access Request", desc: "Request USB access for specific device", additional: "Device ID: ______\nPC Name: ______\nDuration: ______\nBusiness Need: ______" },
        { id: 2, type: "Access", title: "Device Access Request", desc: "Request access for managed devices", additional: "Device IDs: ______\nBusiness Need: ______" },
        { id: 3, type: "Other", title: "Data Restoration", desc: "Restore lost data from backup", additional: "Last seen date: ______\nFile path: ______" },
        { id: 4, type: "Access", title: "Website Access", desc: "Request website whitelist", additional: "URL: ______\nLogin method: ______" },
        { id: 5, type: "Cisco", title: "Cisco Softphone Issue", desc: "Cannot login to Cisco Softphone", additional: "MAC Address: ______\nError message: ______" },
        { id: 6, type: "Cisco", title: "Cisco Hardware Issue", desc: "Cisco device login error", additional: "Extension: ______\nMAC/Port: ______" },
        { id: 7, type: "Access", title: "Bulk Password Reset", desc: "Reset passwords for more than 15 users", additional: "Number of users: ______\nBusiness Need: ______" },
        { id: 8, type: "Network", title: "Service Down Report", desc: "SPV Mobile application is down", additional: "URL: ______\nTime range: ______\nScreenshot attached" },
        { id: 9, type: "Hardware", title: "Data Migration", desc: "Transfer data between devices", additional: "Old PC: ______\nNew PC: ______\nData size: ______" },
        { id: 10, type: "VPN", title: "VPN Access", desc: "Request VPN for remote work", additional: "User mobile: ______\nBusiness Need: ______" },
        { id: 11, type: "Hardware", title: "Hardware Replacement", desc: "Replace faulty component", additional: "PC Name: ______\nComponent: ______" },
        { id: 12, type: "Network", title: "Link/URL Issue", desc: "Broken or blocked link", additional: "URL: ______\nError message: ______\nTroubleshooting done: ______" }
    ];
    
    // Render scripts list
    function renderScripts(filter) {
        const container = document.getElementById('scriptsContainer');
        if (!container) return;
        
        const searchTerm = (filter || '').toLowerCase();
        const filtered = [];
        
        for (var i = 0; i < scriptsLibrary.length; i++) {
            if (scriptsLibrary[i].title.toLowerCase().includes(searchTerm)) {
                filtered.push(scriptsLibrary[i]);
            }
        }
        
        const scriptsCountEl = document.getElementById('totalScriptsCount');
        if (scriptsCountEl) scriptsCountEl.innerText = filtered.length;
        
        if (filtered.length === 0) {
            container.innerHTML = '<div class="text-center py-4 text-muted">No scripts found</div>';
            return;
        }
        
        let html = '';
        for (var j = 0; j < filtered.length; j++) {
            var s = filtered[j];
            html += '<div class="script-item" data-id="' + s.id + '">';
            html += '<div class="d-flex justify-content-between align-items-start">';
            html += '<div><i class="fas fa-code-branch me-2" style="color: var(--accent, #2d9c7c);"></i>';
            html += '<strong>' + escapeHtml(s.title) + '</strong>';
            html += '<div><span class="badge bg-secondary mt-1">' + escapeHtml(s.type) + '</span></div></div>';
            html += '<i class="fas fa-chevron-right" style="color: var(--accent, #2d9c7c);"></i>';
            html += '</div></div>';
        }
        container.innerHTML = html;
        
        // Add click handlers to script items
        var scriptItems = document.querySelectorAll('.script-item');
        for (var k = 0; k < scriptItems.length; k++) {
            var tile = scriptItems[k];
            tile.addEventListener('click', function(e) {
                var id = parseInt(this.getAttribute('data-id'));
                var script = null;
                for (var m = 0; m < scriptsLibrary.length; m++) {
                    if (scriptsLibrary[m].id === id) {
                        script = scriptsLibrary[m];
                        break;
                    }
                }
                if (script) {
                    document.getElementById('ticketType').value = script.type;
                    document.getElementById('ticketTitle').value = script.title;
                    document.getElementById('description').value = script.desc;
                    document.getElementById('additionalData').value = script.additional;
                    document.getElementById('ticketId').value = '';
                    document.getElementById('requesterName').value = '';
                    document.getElementById('requesterContact').value = '';
                    document.getElementById('lineManager').value = '';
                    document.getElementById('ticketStatus').value = 'Open';
                    showToast('Loaded: ' + script.title, false);
                }
                var allTiles = document.querySelectorAll('.script-item');
                for (var n = 0; n < allTiles.length; n++) {
                    allTiles[n].classList.remove('active');
                }
                this.classList.add('active');
            });
        }
    }
    
    // Get current user from auth
    function getCurrentUserFromAuth() {
        if (typeof window.getCurrentUser === 'function') {
            return window.getCurrentUser();
        }
        const session = localStorage.getItem('xceedSession');
        if (session) {
            try {
                return JSON.parse(session);
            } catch(e) {
                return null;
            }
        }
        return null;
    }
    
    // Get all tickets from Supabase
    async function getAllTickets() {
        const currentUser = getCurrentUserFromAuth();
        if (!currentUser) return [];
        
        try {
            let query = supabase
                .from('tickets')
                .select('*')
                .order('created_at', { ascending: false });
            
            // إذا لم يكن المسؤول، عرض فقط تذاكره
            if (!currentUser.permissions?.manageUsers) {
                query = query.eq('user_id', currentUser.userId);
            }
            
            const { data, error } = await query;
            
            if (error) {
                console.error('Error fetching tickets:', error);
                return [];
            }
            
            // تحويل البيانات إلى التنسيق المطلوب
            return (data || []).map(ticket => ({
                id: ticket.id,
                type: ticket.type,
                status: ticket.status,
                title: ticket.title,
                requesterName: ticket.requester_name,
                requesterContact: ticket.requester_contact,
                lineManager: ticket.line_manager,
                description: ticket.description,
                additionalData: ticket.additional_data,
                createdAt: ticket.created_at
            }));
        } catch (error) {
            console.error('Get tickets error:', error);
            return [];
        }
    }
    
    // Save ticket to Supabase
    async function saveTicketToDB(ticket) {
        const currentUser = getCurrentUserFromAuth();
        if (!currentUser) {
            throw new Error('Not authenticated');
        }
        
        const ticketData = {
            user_id: currentUser.userId,
            type: ticket.type,
            status: ticket.status || 'Open',
            title: ticket.title,
            requester_name: ticket.requesterName,
            requester_contact: ticket.requesterContact || '',
            line_manager: ticket.lineManager || '',
            description: ticket.description,
            additional_data: ticket.additionalData || ''
        };
        
        if (ticket.id) {
            // تحديث تذكرة موجودة
            const { data, error } = await supabase
                .from('tickets')
                .update(ticketData)
                .eq('id', ticket.id)
                .select();
            
            if (error) throw error;
            return data;
        } else {
            // إضافة تذكرة جديدة
            const { data, error } = await supabase
                .from('tickets')
                .insert(ticketData)
                .select();
            
            if (error) throw error;
            return data;
        }
    }
    
    // Delete ticket from Supabase
    async function deleteTicketFromDB(id) {
        const currentUser = getCurrentUserFromAuth();
        if (!currentUser) {
            throw new Error('Not authenticated');
        }
        
        let query = supabase.from('tickets').delete().eq('id', id);
        
        if (!currentUser.permissions?.manageUsers) {
            query = query.eq('user_id', currentUser.userId);
        }
        
        const { error } = await query;
        if (error) throw error;
        return true;
    }
    
    // Render tickets table
    async function renderTicketsTable() {
        const searchInput = document.getElementById('searchTickets');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        
        let tickets = [];
        try {
            tickets = await getAllTickets();
        } catch(e) {
            console.error('Error loading tickets:', e);
            tickets = [];
        }
        
        const ticketsCountEl = document.getElementById('totalTicketsCount');
        if (ticketsCountEl) ticketsCountEl.innerText = tickets.length;
        
        const filtered = [];
        for (var i = 0; i < tickets.length; i++) {
            var t = tickets[i];
            var titleMatch = t.title && t.title.toLowerCase().includes(searchTerm);
            var requesterMatch = t.requesterName && t.requesterName.toLowerCase().includes(searchTerm);
            if (titleMatch || requesterMatch || searchTerm === '') {
                filtered.push(t);
            }
        }
        
        const tbody = document.getElementById('ticketsTableBody');
        if (!tbody) return;
        
        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-muted">No tickets found</td></tr>';
            return;
        }
        
        let html = '';
        for (var j = 0; j < filtered.length; j++) {
            var t = filtered[j];
            var status = t.status || 'Open';
            var statusClass = '';
            if (status === 'Open') statusClass = 'status-open';
            else if (status === 'In Progress') statusClass = 'status-progress';
            else if (status === 'Resolved') statusClass = 'status-resolved';
            else statusClass = 'status-closed';
            
            html += '<tr>';
            html += '<td>' + t.id + '</td>';
            html += '<td><span class="badge" style="background: var(--accent, #2d9c7c);">' + escapeHtml(t.type) + '</span></td>';
            html += '<td><strong>' + escapeHtml(t.title) + '</strong><br><small class="text-muted">' + escapeHtml((t.description || '').substring(0, 40)) + '...</small></td>';
            html += '<td>' + escapeHtml(t.requesterName) + '</td>';
            html += '<td><span class="status-badge ' + statusClass + '">' + status + '</span></td>';
            html += '<td>' + (t.createdAt ? new Date(t.createdAt).toLocaleDateString() : '-') + '</td>';
            html += '<td>';
            html += '<button class="btn btn-sm btn-outline-custom edit-ticket me-1" data-id="' + t.id + '"><i class="fas fa-edit"></i></button>';
            html += '<button class="btn btn-sm btn-outline-danger delete-ticket" data-id="' + t.id + '"><i class="fas fa-trash-alt"></i></button>';
            html += '</td></tr>';
        }
        tbody.innerHTML = html;
        
        // Edit handlers
        var editButtons = document.querySelectorAll('.edit-ticket');
        for (var k = 0; k < editButtons.length; k++) {
            editButtons[k].addEventListener('click', async function(e) {
                var id = parseInt(this.getAttribute('data-id'));
                var ticketsList = await getAllTickets();
                var ticket = null;
                for (var m = 0; m < ticketsList.length; m++) {
                    if (ticketsList[m].id === id) {
                        ticket = ticketsList[m];
                        break;
                    }
                }
                if (ticket) {
                    document.getElementById('ticketId').value = ticket.id;
                    document.getElementById('ticketType').value = ticket.type;
                    document.getElementById('ticketTitle').value = ticket.title;
                    document.getElementById('requesterName').value = ticket.requesterName;
                    document.getElementById('requesterContact').value = ticket.requesterContact || '';
                    document.getElementById('lineManager').value = ticket.lineManager || '';
                    document.getElementById('description').value = ticket.description;
                    document.getElementById('additionalData').value = ticket.additionalData || '';
                    document.getElementById('ticketStatus').value = ticket.status;
                    showToast('Editing ticket #' + ticket.id, false);
                }
            });
        }
        
        // Delete handlers
        var deleteButtons = document.querySelectorAll('.delete-ticket');
        for (var n = 0; n < deleteButtons.length; n++) {
            deleteButtons[n].addEventListener('click', function(e) {
                deletePendingId = parseInt(this.getAttribute('data-id'));
                var modalEl = document.getElementById('deleteModal');
                if (modalEl) {
                    var modal = new bootstrap.Modal(modalEl);
                    modal.show();
                }
            });
        }
    }
    
    // Handle save ticket
    async function handleSaveTicket() {
        console.log('Save ticket called');
        
        // Get form values
        const ticketId = document.getElementById('ticketId').value;
        const ticketType = document.getElementById('ticketType').value;
        const ticketStatus = document.getElementById('ticketStatus').value;
        const ticketTitle = document.getElementById('ticketTitle').value;
        const requesterName = document.getElementById('requesterName').value;
        const requesterContact = document.getElementById('requesterContact').value;
        const lineManager = document.getElementById('lineManager').value;
        const description = document.getElementById('description').value;
        const additionalData = document.getElementById('additionalData').value;
        
        // Validate required fields
        if (!ticketType) {
            showToast('Please select a ticket type', true);
            return;
        }
        if (!ticketTitle.trim()) {
            showToast('Please enter a title', true);
            return;
        }
        if (!requesterName.trim()) {
            showToast('Please enter requester name', true);
            return;
        }
        if (!description.trim()) {
            showToast('Please enter a description', true);
            return;
        }
        
        // Create ticket object
        const ticket = {
            type: ticketType,
            status: ticketStatus,
            title: ticketTitle.trim(),
            requesterName: requesterName.trim(),
            requesterContact: requesterContact,
            lineManager: lineManager,
            description: description.trim(),
            additionalData: additionalData,
            createdAt: new Date().toISOString()
        };
        
        if (ticketId) {
            ticket.id = parseInt(ticketId);
        }
        
        console.log('Saving ticket:', ticket);
        
        try {
            await saveTicketToDB(ticket);
            showToast(ticket.id ? 'Ticket updated successfully!' : 'Ticket saved successfully!', false);
            
            // Reset form
            document.getElementById('ticketForm').reset();
            document.getElementById('ticketId').value = '';
            document.getElementById('ticketStatus').value = 'Open';
            
            // Refresh table
            await renderTicketsTable();
        } catch(error) {
            console.error('Error saving ticket:', error);
            showToast('Error saving ticket: ' + error.message, true);
        }
    }
    
    // Copy all tickets to clipboard
    async function copyAllToClipboard() {
        let tickets = [];
        try {
            tickets = await getAllTickets();
        } catch(e) {
            console.error('Error loading tickets:', e);
            tickets = [];
        }
        
        if (tickets.length === 0) {
            showToast('No tickets to copy', true);
            return;
        }
        
        let text = "═══════════════════════════════════════\n";
        text += "        XCEED TICKETS REPORT\n";
        text += "═══════════════════════════════════════\n";
        text += "Date: " + new Date().toLocaleString() + "\n";
        text += "Total Tickets: " + tickets.length + "\n";
        text += "═══════════════════════════════════════\n\n";
        
        for (var i = 0; i < tickets.length; i++) {
            var t = tickets[i];
            text += "[" + (i+1) + "] Ticket #" + t.id + "\n";
            text += "├─ Type: " + (t.type || '—') + "\n";
            text += "├─ Title: " + (t.title || '—') + "\n";
            text += "├─ Requester: " + (t.requesterName || '—') + "\n";
            text += "├─ Contact: " + (t.requesterContact || '—') + "\n";
            text += "├─ Manager: " + (t.lineManager || '—') + "\n";
            text += "├─ Status: " + (t.status || 'Open') + "\n";
            text += "├─ Description: " + (t.description || '—') + "\n";
            text += "├─ Additional: " + (t.additionalData || '—') + "\n";
            text += "└─ Date: " + (t.createdAt ? new Date(t.createdAt).toLocaleString() : '—') + "\n";
            text += "───────────────────────────────────────\n\n";
        }
        
        try {
            await navigator.clipboard.writeText(text);
            showToast('Copied ' + tickets.length + ' tickets to clipboard!', false);
        } catch(e) {
            showToast('Failed to copy to clipboard', true);
        }
    }
    
    // Export tickets to CSV
    async function exportToCSV() {
        let tickets = [];
        try {
            tickets = await getAllTickets();
        } catch(e) {
            console.error('Error loading tickets:', e);
            tickets = [];
        }
        
        if (tickets.length === 0) {
            showToast('No tickets to export', true);
            return;
        }
        
        const headers = ["ID", "Type", "Title", "Requester", "Contact", "Manager", "Status", "Description", "Additional Data", "Created Date"];
        const rows = [headers];
        
        for (var i = 0; i < tickets.length; i++) {
            var t = tickets[i];
            rows.push([
                t.id,
                t.type || '',
                t.title || '',
                t.requesterName || '',
                t.requesterContact || '',
                t.lineManager || '',
                t.status || 'Open',
                t.description || '',
                t.additionalData || '',
                t.createdAt ? new Date(t.createdAt).toLocaleString() : ''
            ]);
        }
        
        // Build CSV content
        let csvContent = "";
        for (var r = 0; r < rows.length; r++) {
            var row = rows[r];
            var rowStr = "";
            for (var c = 0; c < row.length; c++) {
                var cell = String(row[c] || '');
                cell = cell.replace(/"/g, '""');
                if (c > 0) rowStr += ",";
                rowStr += '"' + cell + '"';
            }
            csvContent += rowStr + "\n";
        }
        
        const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'tickets_export_' + Date.now() + '.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Exported ' + tickets.length + ' tickets to CSV!', false);
    }
    
    // Initialize the tickets page
    async function init() {
        console.log('Initializing ticket system with Supabase...');
        
        try {
            // التحقق من وجود Supabase
            if (typeof supabase === 'undefined') {
                console.error('Supabase not loaded!');
                showToast('Supabase not loaded. Please refresh the page.', true);
                return;
            }
            
            renderScripts('');
            await renderTicketsTable();
            
            // Save button handler
            const saveBtn = document.getElementById('saveTicketBtn');
            if (saveBtn) {
                saveBtn.addEventListener('click', handleSaveTicket);
                console.log('Save button handler attached');
            }
            
            // Clear button handler
            const clearBtn = document.getElementById('clearFormBtn');
            if (clearBtn) {
                clearBtn.addEventListener('click', function() {
                    document.getElementById('ticketForm').reset();
                    document.getElementById('ticketId').value = '';
                    showToast('Form cleared', false);
                });
            }
            
            // Confirm delete handler
            const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
            if (confirmDeleteBtn) {
                confirmDeleteBtn.addEventListener('click', async function() {
                    if (deletePendingId) {
                        try {
                            await deleteTicketFromDB(deletePendingId);
                            await renderTicketsTable();
                            showToast('Ticket deleted successfully', false);
                            deletePendingId = null;
                            
                            const modalEl = document.getElementById('deleteModal');
                            if (modalEl) {
                                const modal = bootstrap.Modal.getInstance(modalEl);
                                if (modal) modal.hide();
                            }
                        } catch(e) {
                            showToast('Error deleting ticket', true);
                        }
                    }
                });
            }
            
            // Search scripts handler
            const searchScripts = document.getElementById('searchScripts');
            if (searchScripts) {
                searchScripts.addEventListener('input', function(e) {
                    renderScripts(e.target.value);
                });
            }
            
            // Search tickets handler
            const searchTickets = document.getElementById('searchTickets');
            if (searchTickets) {
                searchTickets.addEventListener('input', function() {
                    renderTicketsTable();
                });
            }
            
            // Export CSV handler
            const exportBtn = document.getElementById('exportCsvBtn');
            if (exportBtn) {
                exportBtn.addEventListener('click', exportToCSV);
            }
            
            // Copy to clipboard handler
            const copyBtn = document.getElementById('copyToClipboardBtn');
            if (copyBtn) {
                copyBtn.addEventListener('click', copyAllToClipboard);
            }
            
            showToast('Ticket system ready!', false);
            
        } catch(error) {
            console.error('Initialization error:', error);
            showToast('Error initializing system. Please refresh the page.', true);
        }
    }
    
    // Start initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

// ============================================
// AUTHENTICATION FUNCTIONS (Supabase Version)
// ============================================

function getCurrentUser() {
    const session = localStorage.getItem('xceedSession');
    if (!session) return null;
    try {
        return JSON.parse(session);
    } catch(e) {
        return null;
    }
}

function isAuthenticated() {
    const session = localStorage.getItem('xceedSession');
    if (!session) return false;
    try {
        const sessionData = JSON.parse(session);
        return sessionData && sessionData.userId && sessionData.loginTime;
    } catch(e) {
        return false;
    }
}

function logout() {
    // حذف الجلسة من Supabase إذا كانت موجودة
    const session = getCurrentUser();
    if (session && session.sessionToken && typeof supabase !== 'undefined') {
        supabase.from('sessions').delete().eq('session_token', session.sessionToken).then(() => {
            console.log('Session deleted from Supabase');
        }).catch(err => console.error('Error deleting session:', err));
    }
    localStorage.removeItem('xceedSession');
    window.location.href = 'login.html';
}

function hasPermission(permission) {
    const user = getCurrentUser();
    if (!user) return false;
    return user.permissions && user.permissions[permission] === true;
}

// Update UI based on user permissions
function updateUserDisplay() {
    const user = getCurrentUser();
    if (!user) return;
    
    console.log('Updating UI for user:', user.username);
    
    const userNameSpan = document.getElementById('userName');
    const userRoleSpan = document.getElementById('userRole');
    const ticketsLink = document.querySelector('a[href="tickets.html"]');
    
    if (userNameSpan) {
        userNameSpan.textContent = user.name || user.username;
    }
    
    if (userRoleSpan) {
        const isAdmin = user.permissions && user.permissions.manageUsers === true;
        userRoleSpan.innerHTML = isAdmin ? '<i class="fas fa-shield-alt"></i> Administrator' : '<i class="fas fa-user"></i> Standard User';
    }
    
    // ALL users can see tickets link now
    if (ticketsLink) {
        ticketsLink.style.display = '';
        console.log('Tickets link is visible for all users');
    }
}

// Call this on page load
document.addEventListener('DOMContentLoaded', function() {
    if (isAuthenticated()) {
        updateUserDisplay();
    } else {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage !== 'login.html' && currentPage !== 'change-password.html') {
            window.location.href = 'login.html';
        }
    }
});

// Export functions for global use
window.getCurrentUser = getCurrentUser;
window.isAuthenticated = isAuthenticated;
window.logout = logout;
window.hasPermission = hasPermission;
window.updateUserDisplay = updateUserDisplay;