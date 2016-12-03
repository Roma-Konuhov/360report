import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
// import revieweesByConsultants from './revieweesByConsultants';
// import revieweesByManagers from './revieweesByManagers';
import entities from './entities';
import http from './http';

export default combineReducers({
  messages,
  auth,
  http,
  entities
  // revieweesByConsultants,
  // revieweesByManagers
});
