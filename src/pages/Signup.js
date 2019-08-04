import React, { Component } from "react";
import firebase from '../firebase.init';
import './Login.css';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: "",
      error: null,
    };
	}

  onChange = e => { 
    let { name, value } = e.target;
    this.setState({ [name]: value });
	}

  signup = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    firebase
     .auth()
     .createUserWithEmailAndPassword(email, password)
     .then((res) => {
				console.log(res.user);
				res.user.updateProfile({
					displayName: name
				});
				this.props.history.push('/home');
     })
     .catch((error) => {
        console.log(error)
        alert(error.message)
        this.setState({ error: error });
     });
	}

  login = () => {
    this.props.history.push('/login')
	}

  render() {
    return (
      <div className="main-container">
        <link href='http://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'></link>
        <div className="login-block" style={{ top: '8rem' }}>
            <h1>मित्रMoji</h1>
						<div style={{ textAlign: 'center' }}>
							<img className="avatar-image" src="https://www.viadelvino.com/wp-content/uploads/2016/02/photo.jpg.png" alt="avatar"/>
						</div>						
						<input type="text" placeholder="Name" name="name" id="username" onChange={this.onChange} />
            <input type="text" placeholder="Email" name="email" id="username" onChange={this.onChange} />
            <input type="password" placeholder="Password" name="password" id="password" onChange={this.onChange} />
            <p className="forget" onClick={this.login}>Already signed up?</p>
            <button onClick={this.signup}>Register</button>
        </div>
      </div>
    );
  }
}
