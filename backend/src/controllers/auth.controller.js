const express = require('express');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const { UserService } = require('../services/user.service');
const { authMiddleware, logoutMiddleware } = require('../middlewares/authentication.middleware');

const authRouter = express.Router();

// Kullanıcı giriş endpointi
authRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcı adı veya email kontrolü
        const user = await UserService.findByUsernameOrEmail(username);
        if (!user) {
            return res.status(401).json({ message: 'Kullanıcı adı veya email yanlış' });
        }

        // Şifre doğrulaması
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Şifre yanlış' });
        }

        // JWT token oluşturma
        const token = JWT.sign(
            { id: user.id, isadmin: user.isadmin, forcePass: user.force_pass },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION_TIME || '7d', // Token geçerlilik süresi
            }
        );

        // Kullanıcı bilgileri ve isadmin durumunu gönderme
        return res.json({ token, isadmin: user.isadmin, forcePass: user.force_pass });
    } catch (error) {
        console.error('Error in /login:', error);
        return res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcı çıkışı endpointi
authRouter.post('/logout', authMiddleware, logoutMiddleware, (_req, res) => {
    res.status(200).json({ success: true, message: 'Çıkış başarılı' }); 
});

module.exports = authRouter;
