const express = require('express');
const path = require('path');
require('dotenv').config();

const indexRoutes = require('./routes/index.routes');
const itemRoutes = require('./routes/item.routes');
const rentalRoutes = require('./routes/rental.routes');
const prisma = require('./config/db');

const app = express();
let currentPort = Number(process.env.PORT) || 3002;

// 1. Konfigurasi View Engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// 2. Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 3. Global Template Helpers & Variables
app.use((req, res, next) => {
  res.locals.appName = 'SEWA AJA';
  res.locals.schoolName = 'SMK Telkom Lampung';
  res.locals.formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number || 0);
  };
  res.locals.formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  next();
});

// 4. Mount Routes
app.use('/', indexRoutes);
app.use('/items', itemRoutes);
app.use('/rentals', rentalRoutes);

// 5. 404 Route Handler
app.use((req, res) => {
  res.status(404).render('partials/header', {
    title: '404 - Halaman Tidak Ditemukan',
    currentPage: ''
  });
});

// 6. Graceful Shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n🛑 Server Express & Prisma dimatikan.');
  process.exit(0);
});

// 7. Fungsi Start Server dengan Auto Port Fallback jika Port Sedang Dipakai
function startServer(port) {
  const server = app.listen(port, () => {
    console.log('=======================================================');
    console.log('👘 SISTEM PERSEWAAN BUSANA "SEWA AJA" (EJS + SQLITE)');
    console.log('🏫 Workshop PjBL SMK Telkom Lampung — Hari Ke-2');
    console.log(`🌐 Akses Server: http://localhost:${port}`);
    console.log('=======================================================');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} sedang digunakan oleh aplikasi lain. Mencoba port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('❌ Server error:', err);
    }
  });
}

startServer(currentPort);
