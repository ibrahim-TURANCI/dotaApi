const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

// Sequelize bağlantısını oluştur
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
});

// Migration'ları çalıştıran yardımcı fonksiyon
const runMigrations = async () => {
  try {
    console.log('Connecting to the database...');
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    // Migration dosyalarını bul
    const migrationsDir = path.resolve(__dirname, '../migrations');
    const migrationFiles = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.js'));

    // Migration dosyalarını sırayla çalıştır
    for (const file of migrationFiles) {
      const migration = require(path.join(migrationsDir, file));
      console.log(`Running migration: ${file}`);
      await migration.up(sequelize.getQueryInterface(), Sequelize);
    }

    console.log('All migrations executed successfully.');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
};

// Migration başlat
runMigrations();
