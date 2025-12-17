// frontend/src/store.js (Update existing file)

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Must import thunk correctly based on your setup
import { composeWithDevTools } from '@redux-devtools/extension';

// --- Import your existing reducers (e.g., productListReducer) ---
// import { productListReducer, productDetailsReducer } from './reducers/productReducers'; 

// --- Import the new user reducer ---
import { userLoginReducer } from './reducers/userReducers'; 

const reducer = combineReducers({
    // productList: productListReducer, // Include your existing reducers
    // cart: cartReducer,
    userLogin: userLoginReducer, // <-- ADD THE NEW REDUCER
});

// Load user info from localStorage if it exists (for persistent login)
const userInfoFromStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const initialState = {
    // cart: { cartItems: cartItemsFromStorage },
    userLogin: { userInfo: userInfoFromStorage }, // <-- INITIAL USER STATE
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;