const { User } = require('../database/entities/user.entity');

class UserService {
    static async findById(id) {
        return User.findByPk(id);
    }

    static async getAllUsers() {
        return User.findAll();
    }

    static async createUser(data) {
        return User.create(data);
    }

    static async updateUser(id, data) {
        const user = await User.findByPk(id);
        if (!user) return null;
        return user.update(data);
    }

    static async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) return null;
        return user.destroy();
    }
}

module.exports = UserService;
