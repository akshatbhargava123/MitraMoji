import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
  }
  onChange = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  };
  onSubmit = e => {
    e.preventDefault();
    console.log("Submiting ", this.state.channel);
    this.props.selectChannel(this.state.channel);
    this.setState({ channel: "" });
  };
  render() {
    return (
      <div>
        <p>hello</p>
      </div>
    );
  }
}
