import React from "react";
import AgoraRTC from "agora-rtc-sdk";
import affdex from './affectiva';
import CountUp from 'react-countup';
import { APP_ID } from '../constants';
import './Game.css';

let client = AgoraRTC.createClient({ mode: "live", codec: "h264" });
const USER_ID = Math.floor(Math.random() * 1000000001);

export default class Game extends React.Component {

	constructor(props) {
		super(props);

		this.localStream = AgoraRTC.createStream({
			streamID: USER_ID,
			audio: true,
			video: true,
			screen: false
		});

		// affectiva detector instance
		this.detector = null;

		this.state = {
			remoteStreams: []
		};
	}
	
  componentDidMount() {
    this.initLocalStream();
    this.initClient();
  }

  componentDidUpdate() {
		// console.log('updating....', this.props);
		// if (this.detector) {
		// 	if (this.props.gameState !== GAME_STATES.RUNNING) {
		// 		this.detector.stop();
		// 	} else {
		// 		this.detector.start();
		// 	}
		// }
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
				this.detector = new affdex.FrameDetector(faceMode);
				// this.detector.detectAllExpressions();
				// this.detector.detectAllEmotions();
				this.detector.detectAllEmojis();
				// this.detector.detectAllAppearance();
				this.detector.start();

				video.addEventListener('play', () => {
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
						this.detector.process(imageData, deltaTime);

						setTimeout(() => draw(), 100);
					};

					//Construct a FrameDetector and specify the image width / height and face detector mode.
					this.detector.addEventListener("onInitializeSuccess", () => {
						console.log('affectiva initialisation SUCCESS!');
						draw();
					});
					this.detector.addEventListener("onInitializeFailure", () => {
						console.log('affectiva initialisation FAILED!');
					});
					this.detector.addEventListener("onImageResultsSuccess", (faces) => {
						if (faces.length) {
							const face = faces[0];
							this.props.feedEmojiRecogResult(face.emojis.dominantEmoji);
						}
					});
					this.detector.addEventListener("onImageResultsFailure", (image, timestamp, err_detail) => {
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
				this.props.onGameStart();
				if (Object.keys(this.state.remoteStreams).length === 1) {
					console.log("%c Remote stream added", "font-size: 40px");
				}
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
					// for testing only
					this.props.onGameStart();
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
		const {
			gameState: {
				timeLeft,
				expectedEmoji,
				showInLeftOrRight,
				matches,
				showGlow,
				score
			},
			match
		} = this.props;
		const userInfo = JSON.parse(localStorage.getItem('user'));
		const randomWidth = Math.random() * (window.innerWidth / 2) + 100;
    return (
      <div>
        <div id="agora_local" style={{ width: "100%", height: "50vh" }} />
				<canvas id="our-canvas" />
				<div className="player-header">
					<span>{userInfo.displayName}</span>
					<span>
						<CountUp end={score} duration={1.2} />
					</span>
				</div>
				<div className="player-header" style={{ top: '50%' }}>
					<span>{userInfo.displayName === match.player1.name ? match.player2.name : match.player1.name}</span>
					<span>{userInfo.displayName === match.player1.name ? match.player2.score : match.player1.score}</span>
				</div>
				<div>
					<img
						className="emoji"
						src={expectedEmoji.imageSrc}
						alt={expectedEmoji.text}
						style={{
							bottom: `${100 - (timeLeft * 5) + 5}%`,
							left: showInLeftOrRight === -1 ? (timeLeft % 2 === 0 ?  randomWidth: (randomWidth) + 40) : null,
							right: showInLeftOrRight === 1 ? (timeLeft % 2 === 0 ?  randomWidth: (randomWidth) + 40) : null,
							transform: matches > 5 ? 'scale(0)' : null
						}}
					/>
					<div
						className="shadow"
						style={{ boxShadow: showGlow ? `inset 0px 0px 60px 24px ${showGlow}` : 'none' }}
					></div> : ''
				</div>
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