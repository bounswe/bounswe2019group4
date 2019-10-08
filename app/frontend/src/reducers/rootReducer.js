import { combineReducers } from 'redux';
// import exampleReducer from './exampleReducer.js';
import alert from './alert';
import user from './user';

export default combineReducers({
   // exampleReducer
    alert,
    user
});