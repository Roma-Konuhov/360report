import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import entities from './entities';
import http from './http';

export default combineReducers({
  messages,
  auth,
  http,
  entities
});
