const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TokenBlacklist = sequelize.define('TokenBlacklist', {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return TokenBlacklist;
};
