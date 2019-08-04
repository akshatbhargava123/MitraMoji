import React from 'react';
import { Route, Redirect, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import InGame from './pages/InGame';
import ForgetPassword from './pages/ForgetPassword';

const AppRouter = () => (
  <BrowserRouter>
		<Redirect exact path="/" to="/login" />
		<Route exact path="/game" component={InGame} />
		<Route exact path="/home" component={Home} />
		<Route exact path="/login" component={Login} />
		<Route exact path="/signup" component={Signup} />
		<Route exact path="/forget-password" component={ForgetPassword} />
	</BrowserRouter>
);

export default AppRouter;
