import React, { Component } from "react";
import './Login.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
  }
  onChange = e => { 
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };
  login = e => {
    e.preventDefault();
    console.log("Submiting ", this.state);
  };
  render() {
    return (
      <div className="main-container">
        <link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'></link>
        <div className="logo"></div>
        <div className="login-block">
            <h1>Login</h1>
            <input type="text" placeholder="Username" name="userName" id="username" onChange={this.onChange} />
            <input type="password" placeholder="Password" name="password" id="password" onChange={this.onChange} />
            <button onClick={this.login}>Submit</button>
        </div>
      </div>
    );
  }
}
