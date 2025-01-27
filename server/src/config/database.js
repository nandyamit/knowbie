"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
console.log('DB Config:', {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: ((_a = process.env.DB_PASSWORD) === null || _a === void 0 ? void 0 : _a.slice(0, 2)) + '***',
    host: process.env.DB_HOST
});
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'knowbie', process.env.DB_USER || 'postgres', process.env.DB_PASSWORD || 'password', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: console.log,
    dialectOptions: process.env.NODE_ENV === 'production'
        ? {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
        : {}
});
