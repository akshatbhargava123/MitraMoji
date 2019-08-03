import React, { Component } from "react";
import Call from "./components/Call";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channel: "MY_CHANNEL"
    };
  }

  render() {
    return (
      <div className="App">
        <Call channel={this.state.channel} />
      </div>
    );
  }
}

export default App;
