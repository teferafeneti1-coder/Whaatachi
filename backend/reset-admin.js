// Run this once to reset the admin password in Supabase
// Usage: node reset-admin.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function resetAdmin() {
  console.log('🔑 Resetting admin user...');

  const hash = await bcrypt.hash('admin123', 12);

  // Delete any existing admin
  const { error: delErr } = await supabase
    .from('users')
    .delete()
    .eq('is_admin', true);

  if (delErr) console.warn('Delete warning:', delErr.message);

  // Create fresh admin
  const { data, error } = await supabase
    .from('users')
    .insert([{
      full_name: 'admin',
      gender: 'male',
      connection_goal: 'relationship',
      is_admin: true,
      is_approved: true,
      password_hash: hash,
      photo_url: '',
      telegram_username: '',
      phone_number: '',
      instagram_username: '',
    }])
    .select('id, full_name')
    .single();

  if (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }

  console.log('✅ Admin reset successfully!');
  console.log('   Username: admin');
  console.log('   Password: admin123');
  console.log('   ID:', data.id);
  process.exit(0);
}

resetAdmin().catch(e => { console.error(e); process.exit(1); });
