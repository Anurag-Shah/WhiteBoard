import { combineReducers } from 'redux';

const INITIAL_STATE = {
  userInfo: {
    userId: '',
    loggedIn: 'false',
    fullName: '',
    pushToken: ''
  }
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_USER':
      const userId = action.payload.userId;
      const loggedIn = action.payload.loggedIn;
      const fullName = action.payload.fullName;
      const pushToken = action.payload.pushToken;

      const newState = { ...state, userInfo: { userId, loggedIn, fullName, pushToken } };

      return newState;

    default:
      return state
  }
};

export default combineReducers({
  user: userReducer
});