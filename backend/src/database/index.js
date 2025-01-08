const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const User = require('./entities/user.entity');
const TokenBlacklist = require('./entities/token_blacklist.entity');

dotenv.config();

// Sequelize bağlantısını oluştur
const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: false,
});

// Modelleri tanımla
const models = {
  User: User(sequelize),
  TokenBlacklist: TokenBlacklist(sequelize), 
};

// Modelleri bağla (eğer ilişkiler varsa burada tanımlanır)
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = { sequelize, models };
