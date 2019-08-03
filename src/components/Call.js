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
    client.on("stream-added", this.onStreamAdded);
    client.on("stream-subscribed", this.onRemoteClientAdded);

    client.on("stream-removed", this.onStreamRemoved);

    client.on("peer-leave", this.onPeerLeave);
	};


  onStreamAdded = evt => {
    let stream = evt.stream;
    console.log("New stream added: " + stream.getId());
    this.setState(
      {
        remoteStreams: {
          ...this.state.remoteStream,
          [stream.getId()]: stream
        }
      },
      () => {
				console.log(this.state.remoteStreams);
        // Subscribe after new remoteStreams state set to make sure
        // new stream dom el has been rendered for agora.io sdk to pick up
        client.subscribe(stream, function(err) {
          console.log("Subscribe stream failed", err);
        });
      }
    );
  };

  joinChannel = () => {
    client.join(
      null,
      this.props.channel,
      USER_ID,
      function(uid) {
        console.log("User " + uid + " join channel successfully");
        client.publish(this.localStream, function(err) {
          console.log("Publish local stream error: " + err);
        });

        client.on("stream-published", function(evt) {
          console.log("Publish local stream successfully");
        });
      },
      function(err) {
        console.log("Join channel failed", err);
      }
    );
  };

  onRemoteClientAdded = evt => {
    let remoteStream = evt.stream;
    this.state.remoteStreams[remoteStream.getId()].play(
      "agora_remote " + remoteStream.getId()
    );
  };

  onStreamRemoved = evt => {
    let stream = evt.stream;
    if (stream) {
      let streamId = stream.getId();
      let { remoteStreams } = this.state;

      stream.stop();
      delete remoteStreams[streamId];

      this.setState({ remoteStreams });

      console.log("Remote stream is removed " + stream.getId());
    }
  };

  onPeerLeave = evt => {
    let stream = evt.stream;
    if (stream) {
      let streamId = stream.getId();
      let { remoteStreams } = this.state;

      stream.stop();
      delete remoteStreams[streamId];

      this.setState({ remoteStreams });

      console.log(evt.uid + " leaved from this channel");
    }
  };

	render() {
    return (
      <div>
        <div id="agora_local" style={{ width: "400px", height: "400px" }} />
        {Object.keys(this.state.remoteStreams).map(key => {
          let stream = this.state.remoteStreams[key];
          let streamId = stream.getId();
          return (
            <div
              key={streamId}
              id={`agora_remote ${streamId}`}
              style={{ width: "400px", height: "400px" }}
            />
          );
        })}
      </div>
    );
  }

};