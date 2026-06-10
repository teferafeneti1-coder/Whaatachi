if (!process.env.SUPABASE_URL) require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');
const path    = require('path');
const bcrypt  = require('bcryptjs');

const app      = express();
const supabase = require('./supabase');

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan('dev'));

app.use(cors({
  origin: (origin, cb) => {
    // Allow no-origin requests (Postman, curl) and any localhost port
    if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
    cb(null, false);
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/users',    require('./routes/users'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/admin',    require('./routes/admin'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', db: 'supabase', timestamp: new Date().toISOString() })
);

// Root route — shows API info instead of 404
app.get('/', (req, res) => {
  res.json({
    name: 'Whaatachi API',
    status: '✅ running',
    version: '1.0.0',
    docs: {
      health: '/api/health',
      users: '/api/users',
      payments: '/api/payments',
      admin: '/api/admin',
    },
  });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start() {
  // Quick connectivity test via Supabase
  console.log('🔌 Testing Supabase connection...');
  const { error } = await supabase.from('users').select('id').limit(1);

  if (error && error.code !== 'PGRST116') {  // PGRST116 = "table empty" — that's fine
    console.error('❌ Supabase connection failed:', error.message);
    console.error('   Check SUPABASE_URL and SUPABASE_SERVICE_KEY in .env');
    process.exit(1);
  }

  console.log('✅ Supabase connected!');

  // Seed admin if missing
  const { data: existing } = await supabase.from('users').select('id').eq('is_admin', true).limit(1);
  if (!existing || existing.length === 0) {
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
    if (seedErr) console.warn('⚠️  Could not seed admin:', seedErr.message);
    else console.log('👤 Admin seeded — login: admin / admin123');
  } else {
    console.log('👤 Admin user exists');
  }

  app.listen(PORT, () => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';
    const backendUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
    console.log('');
    console.log('🚀 ─────────────────────────────────────────');
    console.log(`   Backend:   ${backendUrl}`);
    console.log(`   Frontend:  ${frontendUrl}`);
    console.log(`   Admin:     ${frontendUrl}/admin/login`);
    console.log('────────────────────────────────────────────');
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
