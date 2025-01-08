const express = require('express');
const { authMiddleware } = require('../middlewares/authentication.middleware');
const UserService = require('../services/user.service');

const userRouter = express.Router();

// Kullanıcı bilgilerini ID'ye göre getir
userRouter.get('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcı bilgilerini güncelle
userRouter.put('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;

        const updatedUser = await UserService.updateUser(userId, updatedData);
        if (!updatedUser) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        return res.status(200).json({ message: 'Kullanıcı güncellendi', updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcıyı sil
userRouter.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;

        const deleted = await UserService.deleteUser(userId);
        if (!deleted) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        return res.status(200).json({ message: 'Kullanıcı silindi' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Tüm kullanıcıları getir
userRouter.get('/', authMiddleware, async (_req, res) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Yeni kullanıcı oluştur
userRouter.post('/', authMiddleware, async (req, res) => {
    try {
        const newUserData = req.body;

        const newUser = await UserService.createUser(newUserData);
        return res.status(201).json({ message: 'Kullanıcı oluşturuldu', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = userRouter;
