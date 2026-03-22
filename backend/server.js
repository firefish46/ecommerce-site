// backend/server.js

// 1. FRAMEWORK IMPORTS
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// 2. FILE/ROUTE IMPORTS
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';

// 3. CONFIGURATION
dotenv.config();
connectDB();

// 4. APP INITIALIZATION
const app = express();

// 5. CORS — allows both localhost (dev) and Vercel (production)
const allowedOrigins = [
  'https://gadgetmart.vercel.app',  // ✅ production frontend
  'http://localhost:3000',           // ✅ local React dev server
];

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (Postman, mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));
app.options('/{*path}', cors(corsOptions)); // ✅ handle preflight for all routes (Express 5)

// 6. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 7. ROUTES
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/promotions', promotionRoutes);

// 8. 404 HANDLER
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 9. ERROR HANDLER
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// 10. START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log('Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME);
  console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY);
});