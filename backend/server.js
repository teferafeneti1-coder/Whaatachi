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
    // Allow no-origin (Postman, curl, mobile)
    if (!origin) return cb(null, true);
    // Allow any localhost port (dev)
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return cb(null, true);
    // Allow any vercel.app subdomain
    if (/\.vercel\.app$/.test(origin)) return cb(null, true);
    // Allow any onrender.com subdomain
    if (/\.onrender\.com$/.test(origin)) return cb(null, true);
    // Allow configured FRONTEND_URL (strip trailing slash for comparison)
    const allowed = (process.env.FRONTEND_URL || '').replace(/\/$/, '');
    if (allowed && origin === allowed) return cb(null, true);
    // Log rejected origin for debugging
    console.log('CORS blocked:', origin);
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

// ONE-TIME admin reset endpoint — secured with a secret token
app.get('/setup-admin', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== 'whaatachi-setup-2024') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('admin123', 12);
    // Delete existing admins
    await supabase.from('users').delete().eq('is_admin', true);
    // Create fresh admin
    const { data, error } = await supabase.from('users').insert([{
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
    }]).select('id, full_name').single();
    if (error) throw error;
    res.json({ success: true, message: 'Admin reset! Login: admin / admin123', id: data.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ success: false, message: 'File too large. Max 5MB.' });
  res.status(500).json({ success: false, message: err.message || 'Server error' });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

async function start() {
  // Start server first — don't block on DB
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

  // Then test Supabase
  console.log('🔌 Testing Supabase connection...');
  console.log('   SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ set' : '❌ MISSING');
  console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ set' : '❌ MISSING');

  const { error } = await supabase.from('users').select('id').limit(1);

  if (error && error.code !== 'PGRST116') {
    console.error('❌ Supabase connection failed:', error.message);
    console.error('   Server still running — fix env vars and redeploy');
    return; // Don't exit — keep server alive
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
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});

// Keep-alive ping — prevents Render free tier from sleeping
if (process.env.RENDER_EXTERNAL_URL) {
  const https = require('https');
  setInterval(() => {
    https.get(`${process.env.RENDER_EXTERNAL_URL}/api/health`, (res) => {
      console.log(`🏓 Keep-alive ping: ${res.statusCode}`);
    }).on('error', () => {});
  }, 10 * 60 * 1000); // every 10 minutes
}
