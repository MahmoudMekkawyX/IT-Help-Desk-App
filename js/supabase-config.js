// ملف جديد: js/supabase-config.js

// تكوين Supabase (يجب استبدال هذه القيم بقيم مشروعك الفعلية)
const SUPABASE_URL = 'https://mezigkjjtncajdqfszel.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_gPsxS4_yAkWjs7ea9Wf4xA__j2CzKa-';

// تهيئة عميل Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// أسماء الجداول
const TABLES = {
    USERS: 'users',
    SESSIONS: 'sessions',
    TICKETS: 'tickets',
    ASSET_TRANSACTIONS: 'asset_transactions'
};

// تصدير العميل
window.supabase = supabaseClient;
window.TABLES = TABLES;
