import React from "react";
import AgoraRTC from "agora-rtc-sdk";
import { APP_ID } from '../constants';

let client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
const USER_ID = Math.floor(Math.random() * 1000000001);

export default class Call extends React.Component {
	localStream = AgoraRTC.createStream({
    streamID: USER_ID,
    audio: true,
    video: true,
    screen: false
  });

  state = {
    remoteStreams: []
	};
	
  componentDidMount() {
    this.initLocalStream();
    this.initClient();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.channel !== this.props.channel && this.props.channel !== "") {
      this.joinChannel();
    }
  }

  initLocalStream = () => {
    this.localStream.init(
      function() {
        console.log("getUserMedia successfully");
        this.localStream.play("agora_local");
      },
      function(err) {
        console.log("getUserMedia failed", err);
      }
    );
  };

  initClient = () => {
    client.init(
      APP_ID,
      function() {
        console.log("AgoraRTC client initialized");
      },
      function(err) {
        console.log("AgoraRTC client init failed", err);
      }
    );
    this.subscribeToClient();
  };

  subscribeToClient = () => {

	};

};