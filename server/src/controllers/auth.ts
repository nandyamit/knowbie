import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const authController = {
 async register(req: Request, res: Response) {
   console.log('Register request received:', req.body);
   try {
     const { username, email, password } = req.body;
     
     const existingUsername = await User.findOne({ where: { username } });
     if (existingUsername) {
       return res.status(400).json({ error: 'Username already exists' });
     }
 
     const existingEmail = await User.findOne({ where: { email } });
     if (existingEmail) {
       return res.status(400).json({ error: 'Email already exists' });
     }
 
      console.log('Registration password:', password);
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('Registration hashed:', hashedPassword);
     const user = await User.create({
       username,
       email,
       password: hashedPassword
     });
 
     res.status(201).json({ 
       message: 'User created successfully',
       user: { id: user.id, username: user.username, email: user.email }
     });
   } catch (error: unknown) {
     console.error('Registration error:', error);
     const errorMessage = error instanceof Error ? error.message : String(error);
     res.status(500).json({ error: 'Registration failed', details: errorMessage });
   }
 },

 async login(req: Request, res: Response) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('Login password:', password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Stored hash:', user.password);
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
     
     const token = jwt.sign(
       { userId: user.id, username: user.username },
       process.env.JWT_SECRET || 'your-secret-key',
       { expiresIn: '24h' }
     );
 
     res.json({
       token,
       user: {
         id: user.id,
         username: user.username
       }
     });
   } catch (error) {
     console.error('Login error:', error);
     res.status(500).json({ error: 'Login failed' });
   }
 }
};