import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';
import Contact from './components/Contact';
import NotFound from './components/NotFound';

import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import Profile from './components/Account/Profile';
import Forgot from './components/Account/Forgot';
import Reset from './components/Account/Reset';

import RevieweesByManager from './components/RevieweesByManager';
import RevieweesByConsultant from './components/RevieweeByConsultant';
import Relations from './components/Relations';
import ConsultantReport from './components/ConsultantReport';
import ManagerReport from './components/ManagerReport';
import Users from './components/Users';
import LMs from './components/LMs';
import { clearAppState } from './actions/appState';
import { clearReport } from './actions/report';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };
  const skipIfAuthenticated = (nextState, replace) => {
    console.log('here', store.getState().auth.token)
    if (store.getState().auth.token) {
      replace('/');
    }
  };
  const resetMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  const resetReport = () => {
    resetMessages();
    store.dispatch(clearReport());
  };
  const resetAppState = () => {
    resetMessages();
    store.dispatch(clearAppState());
  };
  
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onLeave={resetMessages}/>
      <Route path="/contact" component={Contact} onLeave={resetMessages}/>

      <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={resetMessages}/>
      <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={resetMessages}/>
      <Route path="/account" component={Profile} onEnter={ensureAuthenticated} onLeave={resetMessages}/>
      <Route path="/forgot" component={Forgot} onEnter={skipIfAuthenticated} onLeave={resetMessages}/>
      <Route path='/reset/:token' component={Reset} onEnter={skipIfAuthenticated} onLeave={resetMessages}/>

      <Route path="/reviewees-by-consultants" component={RevieweesByConsultant} onLeave={resetMessages}/>
      <Route path="/reviewees-by-managers" component={RevieweesByManager} onLeave={resetMessages}/>
      <Route path="/people-relations" component={Relations} onLeave={resetMessages}/>
      <Route path="/users" component={Users} onLeave={resetMessages}/>
      <Route path="/lms" component={LMs} onLeave={resetAppState}/>
      <Route path="/consultant/report/:id" component={ConsultantReport} onLeave={resetReport}/>
      <Route path="/manager/report/:id" component={ManagerReport} onLeave={resetReport}/>
      <Route path="*" component={NotFound} onLeave={resetMessages}/>
    </Route>
  );
}
