import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgetPassword from './pages/ForgetPassword';
import Game from './pages/Game';

const AppRouter = () => (
  <BrowserRouter>
      <Route exact path="/game" component={Game} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/forget-password" component={ForgetPassword} />
  </BrowserRouter>
);

export default AppRouter;
