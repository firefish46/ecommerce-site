import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../actions/cartActions'; // Optional: for changing quantities

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. PULL DATA FROM REDUX INSTEAD OF CONTEXT
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // Handler for quantity changes (Optional)
  const qtyChangeHandler = (id, qty) => {
    dispatch(addToCart(id, Number(qty)));
  };

  // Handler for removing items (We can build the action for this next!)
  const removeFromCartHandler = (id) => {
    console.log('remove', id);
    // dispatch(removeFromCart(id)); 
  };

  const checkoutHandler = () => {
    // Redirect to login, then shipping
    navigate('/login?redirect=/shipping');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Your cart is empty. <Link to="/">Go Back</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '20px' }}>
          {/* Cart Items List */}
          <div style={{ flex: 2 }}>
            {cartItems.map((item) => (
              <div key={item.product} style={{ display: 'flex', alignItems: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', borderRadius: '5px' }} />
                <div style={{ flex: 1, marginLeft: '20px' }}>
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <p>${item.price}</p>
                </div>
                <div>
                  <select 
                    value={item.qty} 
                    onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', height: 'fit-content' }}>
            <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items</h2>
            <p>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</p>
            <button 
              onClick={checkoutHandler}
              style={{ width: '100%', padding: '10px', backgroundColor: 'black', color: 'white', border: 'none', cursor: 'pointer' }}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;