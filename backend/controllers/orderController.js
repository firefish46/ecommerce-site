// backend/controllers/orderController.js

import Order from '../models/orderModel.js';
import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems, shippingAddress, paymentMethod,
    itemsPrice, taxPrice, shippingPrice, totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  }

  const order = new Order({
    orderItems: orderItems.map((x) => ({ ...x, product: x.product, _id: undefined })),
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  });

  const createdOrder = await order.save();

  for (const item of orderItems) {
    const product = await Product.findByIdAndUpdate(item.product, {
      $inc: { countInStock: -item.qty }
    });
    if (product) {
      product.countInStock -= item.qty;
      await product.save();
    }
  }

  res.status(201).json(createdOrder);
});

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name');
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get logged in user orders with pagination
// @route   GET /api/orders/myorders?page=1&limit=10
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const page  = Number(req.query.page)  || 1;
  const limit = Number(req.query.limit) || 10;
  const skip  = (page - 1) * limit;

  // Run count + fetch in parallel for performance
  const [totalOrders, orders] = await Promise.all([
    Order.countDocuments({ user: req.user._id }),
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })   // newest first
      .skip(skip)
      .limit(limit),
  ]);

  res.json({
    orders,
    page,
    totalPages: Math.ceil(totalOrders / limit),
    totalOrders,
    hasMore: page * limit < totalOrders,
  });
});

export { addOrderItems, getOrderById, getMyOrders, getOrders };