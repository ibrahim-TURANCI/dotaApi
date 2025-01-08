const JWT = require('jsonwebtoken');
const { models } = require('../database');

// Kara liste kontrol fonksiyonu
const checkBlacklist = async (token) => {
  try {
    const result = await models.TokenBlacklist.findOne({ where: { token } });
    return !!result; // Token bulunursa true, aksi halde false döner
  } catch (error) {
    console.error('Error checking blacklist:', error);
    throw error; // Hata fırlatılır ve üst seviyede yakalanır
  }
};

// Kara listeye token ekleme fonksiyonu
const addToBlacklist = async (token) => {
  try {
    await models.TokenBlacklist.create({ token }); // Token blacklist'e eklenir
  } catch (error) {
    console.error('Error adding token to blacklist:', error);
    throw error;
  }
};

// Auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    let authHeader =
      req.query.token || req.query.shared_token || req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: 'Authorization token is missing' });
    }

    // Eğer token Bearer formatında ise, `Bearer` kısmını ayır
    const token =
      req.query.token || req.query.shared_token
        ? authHeader
        : authHeader.split(' ')[1];

    // Token doğrulama
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Blacklist kontrolü
    const isBlacklisted = await checkBlacklist(token);
    if (isBlacklisted) {
      return res.status(401).json({ message: 'Token is blacklisted' });
    }

    // Kullanıcı bilgilerini `res.locals` içerisine ekle
    res.locals.tokenUserInfo = {
      userId: decodedToken.id,
      isAdmin: decodedToken.isAdmin || false,
    };

    next(); // Eğer her şey yolundaysa sonraki middleware'e geç
  } catch (error) {
    console.error('Error in auth middleware:', error);
    res.status(401).json({ message: error.message || 'Unauthorized' });
  }
};

// Logout middleware (token'i blacklist'e ekler)
const logoutMiddleware = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Token is required for logout' });
    }

    await addToBlacklist(token); // Token blacklist'e eklenir
    res.status(200).json({ message: 'Successfully logged out' });
  } catch (error) {
    console.error('Error in logout middleware:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  authMiddleware,
  logoutMiddleware,
};
