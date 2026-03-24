import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM } from '../constants/cartConstants';
import { toast } from 'react-toastify';

// Base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || '';

export const addToCart = (id, qty) => async (dispatch, getState) => {
  // Use API_URL to prevent 405 errors
  const { data } = await axios.get(`${API_URL}/api/products/${id}`);

  dispatch({
    type: CART_ADD_ITEM,
    payload: {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    },
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: 'CART_SAVE_PAYMENT_METHOD',
    payload: data,
  });
  localStorage.setItem('paymentMethod', JSON.stringify(data));
};
// In cartActions.js — add this action

export const validateCartStock = () => async (dispatch, getState) => {
  const { cart: { cartItems } } = getState();

  for (const item of cartItems) {
    try {
      // Corrected to use API_URL variable
      const { data } = await axios.get(`${API_URL}/api/products/${item.product}`);
      
      if (data.countInStock < item.qty) {
        if (data.countInStock === 0) {
          dispatch(removeFromCart(item.product));
          toast.error(`${item.name} is out of stock and was removed.`);
        } else {
          dispatch(addToCart(item.product, data.countInStock));
          toast.warning(`Quantity for ${item.name} was reduced to available stock (${data.countInStock}).`);
        }
      }
    } catch (err) {
      console.error('Stock check failed', err);
    }
  }
};