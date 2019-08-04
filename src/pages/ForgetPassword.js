import React, { Component } from "react";
import './Login.css';
import languages from '../assets/language'; 

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      language: {}
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
  componentDidMount() {
    const langKey = localStorage.getItem('lang') || 'english';
    this.setState({ language: languages[langKey] });
  }
  render() {
    const { language } = this.state;
    return (
      <div className="main-container">
        <link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'></link>
        <div className="login-block">
            <h1>मित्रMoji</h1>
            <input type="text" placeholder={language.EMAIL} name="userName" id="username" onChange={this.onChange} />
            <button onClick={this.login}>{language.SUBMIT}</button>
        </div>
      </div>
    );
  }
}
