import React, { Component } from "react";
import firebase from '../firebase.init';
import './Login.css';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      error: null,
      language: [
        { name: 'English' },
        { name: 'Hindi' },
        { name: 'Kannada' }
      ],
      selected: 0
    };
  }
  onChange = e => { 
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };
  login = e => {
    e.preventDefault();
    console.log("Submiting ", this.state);
    const { userName, password } = this.state;
    firebase
     .auth()
     .signInWithEmailAndPassword(userName, password)
     .then((user) => {
        this.props.history.push({
          pathname: '/home',
          state: {
            userName
          }
        })
       
     })
     .catch((error) => {
        console.log(error)
        alert(error.message)
        this.setState({ error: error });
     });
	};
	signup = () => this.props.history.push('/signup');
  forgetPassword = () => {
    this.props.history.push('/forget-password')
  }
  changeLanguage = (key) => {
    this.setState({ selected: key });
  }
  render() {
    return (
      <div className="main-container">
        <div className="login-block" style={{top: '8rem'}}>
          <h1>मित्रMoji</h1>
          <input type="text" placeholder="Email" name="userName" id="username" onChange={this.onChange} />
          <input type="password" placeholder="Password" name="password" id="password" onChange={this.onChange} />
          <p className="forget" onClick={this.forgetPassword}>Forget Password</p>
          <button onClick={this.login}>Login</button>
					<button onClick={this.signup}>New? Sign up now!</button>
          <p className="language-heading">Choose your comfortable language</p>
          <div className="language">
          {
            this.state.language.map((lang, i) => (
              <p
                className={this.state.selected === i ? 'selected-language' : ''}
                onClick={() => this.changeLanguage(i)}
                key={i}
              >
                { lang.name }
              </p>
            ))
          }
          </div>
        </div>
      </div>
    );
  }
}
