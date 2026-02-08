// backend/server.js (Updated)
// backend/server.js (Recommended Structure)

// 1. FRAMEWORK IMPORTS
import express from 'express';
import dotenv from 'dotenv'; 
// If you installed cors, import it here:
// import cors from 'cors';

// 2. FILE/ROUTE IMPORTS (Always use the .js extension!)
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';      

// 3. CONFIGURATION EXECUTION
dotenv.config();
connectDB(); // This now runs after dotenv is configured

// 4. APP INITIALIZATION AND MIDDLEWARE
const app = express();

// If using CORS: app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data in the body
app.use(express.urlencoded({ extended: true })); // Allows the server to accept form data
app.use('/api/promotions', promotionRoutes);
// --------------------------------
// 5. ROUTES
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); // This prefixes all order routes with /api/orders
app.use('/api/upload', uploadRoutes); // This "links" the route
// Middleware to handle 404 (Not Found) errors
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Middleware to handle all other errors and send them as JSON
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message, // This is what your frontend will now read
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
// ... app.listen ...
const PORT = process.env.PORT || 5000;

app.listen(
  PORT, 
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`),
  console.log('Cloudinary Name:', process.env.CLOUDINARY_CLOUD_NAME),
console.log('API Key exists:', !!process.env.CLOUDINARY_API_KEY)
);