// Express application setup

import express from 'express';
import cors from 'cors';
import { authRoutes } from './routes/auth';
import { sequelize } from './config/database';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});