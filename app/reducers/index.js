import { combineReducers } from 'redux';
import messages from './messages';
import auth from './auth';
import entities from './entities';
import report from './report';
import http from './http';
import appState from './appState';

export default combineReducers({
  messages,
  auth,
  http,
  appState,
  entities,
  report
});
