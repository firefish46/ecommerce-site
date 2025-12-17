import React from 'react';
import { useCart } from '../context/CartContext'; // <-- Import useCart here
import { Link, useNavigate } from 'react-router-dom';

// THIS IS THE COMPONENT DEFINITION
const CartPage = () => { 
    // ... (All the JSX rendering logic for the cart page goes here) ...

    const { cartState, removeItemFromCart, updateItemQty } = useCart();
    const navigate = useNavigate();
    
    // ... (rest of the logic and return statement from your merged code) ...
    const cartItems = cartState.cartItems;
    const totalPrice = cartItems.reduce((acc, item) => acc + (Number(item.price) * Number(item.qty)), 0);

    const checkoutHandler = () => {
        navigate('/login?redirect=/checkout');
    };
    
    const handleRemoveItem = (productId) => {
        removeItemFromCart(productId);
    };

    return ( 
        <div style={{ padding: '20px' }}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
                // ... Empty cart message ...
                <div style={{ border: '1px solid #ccc', padding: '15px' }}>
                    Your cart is empty. <Link to="/" style={{ color: 'blue' }}>Go Shopping</Link>
                </div>
            ) : (
                // ... Cart items display ...
                <div style={{ display: 'flex', gap: '30px' }}>
                    <div style={{ flex: 3 }}>
                        {cartItems.map((item) => (
                            <div key={item.product} style={{ display: 'flex', borderBottom: '1px solid #eee', padding: '10px 0', alignItems: 'center' }}>
                                <img src={item.image} alt={item.name} style={{ width: '80px', height: 'auto', marginRight: '15px' }} />
                                <div style={{ flex: 1 }}>
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                </div>
                                <div style={{ width: '100px' }}>${item.price?.toFixed(2) || '0.00'}</div> 
                                <div style={{ width: '80px' }}>
                                    <select
                                        value={item.qty}
                                        onChange={(e) => updateItemQty(item.product, e.target.value)}
                                        style={{ padding: '5px', width: '100%' }}
                                    >
                                        {[...Array(item.countInStock).keys()].map((x) => (
                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <button onClick={() => handleRemoveItem(item.product)} style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* ... Subtotal and Checkout Button ... */}
                    <div style={{ flex: 1, border: '1px solid #ccc', padding: '20px', height: 'fit-content' }}>
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)} items)</h2>
                        <h3>Total: **${totalPrice.toFixed(2)}**</h3>
                        <button onClick={checkoutHandler} disabled={cartItems.length === 0} style={{ width: '100%', padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// THIS IS THE CRUCIAL DEFAULT EXPORT LINE
export default CartPage;