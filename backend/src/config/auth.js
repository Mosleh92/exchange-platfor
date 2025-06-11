const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthConfig {
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
        this.jwtExpire = process.env.JWT_EXPIRE || '2h';
        this.bcryptRounds = 12;
    }

    generateToken(payload) {
        return jwt.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpire
        });
    }

    verifyToken(token) {
        return jwt.verify(token, this.jwtSecret);
    }

    async hashPassword(password) {
        return await bcrypt.hash(password, this.bcryptRounds);
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = new AuthConfig();