import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import store from './store'; 

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage'; 
import ProductDetailsPage from './pages/ProductDetailsPage'; 
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage'; 
import LoginPage from './pages/LoginPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import ShippingPage from './pages/ShippingPage'; // 1. ADD THIS IMPORT
import AdminRoute from './components/AdminRoute';
import UserListPage from './pages/admin/UserListPage';
import ProductListPage from './pages/admin/ProductListPage';
import OrderListPage from './pages/admin/OrderListPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import PaymentPage from './pages/PaymentPage';
import OrderPage from './pages/OrderPage'; // You will create this next
import ProfilePage from './pages/ProfilePage';
import ProductEditPage from './pages/ProductEditPage'; // Import the ProductEditPage

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className="py-3">
          <div className="container">
            <Routes>
              <Route path="/" element={<HomePage />} exact />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path='/placeorder' element={<PlaceOrderPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/shipping" element={<ShippingPage />} /> {/* 3. SHIPPING ROUTE */}
              <Route path="/checkout" element={<CheckoutPage />} />
     <Route path='' element={<AdminRoute />}>
  {/* Option A: Full absolute paths (Easiest for your current Header) */}
  <Route path='/admin/userlist' element={<UserListPage />} />
  <Route path='/admin/productlist' element={<ProductListPage />} />
  <Route path='/admin/orderlist' element={<OrderListPage />} />
</Route>
           <Route path='/payment' element={<PaymentPage />} />
            <Route path='/order/:id' element={<OrderPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
            <Route path='/search/:keyword' element={<HomePage />} />
            <Route path='/' element={<HomePage />} exact />
            </Routes>
          </div>
        </main>
        <Footer />
     </Router>
    </Provider>
  );
}

export default App;