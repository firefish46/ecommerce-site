import React, { createContext, useReducer, useContext } from 'react';

// 1. Initial State
const initialState = {
  cartItems: [],
};

// 2. Reducer Function (The logic center)
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((x) =>
            x.product === existItem.product ? item : x
          ),
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
        };
      }
      
    case 'REMOVE_ITEM':
      return {
        ...state,
        cartItems: state.cartItems.filter((x) => x.product !== action.payload),
      };
      
    case 'UPDATE_QTY':
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.product === action.payload.productId
            ? { ...item, qty: action.payload.qty }
            : item
        ),
      };

    default:
      return state;
  }
};

// 3. Create Context
const CartContext = createContext();

// 4. Provider Component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItemToCart = (product, qty) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
      },
    });
  };

  const removeItemFromCart = (productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    });
  };
  
  const updateItemQty = (productId, qty) => {
    dispatch({
      type: 'UPDATE_QTY',
      payload: { productId, qty: Number(qty) },
    });
  };

  const contextValue = {
    cartState: state,
    addItemToCart,
    removeItemFromCart,
    updateItemQty,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// 5. Custom Hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};