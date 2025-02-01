import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { sequelize } from './config/database';
import { User } from './models/user';
import openAiRoutes from './routes/openai';
import { initializeDatabase } from './config/database';
import { testRoutes } from './routes/test';

const app = express();

app.use(cors({
  origin: ['https://knowbie.onrender.com', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API routes with logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Open AI routes
app.use('/api/openai', openAiRoutes);

// Auth routes
app.use('/api/auth', (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth route hit:', req.method, req.path);
  next();
}, authRoutes);

// Test routes
app.use('/api/test', (req: Request, res: Response, next: NextFunction) => {
  console.log('Test route hit:', req.method, req.path);
  next();
}, testRoutes);

// Serve static files
app.use(express.static(path.join(__dirname, '../../client/dist')));

// Handle React routing - this should be last
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Initialize database with proper table creation and sync
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();