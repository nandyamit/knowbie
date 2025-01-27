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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middleware/auth");
const user_1 = require("../models/user");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => {
    console.log('Register route hit', req.body);
    auth_1.authController.register(req, res);
});
router.post('/login', (req, res) => {
    auth_1.authController.login(req, res);
});
router.get('/validate-token', auth_2.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ valid: true, user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ error: 'Token validation failed' });
    }
}));
router.get('/me', auth_2.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const user = yield user_1.User.findByPk((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: user.id, username: user.username, email: user.email });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}));
exports.authRoutes = router;
