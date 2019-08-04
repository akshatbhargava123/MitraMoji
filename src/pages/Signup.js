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
			imageUrl: 'https://www.viadelvino.com/wp-content/uploads/2016/02/photo.jpg.png',
			imageUploading: false,
			registering: false
    };
	}

  onChange = e => { 
    let { name, value } = e.target;
    this.setState({ [name]: value });
	}

  signup = e => {
    e.preventDefault();
		const { name, email, password } = this.state;
		this.setState({ registering: true });
    firebase
     .auth()
     .createUserWithEmailAndPassword(email, password)
     .then((res) => {
				this.setState({ registering: false });
				res.user.updateProfile({
					displayName: name,
					photoURL: this.state.imageUrl
				});
				alert('Registration successful!');
				this.props.history.push('/login');
     })
     .catch((error) => {
        console.log(error)
        alert(error.message)
        this.setState({ error: error });
     });
	}

	showUploadPanel = () => {
		document.getElementById('file-input').click();
	}

	uploadImage = (event) => {
		this.setState({ imageUploading: true });
		const file = event.target.files[0];
		const timestamp = Number(new Date());
		const storageRef = firebase
			.storage()
			.ref('images')
			.child(timestamp.toString() + '.jpg');
		storageRef.put(file).then(() => {
			firebase
				.storage()
				.ref('images/' + timestamp.toString() + '.jpg')
				.getDownloadURL().then(url => {
					this.setState({
						imageUrl: url,
						imageUploading: false
					});
				});
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
							<img className="avatar-image" src={this.state.imageUrl} alt="avatar" onClick={this.showUploadPanel} />
						</div>						
						<input type="file" hidden id="file-input" onChange={this.uploadImage} />
						<input type="text" placeholder="Name" name="name" onChange={this.onChange} />
            <input type="text" placeholder="Email" name="email" onChange={this.onChange} />
            <input type="password" placeholder="Password" name="password" onChange={this.onChange} />
            <p className="forget" onClick={this.login}>Already signed up?</p>
						{
							this.state.imageUploading ?
								<button>Uploading Image...</button> :
								<button onClick={this.signup}>
									Register
								</button>
						}
        </div>
      </div>
    );
  }
}
