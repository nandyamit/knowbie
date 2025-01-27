"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = require("./routes/auth");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Determine the allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://knowbie.onrender.com'] // Production origin
    : ['http://localhost:3000', 'http://localhost:5173']; // Local development origins
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
// Enable preflight requests
app.options('*', (0, cors_1.default)(corsOptions));
// Apply CORS middleware
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
// API routes
app.use('/api/auth', (req, res, next) => {
    console.log('Auth route hit:', req.method, req.path);
    next();
}, auth_1.authRoutes);
// Serve static files
app.use(express_1.default.static(path_1.default.join(__dirname, '../../client/dist')));
// Handle React routing
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../client/dist/index.html'));
});
const PORT = process.env.PORT || 3000;
database_1.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
