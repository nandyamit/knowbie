"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
exports.authController = {
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Register request received:', req.body);
            try {
                const { username, email, password } = req.body;
                const existingUsername = yield user_1.User.findOne({ where: { username } });
                if (existingUsername) {
                    return res.status(400).json({ error: 'Username already exists' });
                }
                const existingEmail = yield user_1.User.findOne({ where: { email } });
                if (existingEmail) {
                    return res.status(400).json({ error: 'Email already exists' });
                }
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                const user = yield user_1.User.create({
                    username,
                    email,
                    password: hashedPassword
                });
                res.status(201).json({
                    message: 'User created successfully',
                    user: { id: user.id, username: user.username, email: user.email }
                });
            }
            catch (error) {
                console.error('Registration error:', error);
                const errorMessage = error instanceof Error ? error.message : String(error);
                res.status(500).json({ error: 'Registration failed', details: errorMessage });
            }
        });
    },
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, password } = req.body;
                const user = yield user_1.User.findOne({ where: { username } });
                if (!user) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                const token = jsonwebtoken_1.default.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username
                    }
                });
            }
            catch (error) {
                console.error('Login error:', error);
                res.status(500).json({ error: 'Login failed' });
            }
        });
    }
};
