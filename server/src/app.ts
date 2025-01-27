import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { sequelize } from './config/database';
import { User } from './models/user';

const app = express();

// Determine the allowed origins based on environment
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? ['https://knowbie.onrender.com']  // Production origin
  : ['http://localhost:3000', 'http://localhost:5173'];  // Local development origins

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined, 
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Enable preflight requests
app.options('*', cors(corsOptions));

// Apply CORS middleware
app.use(cors(corsOptions));

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