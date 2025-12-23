// frontend/src/store.js

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; 
import { composeWithDevTools } from '@redux-devtools/extension';

import { userLoginReducer, userRegisterReducer } from './reducers/userReducers'; 
// import { cartReducer } from './reducers/cartReducers'; // Ensure you create/import this!

// ... other imports
// IMPORTANT: You need to create this file or use your existing cart logic
import { cartReducer } from './reducers/cartReducers'; 
import { userListReducer, userDeleteReducer , userDetailsReducer,} from './reducers/userReducers';
import { orderListReducer } from './reducers/orderReducers';
import { orderCreateReducer} from './reducers/orderReducers';
import { orderDetailsReducer } from './reducers/orderReducers';
import { userUpdateProfileReducer } from './reducers/userReducers';
import { orderListMyReducer } from './reducers/orderReducers';
// 1. Import your product reducers
import { 
  productListReducer, 
  productDeleteReducer, 
  productCreateReducer ,
 
  
} from './reducers/productReducers';
const reducer = combineReducers({
    userLogin: userLoginReducer, 
    userRegister: userRegisterReducer,
    cart: cartReducer, // 1. UN-COMMENT THIS
    userList: userListReducer,
    userDelete: userDeleteReducer,
    productList: productListReducer,     // <--- This matches the 'productList' in your Page
    productDelete: productDeleteReducer,
    productCreate: productCreateReducer,
    orderList: orderListReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
     orderListMy: orderListMyReducer,
     userDetails: userDetailsReducer,
});
// 1. Double check the Key Name matches exactly what is in your userActions.js
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

// 2. If you want the cart to survive refresh, it MUST be loaded here too
const cartItemsFromStorage = localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [];

    const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};
  const paymentMethodFromStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : ''; // Default to empty string or 'PayPal'
const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
    cart: { 
        cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage ,
        paymentMethod: paymentMethodFromStorage
    } // 2. This now matches the 'cart' key in combineReducers
};
const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);


export default store;