import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js'; // You'll need to create this file
import products from './data/products.js';
import User from './models/userModel.js'; // Import User Model
import Product from './models/productModel.js';
import Order from './models/orderModel.js'; // Import Order Model to clear it too
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // 1. Clear EVERYTHING to avoid duplicates or conflicts
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // 2. Insert Users and capture them in a variable
    const createdUsers = await User.insertMany(users);

    // 3. Get the Admin User ID (Assuming the first user in your data/users.js is admin)
    const adminUser = createdUsers[0]._id;

    // 4. Map products so they are all "owned" by the admin user
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // 5. Insert Products
    await Product.insertMany(sampleProducts);

    console.log('Data Imported! (Users & Products)');
    process.exit();
  } catch (error) {
    console.error(`Error with data import: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}