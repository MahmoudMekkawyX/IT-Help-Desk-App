// js/supabase-assets.js

// Get all asset transactions
async function getAllTransactions() {
    const currentUser = getCurrentUser();
    if (!currentUser) return [];
    
    try {
        let query = supabase
            .from(TABLES.ASSET_TRANSACTIONS)
            .select('*')
            .order('transaction_date', { ascending: false });
        
        // إذا لم يكن المسؤول، عرض فقط معاملاته
        if (!currentUser.permissions.manageUsers) {
            query = query.eq('user_id', currentUser.userId);
        }
        
        const { data, error } = await query;
        
        if (error) {
            console.error('Error fetching transactions:', error);
            return [];
        }
        
        // تحويل البيانات إلى نفس التنسيق
        return (data || []).map(t => ({
            id: t.id,
            employeeName: t.employee_name,
            nationalId: t.national_id,
            project: t.project,
            employeeId: t.employee_id,
            computerSerial: t.computer_serial,
            monitorSerial: t.monitor_serial,
            accessorySerial: t.accessory_serial,
            deviceModel: t.device_model,
            warranty: t.warranty,
            transactionType: t.transaction_type,
            condition: t.condition,
            mismatchDetails: t.mismatch_details,
            itSupportName: t.it_support_name,
            mobileNumber: t.mobile_number,
            notes: t.notes,
            date: t.transaction_date
        }));
    } catch (error) {
        console.error('Get transactions error:', error);
        return [];
    }
}

// Save transaction to Supabase
async function saveTransaction(record) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Not authenticated');
    }
    
    const transactionData = {
        user_id: currentUser.userId,
        employee_name: record.employeeName,
        national_id: record.nationalId,
        project: record.project,
        employee_id: record.employeeId,
        computer_serial: record.computerSerial,
        monitor_serial: record.monitorSerial,
        accessory_serial: record.accessorySerial,
        device_model: record.deviceModel,
        warranty: record.warranty,
        transaction_type: record.transactionType,
        condition: record.condition,
        mismatch_details: record.mismatchDetails,
        it_support_name: record.itSupportName,
        mobile_number: record.mobileNumber,
        notes: record.notes,
        transaction_date: record.date || new Date().toISOString()
    };
    
    let result;
    
    if (record.id) {
        const { data, error } = await supabase
            .from(TABLES.ASSET_TRANSACTIONS)
            .update(transactionData)
            .eq('id', record.id)
            .select();
        
        if (error) throw error;
        result = data;
    } else {
        const { data, error } = await supabase
            .from(TABLES.ASSET_TRANSACTIONS)
            .insert(transactionData)
            .select();
        
        if (error) throw error;
        result = data;
    }
    
    return result;
}

// Delete transaction from Supabase
async function deleteTransaction(id) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        throw new Error('Not authenticated');
    }
    
    let query = supabase
        .from(TABLES.ASSET_TRANSACTIONS)
        .delete()
        .eq('id', id);
    
    if (!currentUser.permissions.manageUsers) {
        query = query.eq('user_id', currentUser.userId);
    }
    
    const { error } = await query;
    
    if (error) throw error;
    return true;
}