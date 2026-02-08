// frontend/src/App.jsx
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
import PromotionListPage from './pages/PromotionListPage';
    

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <main className="py-3">
          <div className="container">
            <Routes>
           <Route path="/" element={<HomePage />} exact />
  <Route path="/search/:keyword" element={<HomePage />} />
  <Route path="/page/:pageNumber" element={<HomePage />} />
  <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
  
  {/* The Key fix here ensures the page refreshes on new ID */}
  <Route path="/product/:id" element={<ProductDetailsPage key={window.location.pathname} />} />
  
  <Route path="/cart" element={<CartPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />

  {/* Private User Routes */}
  <Route path="/shipping" element={<ShippingPage />} />
  <Route path="/checkout" element={<CheckoutPage />} />
  <Route path='/payment' element={<PaymentPage />} />
  <Route path='/placeorder' element={<PlaceOrderPage />} />
  <Route path='/order/:id' element={<OrderPage />} />
  <Route path='/profile' element={<ProfilePage />} />

  {/* Protected Admin Routes */}
  <Route path='' element={<AdminRoute />}>
    <Route path='/admin/userlist' element={<UserListPage />} />
    <Route path='/admin/productlist' element={<ProductListPage />} />
    <Route path='/admin/orderlist' element={<OrderListPage />} />
    <Route path='/admin/promotionlist' element={<PromotionListPage />} />
    <Route path='/admin/product/:id/edit' element={<ProductEditPage />} />
  </Route>
            </Routes>
          </div>
        </main>
        <Footer />
     </Router>
    </Provider>
  );
}

export default App;