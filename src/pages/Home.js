import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: ''
    };
  }
  componentDidMount() {
    this.setState({
      username: this.props.location.state.userName
    });
  }
  startGame = () => {
    this.props.history.push('/game');
  }
  render() {
    return (
      <div className="main">
        <img src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png" alt="avatar" className="avatar" />
        <h3 className="username">{ this.state.username }</h3>
        <button className="button" onClick={this.startGame}>Start</button>
      </div>
    );
  }
}

export default Home;
