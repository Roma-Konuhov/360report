import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import RevieweesByManager from './components/RevieweesByManager';
import RevieweesByConsultant from './components/RevieweesByConsultant';
import Relations from './components/Relations';
import Report from './components/Report';

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
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onLeave={clearMessages}/>
      <Route path="/contact" component={Contact} onLeave={clearMessages}/>
      <Route path="/reviewees-by-consultants" component={RevieweesByConsultant} onLeave={clearMessages}/>
      <Route path="/reviewees-by-managers" component={RevieweesByManager} onLeave={clearMessages}/>
      <Route path="/people-relations" component={Relations} onLeave={clearMessages}/>
      <Route path="/report/:id" component={Report} onLeave={clearMessages}/>
      <Route path="*" component={NotFound} onLeave={clearMessages}/>
    </Route>
  );
}
