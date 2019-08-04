import React, { Component } from 'react';
import './Home.css';
import languages from '../assets/language'; 

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      language: {}
    };
  }
  componentDidMount() {
    this.setState({ user: JSON.parse(localStorage.getItem('user') || {}) });
    const langKey = localStorage.getItem('lang') || 'english';
    this.setState({ language: languages[langKey] });
  }
  startGame = () => {
    this.props.history.push('/game');
  }
  render() {
    const { language } = this.state;
    return (
      <div className="main">
				<div style={{ textAlign: 'center' }}>
					<img className="avatar-large" src={this.state.user.imageUrl} onClick={this.showUploadPanel} />
				</div>
        <img src={this.state.user.photoURL} alt="avatar" className="avatar" width="100%" />
        <h2 className="username">{language.WELCOME} {this.state.user.displayName}</h2>
        <button className="button" onClick={this.startGame}>{language.START}</button>
      </div>
    );
  }
}

export default Home;
