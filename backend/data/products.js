// backend/data/products.js

const products = [
  {
    name: 'Echo Pro Headset',
    image: '/images/headset.jpg', // Placeholder path
    description:
      'High-fidelity wireless headset with noise cancellation and 24-hour battery life. Perfect for gaming and professional calls.',
    price: 89.99,
    countInStock: 12,
  },
  {
    name: 'Ultra HD 4K Monitor 32"',
    image: '/images/monitor.jpg',
    description:
      'Stunning 4K display with HDR support. Ideal for graphic design and media consumption. Features thin bezels and adjustable stand.',
    price: 499.99,
    countInStock: 7,
  },
  {
    name: 'Mechanical Keyboard (Tactile)',
    image: '/images/keyboard.jpg',
    description:
      'Full-size mechanical keyboard with tactile brown switches. RGB backlit and durable aluminum body.',
    price: 120.00,
    countInStock: 0, // Example of an item out of stock
  },
  // Add more products here if you like
];

export default products;