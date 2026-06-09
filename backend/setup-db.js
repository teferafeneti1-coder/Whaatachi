require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setup() {
  console.log('🔌 Connecting to Supabase...');

  // Test connection
  const { data, error } = await supabase.from('users').select('id').limit(1);

  if (error && error.code === '42P01') {
    // Table doesn't exist — need to create it via SQL editor
    console.log('');
    console.log('⚠️  Tables not found. You need to run the SQL schema first.');
    console.log('');
    console.log('1. Open this URL in your browser:');
    console.log('   https://supabase.com/dashboard/project/arlrfuxmjtzjvsttukdt/sql/new');
    console.log('');
    console.log('2. Paste this SQL and click RUN:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  photo_url text default '',
  telegram_username text default '',
  phone_number text default '',
  instagram_username text default '',
  age integer,
  gender text not null check (gender in ('male','female')),
  connection_goal text not null check (connection_goal in ('relationship','dating','fwb','casual')),
  is_approved boolean default false,
  is_admin boolean default false,
  password_hash text,
  created_at timestamptz default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payer_info text not null,
  viewed_user_id uuid references public.users(id) on delete cascade,
  amount integer default 200,
  method text not null check (method in ('telebirr','cbe')),
  status text default 'pending' check (status in ('pending','verified','rejected')),
  created_at timestamptz default now()
);

alter table public.users disable row level security;
alter table public.payments disable row level security;
    `);
    console.log('─────────────────────────────────────────────────────');
    console.log('3. After running the SQL, run this script again: node setup-db.js');
    process.exit(0);
  }

  if (error) {
    console.error('❌ Supabase error:', error.message);
    process.exit(1);
  }

  console.log('✅ Tables exist! Connected successfully.');

  // Seed admin
  const { data: admins } = await supabase
    .from('users')
    .select('id')
    .eq('is_admin', true)
    .limit(1);

  if (!admins || admins.length === 0) {
    const hash = await bcrypt.hash('admin123', 12);
    const { error: seedErr } = await supabase.from('users').insert([{
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
    }]);
    if (seedErr) console.error('❌ Admin seed failed:', seedErr.message);
    else console.log('👤 Admin created: username=admin  password=admin123');
  } else {
    console.log('👤 Admin already exists');
  }

  console.log('');
  console.log('✅ Database ready! Now run: node server.js');
  process.exit(0);
}

setup().catch(e => { console.error(e); process.exit(1); });
