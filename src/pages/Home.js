import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
  }
  componentDidMount() {
		console.log(this.props.location.state);
    this.setState({ user: this.props.location.state.user });
  }
  startGame = () => {
    this.props.history.push('/game');
  }
  render() {
    return (
      <div className="main">
				<div style={{ textAlign: 'center' }}>
					<img className="avatar-large" src={this.state.user.imageUrl} onClick={this.showUploadPanel} />
				</div>
        <img src={this.state.user.photoURL} alt="avatar" className="avatar" width="100%" />
        <h3 className="username">{this.state.user.displayName}</h3>
        <button className="button" onClick={this.startGame}>Start</button>
      </div>
    );
  }
}

export default Home;
