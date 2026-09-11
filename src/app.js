import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import allocationRoutes from './routes/allocationRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import connectDB from './config/db.js';
import { seedDefaultUsers } from './models/userModel.js';
import { seedDefaultCourses } from './models/courseModel.js';

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CORS_ORIGIN || 'https://courseallocation-pearl.vercel.app').split(',').map((origin) => origin.trim()).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`Origin ${origin} is not allowed by CORS`))
    }
  },
  credentials: true,
}))
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Course Allocation API is running' });
});

app.use('/api', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/allocations', allocationRoutes);
app.use('/api/dashboard', dashboardRoutes);

const startServer = async () => {
  await connectDB();
  await seedDefaultUsers();
  await seedDefaultCourses();

  app.listen(PORT, () => {
    console.log(`Course Allocation API running on http://localhost:${PORT}`);
  });
};

startServer();
