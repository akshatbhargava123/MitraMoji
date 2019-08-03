import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'dsmmks'
    };
  }

  render() {
    return (
      <div className="App">
        <img src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png" alt="avatar" className="avatar" />
      </div>
    );
  }
}

export default Home;
