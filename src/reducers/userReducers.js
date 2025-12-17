// frontend/src/reducers/userReducers.js

import { 
    USER_LOGIN_FAIL, 
    USER_LOGIN_REQUEST, 
    USER_LOGIN_SUCCESS, 
    USER_LOGOUT 
} from '../constants/userConstants';

// The userLoginReducer handles the login state
export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload }; // userInfo contains token and user details
    
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };

    case USER_LOGOUT:
      return {}; // Empty the state on logout

    default:
      return state;
  }
};