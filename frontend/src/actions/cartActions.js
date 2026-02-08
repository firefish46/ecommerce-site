import axios from 'axios';
import { CART_ADD_ITEM } from '../constants/cartConstants';
import {    CART_REMOVE_ITEM,} from '../constants/cartConstants';
export const addToCart = (id, qty) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

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

  // This is what makes the cart stay full on refresh!
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

// src/actions/cartActions.js
export const removeFromCart = (id) => (dispatch, getState) => {
  dispatch({
    type: CART_REMOVE_ITEM,
    payload: id,
  });

  // Update localStorage so the item stays gone after a refresh
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};
export const savePaymentMethod = (data) => (dispatch) => {
  dispatch({
    type: 'CART_SAVE_PAYMENT_METHOD', // Use your constant here
    payload: data,
  });

  localStorage.setItem('paymentMethod', JSON.stringify(data));
};