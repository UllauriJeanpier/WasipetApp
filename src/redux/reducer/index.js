import {combineReducers} from 'redux';
import authReducer from './authReducer';
import userReducer from './userReducer';
import canjeReducer from './canjeReducer';

const rootReducer = combineReducers({
  authentication: authReducer,
  userUpdates: userReducer,
  canjeUpdate: canjeReducer,
});

export default rootReducer;
