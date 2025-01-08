module.exports = {
    up: async (queryInterface, Sequelize) => {
      const adminExists = await queryInterface.rawSelect(
        'Users',
        {
          where: { username: process.env.ADMIN_USERNAME },
        },
        ['id']
      );
  
      if (!adminExists) {
        await queryInterface.bulkInsert('Users', [
          {
            username: process.env.ADMIN_USERNAME,
            email: 'admin@example.com',
            password: process.env.ADMIN_PASSWORD, // Not: Şifreyi hashlemeyi unutmayın!
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        console.log('Admin user already exists. Skipping insertion.');
      }
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.bulkDelete('Users', { username: process.env.ADMIN_USERNAME });
    },
  };
  