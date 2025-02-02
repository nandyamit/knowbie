// middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Type for decoded token
interface DecodedToken {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

// Extend Request interface
declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

// Existing middleware - keep for backward compatibility
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Bearer token not found' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Server error during token verification' });
  }
};

// Export authenticateToken as an alias for authMiddleware for new badge routes
export const authenticateToken = authMiddleware;