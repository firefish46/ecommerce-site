// frontend/src/pages/CartPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart ,validateCartStock} from '../actions/cartActions';
import { formatTaka } from '../utils/currencyUtils';
import '../styles/CartPage.css';

const CartPage = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
useEffect(() => {
  dispatch(validateCartStock());
}, [dispatch]);
  const qtyChangeHandler    = (id, qty) => dispatch(addToCart(id, Number(qty)));
  const removeHandler       = (id)      => dispatch(removeFromCart(id));
const { userInfo } = useSelector((state) => state.userLogin);
const checkoutHandler = () => {
  if (userInfo) {
    navigate('/shipping');
  } else {
    navigate('/login?redirect=/shipping');
  }
};
  const subtotal     = cartItems.reduce((acc, i) => acc + i.qty * i.price, 0);
  const totalItems   = cartItems.reduce((acc, i) => acc + i.qty, 0);
  const freeShipping = subtotal >= 1000;

  // Items that are now out of stock or over-stocked
  const hasStockIssue = cartItems.some(
    (i) => i.countInStock === 0 || i.qty > i.countInStock
  );

  return (
    <div className="cart-page">

      {/* ── Page Header ── */}
      <div className="cart-header">
        <div>
          <h1 className="cart-title">Shopping Cart</h1>
          <p className="cart-subtitle">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
          </p>
        </div>
        <Link to="/" className="cart-continue-top">
          <i className="fas fa-arrow-left"></i> Continue Shopping
        </Link>
      </div>

      {cartItems.length === 0 ? (
        /* ── Empty State ── */
        <div className="cart-empty">
          <div className="cart-empty__icon">🛒</div>
          <h3 className="cart-empty__title">Your cart is empty</h3>
          <p className="cart-empty__text">Looks like you haven't added anything yet.</p>
          <Link to="/" className="cart-empty__btn">
            <i className="fas fa-shopping-bag"></i> Start Shopping
          </Link>
        </div>

      ) : (
        <div className="cart-layout">

          {/* ── Items Column ── */}
          <div className="cart-items">

            {/* Stock issue banner */}
            {hasStockIssue && (
              <div className="cart-stock-banner">
                <i className="fas fa-triangle-exclamation"></i>
                Some items in your cart have stock issues. Please review before checkout.
              </div>
            )}

            {cartItems.map((item, index) => {
              const isOutOfStock   = item.countInStock === 0;
              const isOverStocked  = item.qty > item.countInStock;
              const stockWarning   = isOutOfStock || isOverStocked;
              const maxQty         = Math.min(item.countInStock || 0, 10);
              const lowStock       = item.countInStock > 0 && item.countInStock <= 3;

              return (
                <div
                  key={item.product}
                  className={`cart-card ${stockWarning ? 'cart-card--issue' : ''}`}
                  style={{ animationDelay: `${index * 0.06}s` }}
                >
                  {/* Product Image */}
                  <div className="cart-card__img-wrap">
                    <img src={item.image} alt={item.name} className="cart-card__img" />
                    {isOutOfStock && (
                      <div className="cart-card__img-overlay">Out of Stock</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="cart-card__info">
                    <div className="cart-card__top">
                      <Link to={`/product/${item.product}`} className="cart-card__name">
                        {item.name}
                      </Link>
                      <button
                        className="cart-card__remove"
                        onClick={() => removeHandler(item.product)}
                        title="Remove item"
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>

                    {/* Stock Status Labels */}
                    <div className="cart-card__badges">
                      {isOutOfStock && (
                        <span className="cart-badge cart-badge--danger">
                          <i className="fas fa-ban"></i> Out of Stock
                        </span>
                      )}
                      {!isOutOfStock && isOverStocked && (
                        <span className="cart-badge cart-badge--warning">
                          <i className="fas fa-exclamation-triangle"></i>
                          Only {item.countInStock} left — qty reduced
                        </span>
                      )}
                      {!isOutOfStock && lowStock && !isOverStocked && (
                        <span className="cart-badge cart-badge--low">
                          <i className="fas fa-fire"></i> Only {item.countInStock} left!
                        </span>
                      )}
                      {!isOutOfStock && !lowStock && !isOverStocked && (
                        <span className="cart-badge cart-badge--ok">
                          <i className="fas fa-check"></i> In Stock
                        </span>
                      )}
                    </div>

                    <div className="cart-card__bottom">
                      <span className="cart-card__price">{formatTaka(item.price)}</span>

                      <div className="cart-card__qty">
                        {isOutOfStock ? (
                          <span className="cart-qty-unavailable">Unavailable</span>
                        ) : (
                          <>
                            <label className="cart-qty-label">Qty</label>
                            <select
                              className="cart-qty-select"
                              value={Math.min(item.qty, maxQty)}
                              onChange={(e) => qtyChangeHandler(item.product, e.target.value)}
                              disabled={isOutOfStock}
                            >
                              {Array.from({ length: maxQty }, (_, i) => i + 1).map((v) => (
                                <option key={v} value={v}>{v}</option>
                              ))}
                            </select>
                          </>
                        )}
                        <span className="cart-card__line-total">
                          = {formatTaka(item.qty * item.price)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Summary Sidebar ── */}
          <div className="cart-sidebar">
            <div className="cart-summary">
              <h2 className="cart-summary__title">Order Summary</h2>

              <div className="cart-summary__rows">
                <div className="cart-summary__row">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>{formatTaka(subtotal)}</span>
                </div>
                <div className="cart-summary__row">
                  <span>Shipping</span>
                  <span className={freeShipping ? 'cart-summary__free' : ''}>
                    {freeShipping ? 'FREE' : formatTaka(100)}
                  </span>
                </div>
                {!freeShipping && (
                  <div className="cart-summary__free-hint">
                    <i className="fas fa-truck"></i>
                    Add {formatTaka(1000 - subtotal)} more for free shipping
                  </div>
                )}
              </div>

              <div className="cart-summary__divider"></div>

              <div className="cart-summary__total">
                <span>Total</span>
                <span>{formatTaka(subtotal + (freeShipping ? 0 : 100))}</span>
              </div>

              {hasStockIssue && (
                <div className="cart-summary__issue-note">
                  <i className="fas fa-circle-exclamation"></i>
                  Resolve stock issues before checkout
                </div>
              )}
              <div className='checkout-btn-container'>
              <button
                className="cart-checkout-btn"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0 || hasStockIssue}
              >

               <  span className="checkout-btn-text">Proceed to Checkout</span> 
                <span className="checkout-btn-icon">
                               <i class="fa-solid fa-circle-chevron-right"></i>
</span>
              </button></div>

              <p className="cart-secure-note">
                <i className="fas fa-shield-halved"></i> 100% Secure Checkout
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;