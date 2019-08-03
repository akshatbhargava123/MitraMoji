import React from "react";
import AgoraRTC from "agora-rtc-sdk";
import affdex from './affectiva';
import { APP_ID } from '../constants';

let client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
const USER_ID = Math.floor(Math.random() * 1000000001);

export default class Call extends React.Component {

	constructor(props) {
		super(props);

		console.log('component initialised!');
		this.localStream = AgoraRTC.createStream({
			streamID: USER_ID,
			audio: true,
			video: true,
			screen: false
		});

		this.state = {
			remoteStreams: []
		};
	}
	
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
      () => {
        console.log("getUserMedia successfully");
				this.localStream.play("agora_local");

				const video = document.getElementsByTagName('video')[0];
				const canvas = document.getElementById('our-canvas');
				const context = canvas.getContext('2d');

				let cw, ch;
				const faceMode = affdex.FaceDetectorMode.LARGE_FACES;
				const detector = new affdex.FrameDetector(faceMode);
				detector.detectAllExpressions();
				detector.detectAllEmotions();
				detector.detectAllEmojis();
				detector.detectAllAppearance();
				detector.start();

				video.addEventListener('play', function(){
					cw = video.clientWidth;
					ch = video.clientHeight;
					canvas.width = cw;
					canvas.height = ch;
					canvas.style.display = 'none';

					const startTimestamp = (new Date()).getTime() / 1000;
					
					const draw = () => {
						context.drawImage(video, 0, 0, cw, ch);
						const imageData = context.getImageData(0, 0, cw, ch);
						const now = (new Date()).getTime() / 1000;
						const deltaTime = now - startTimestamp;
						detector.process(imageData, deltaTime);

						setTimeout(() => draw(), 100);
					};

					//Construct a FrameDetector and specify the image width / height and face detector mode.
					detector.addEventListener("onInitializeSuccess", () => {
						console.log('affectiva initialisation SUCCESS!');
						draw();
					});
					detector.addEventListener("onInitializeFailure", () => {
						console.log('affectiva initialisation FAILED!');
					});
					detector.addEventListener("onImageResultsSuccess", (faces) => {
						if (faces.length) {
							const face = faces[0];
							switch (face.emojis.dominantEmoji) {
								case '😐': return console.log('neutral!');
								case '😏': return console.log('asdinsa');
								case '😞': return console.log('sad');
								case '😗': return console.log('kiss');
								case '😒': return console.log('kiss');
								case '😜': return console.log('tough out stuck');
								case '😗': return console.log('kiss');
								case '😗': return console.log('kiss');
								default: return console.log('');
							}
						}
					});
					detector.addEventListener("onImageResultsFailure", (image, timestamp, err_detail) => {
						console.log('IMAGE RESULT FAILED, timestamp');
						console.log(timestamp);
					});
					console.log();
				}, false);
				
      },
      (err) => {
        console.log("getUserMedia failed", err);
      }
    );
	};

  initClient = () => {
    client.init(
      APP_ID,
      () => {
				console.log("AgoraRTC client initialized");
				this.joinChannel();
      },
      (err) => {
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
        client.subscribe(stream, (err) => {
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
      (uid) => {
        console.log("User " + uid + " join channel successfully");
        client.publish(this.localStream, (err) => {
          console.log("Publish local stream error: " + err);
        });

        client.on("stream-published", (evt) => {
          console.log("Publish local stream successfully");
        });
      },
      (err) => {
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
        <div id="agora_local" style={{ width: "100%", height: "50vh" }} />
				<canvas id="our-canvas" />
        {Object.keys(this.state.remoteStreams).map(key => {
          let stream = this.state.remoteStreams[key];
          let streamId = stream.getId();
          return (
            <div
              key={streamId}
              id={`agora_remote ${streamId}`}
              style={{ width: "100%", height: "50vh" }}
            />
          );
        })}
      </div>
    );
  }

};