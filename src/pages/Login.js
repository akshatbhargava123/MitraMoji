import React, { Component } from "react";
import firebase from '../firebase.init';
import './Login.css';
import language from "../assets/language";
import click from '../assets/click.wav';
export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      error: null,
      language: [
        { name: 'English', key: 'english' },
        { name: 'Hindi', key: 'hindi' },
        { name: 'Kannada', key: 'kannada' }
      ],
      langSelected: 0
    };
	}
	
	componentWillMount() {
		let user = localStorage.getItem('user');
		if (user) {
			user = JSON.parse(user);
			this.props.history.push({
				pathname: '/home',
				state: { user }
			});
		}
  }
  componentDidMount() {
    const langKey = localStorage.getItem('lang') || 'english';
    const index = this.state.language.findIndex(l => l.key === langKey);
    this.setState({ langSelected: index });
    this.changeLanguage(index);
  }
  onChange = e => { 
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };
  login = e => {
    e.preventDefault();
    let a = new Audio(click);
    a.play();
    console.log("Submiting ", this.state);
    const { userName, password } = this.state;
    firebase
     .auth()
     .signInWithEmailAndPassword(userName, password)
     .then((res) => {
			  localStorage.setItem('user', JSON.stringify(res.user));
        this.props.history.push('/home');
     })
     .catch((error) => {
        console.log(error)
        alert(error.message)
        this.setState({ error: error });
     });
	};
	signup = () => {
    let a = new Audio(click);
    a.play();
    this.props.history.push('/signup');
  }
  forgetPassword = () => {
    let a = new Audio(click);
    a.play();
    this.props.history.push('/forget-password')
  }
  changeLanguage = (key) => {
    let a = new Audio(click);
    a.play();
    this.setState({ langSelected: key });
    localStorage.setItem('lang', this.state.language[key].key);
  }
  render() {
    const { langSelected, language: stateLangs } = this.state;
    const langKey = stateLangs[langSelected].key;
    return (
      <div className="main-container">
        <div className="login-block" style={{top: '8rem'}}>
          <h1>मित्रMoji</h1>
          <input type="text" placeholder={language[langKey].EMAIL} name="userName" id="username" onChange={this.onChange} />
          <input type="password" placeholder={language[langKey].PASSWORD} name="password" id="password" onChange={this.onChange} />
          <p className="forget" onClick={this.forgetPassword}>{language[langKey].FORGET_PASSWORD}</p>
          <button onClick={this.login}>{language[langKey].LOGIN}</button>
					<button onClick={this.signup}>{language[langKey].NEW}? {language[langKey].SIGN_UP_NOW}</button>
          <p className="language-heading">{language[langKey].CHOOSE_YOUR_LANGUAGE}</p>
          <div className="language">
          {
            this.state.language.map((lang, i) => (
              <p
                className={this.state.langSelected === i ? 'selected-language' : ''}
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
