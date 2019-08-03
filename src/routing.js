import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import InGame from './pages/InGame';

const AppRouter = () => (
  <BrowserRouter>
      <Route exact path="/" component={Home} />
			<Route exact path="/game" component={InGame} />
      <Route exact path="/login" component={Login} />
  </BrowserRouter>
);

export default AppRouter;
