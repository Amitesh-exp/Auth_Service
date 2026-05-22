const UserRepository = require('../repository/user-repository');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/serverConfig');

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async create(data) {    
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.error('Something went wrong on service layer:');
            throw error;
        }
    }

    async signIn (email, plainPassword) {
        try {
            const user = await this.userRepository.getByEmail(email);
            if (!user) {
                console.error('No user found with the given email');
                throw { error: 'Invalid email' };
            }
            const passwordMatch = this.checkPassword(plainPassword, user.password);
            if (!passwordMatch) {
                console.error('Password does not match');
                throw { error: 'Incorrect password' };
            }
            const newJWT = this.createToken({ email: user.email, id: user.id });
            return newJWT;
        } catch (error) {
            console.error('Something went wrong on service layer:');
            throw error;
        }
    } 

    async isAuthenticated (token) {
        try {
            const response = this.verifyToken(token);
            if (!response) {
                throw { error: 'Invalid token' };
            }
            const user = await this.userRepository.getById(response.id);
            if (!user) {
                throw { error: 'No user found with the given token' };
            }
            return user.id;
        } catch (error) {
            console.error('Something went wrong in authentication process');
            throw error;
        }
    }

    createToken (user) {
        try {
            const result = jwt.sign(user, JWT_KEY, { expiresIn: '1d' });
            return result;
        } catch (error) {
            console.error('Something went wrong in token creation');
            throw error;
        }
    }

    verifyToken (token) {
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.error('Something went wrong in token validation', error);
            throw error;
        }
    }

    checkPassword (userInputPlainPassword, encryptedPassword) {
        try {
            return bcrypt.compareSync(userInputPlainPassword, encryptedPassword);
        } catch (error) {
            console.error('Something went wrong in password comparison');
            throw error;
        }
    }

    isAdmin (userId) {
        try {
            return this.userRepository.isAdmin(userId);
        } catch (error) {
            console.error('Something went wrong in admin validation');
            throw error;
        }
    }
}

module.exports = UserService;