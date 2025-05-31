// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

let connection;

// connectWithRetry: MySQL’e bağlanana kadar tekrar deneyecek
async function connectWithRetry(maxRetries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      connection = await mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
      });

      // Eğer tablo yoksa oluştur
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INT AUTO_INCREMENT PRIMARY KEY,
          text TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ MySQL bağlantısı başarılı.');
      return;
    } catch (err) {
      console.error(`❌ MySQL bağlantısı başarısız (deneme ${attempt}/${maxRetries}).\n   Hata: ${err.message}`);
      if (attempt < maxRetries) {
        console.log(`🕒 ${delayMs}ms sonra tekrar deneniyor...`);
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
  }

  console.error('⛔ MySQL’e bağlanılamadı. Uygulama sonlandırılıyor.');
  process.exit(1);
}

// Express konfigürasyonları
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// GET: Tüm yorumları getir
app.get('/api/reviews', async (req, res) => {
  try {
    const [rows] = await connection.execute('SELECT * FROM reviews ORDER BY timestamp DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Veritabanından yorumlar alınırken hata oluştu.' });
  }
});

// POST: Yeni yorum ekle
app.post('/api/reviews', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text alanı boş olamaz.' });
  }

  try {
    await connection.execute('INSERT INTO reviews (text) VALUES (?)', [text]);
    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Yorum eklenirken hata oluştu.' });
  }
});

// MySQL bağlantısını kur, ardından sunucuyu başlat
connectWithRetry()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Beklenmeyen bir hata oluştu:', err);
    process.exit(1);
  });
