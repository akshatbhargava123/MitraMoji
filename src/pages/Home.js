import React, { Component } from 'react'
import Call from "../components/Call";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: "MY_CHANNEL"
    };
  }

  selectChannel = channel => {
    this.setState({ channel });
  };

  render() {
    return (
      <div className="App">
        <Call channel={this.state.channel} />
      </div>
    );
  }
}

export default Home;
