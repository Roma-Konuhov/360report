import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import RevieweesByManager from './components/RevieweesByManager';
import RevieweesByConsultant from './components/RevieweeByConsultant';
import Relations from './components/Relations';
import ConsultantReport from './components/ConsultantReport';
import ManagerReport from './components/ManagerReport';
import Users from './components/Users';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/');
    }
  };
  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  const clearReport = () => {
    store.dispatch({ type: 'CLEAR_MESSAGES' });
    store.dispatch({ type: 'CLEAR_REPORT' });
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onLeave={clearMessages}/>
      <Route path="/contact" component={Contact} onLeave={clearMessages}/>
      <Route path="/reviewees-by-consultants" component={RevieweesByConsultant} onLeave={clearMessages}/>
      <Route path="/reviewees-by-managers" component={RevieweesByManager} onLeave={clearMessages}/>
      <Route path="/people-relations" component={Relations} onLeave={clearMessages}/>
      <Route path="/users" component={Users} onLeave={clearMessages}/>
      <Route path="/consultant/report/:id" component={ConsultantReport} onLeave={clearReport}/>
      <Route path="/manager/report/:id" component={ManagerReport} onLeave={clearReport}/>
      <Route path="*" component={NotFound} onLeave={clearMessages}/>
    </Route>
  );
}
