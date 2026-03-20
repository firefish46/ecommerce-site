import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';

dotenv.config();
connectDB();

const app = express();

// ── CORS ──────────────────────────────────────────────────────
// Allow localhost in dev, Vercel in production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gadgetmart.vercel.app',
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions)); // preflight, Express 5 syntax

// ── Body parsers ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotions', promotionRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// ── Error handler ────────────────────────────────────────────
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// ── Start server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
});