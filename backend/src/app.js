const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { sequelize } = require('./database'); // Veritabanı bağlantısı
const routes = require('./routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes);

// Veritabanı bağlantısını kontrol et
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Hata Yönetimi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!' });
});

// Sunucuyu Başlat
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
