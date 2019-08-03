import React, { Component } from 'react'
import ChannelInput from "../components/ChannelInput";
import Call from "../components/Call";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: ""
    };
  }

  selectChannel = channel => {
    this.setState({ channel });
  };

  render() {
    return (
      <div className="App">
        <ChannelInput selectChannel={this.selectChannel} />
        <Call channel={this.state.channel} />
      </div>
    );
  }
}

export default Home;
