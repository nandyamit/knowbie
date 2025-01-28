import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { sequelize } from './config/database';
import { User } from './models/user';

const app = express();

app.use(cors({
  origin: ['https://knowbie.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes
app.use('/api/auth', (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth route hit:', req.method, req.path);
  next();
}, authRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle React routing
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});