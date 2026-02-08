import bcrypt from 'bcryptjs';

const users = [
  {
    name: 'Mehedi Hasan',
    email: 'mehedi7hasan10134@gmail.com',
    password: '1234', // Your model's pre-save hook will hash this
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
  },
];

export default users;