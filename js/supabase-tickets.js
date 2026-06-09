// js/supabase-tickets.js

// Get all tickets from Supabase
async function getAllTickets() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    try {
        let query = supabase
            .from(TABLES.TICKETS)
            .select('*')
            .order('created_at', { ascending: false });
        
        // إذا لم يكن المسؤول، عرض فقط تذاكره
        if (!currentUser.permissions.manageUsers) {
            query = query.eq('user_id', currentUser.userId);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching tickets:', error);
            return [];
        }
        
        // تحويل البيانات إلى نفس التنسيق القديم
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
    const currentUser = getCurrentUser();
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
    
    let result;
    
    if (ticket.id) {
        // تحديث تذكرة موجودة
        const { data, error } = await supabase
            .from(TABLES.TICKETS)
            .update(ticketData)
            .eq('id', ticket.id)
            .select();
        
        if (error) throw error;
        result = data;
    } else {
        // إضافة تذكرة جديدة
        const { data, error } = await supabase
            .from(TABLES.TICKETS)
            .insert(ticketData)
            .select();
        
        if (error) throw error;
        result = data;
    }
    
    return result;
}

// Delete ticket from Supabase
async function deleteTicketFromDB(id) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Not authenticated');
    }
    
    let query = supabase
        .from(TABLES.TICKETS)
        .delete()
        .eq('id', id);
    
    // إذا لم يكن المسؤول، تأكد من أن التذكرة تخصه
    if (!currentUser.permissions.manageUsers) {
        query = query.eq('user_id', currentUser.userId);
    }
    
    const { error } = await query;
    
    if (error) throw error;
    return true;
}