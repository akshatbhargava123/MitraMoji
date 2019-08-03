import React, { Component } from 'react'
import Game from "../components/Game";
import { GAME_STATES, EMOJIS } from '../constants';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
			channel: "MY_CHANNEL",
			gameState: {
				state: GAME_STATES.WAITING_FOR_OPPONENT,
				expectedEmoji: '',
				score: 0
			}
		};
		
		// manage emoji shown and position updates
		this.emojiInterval = null;

		this.showGlow = this.showGlow.bind(this);
		this.startGame = this.startGame.bind(this);
		this.feedEmojiRecogResult = this.feedEmojiRecogResult.bind(this);
  }
	
	startGame() {
		const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
		this.setState({
			gameState: {
				expectedEmoji: randomEmoji,
				score: this.state.gameState.score,
				state: GAME_STATES.RUNNING,
				timeLeft: 10, // in seconds,
				showInLeftOrRight: Math.random() > 0.5 ? 1 : -1,
				matches: 0
			}
		}, () => {
			this.emojiInterval = setInterval(() => {
				if (this.state.gameState.timeLeft === 1) {
					// change emoji here, player couldn't get previous emoji match done
					clearInterval(this.emojiInterval);
					this.showGlow(false);
					setTimeout(() => this.startGame(), 2000);
				} else {
					this.setState({
						gameState: {
							...this.state.gameState,
							timeLeft: this.state.gameState.timeLeft - 1
						}
					});
				}
			}, 900);
		});
	}

	showGlow(happy) {
		this.setState({
			gameState: {
				...this.state.gameState,
				state: GAME_STATES.NO_EMOJI,
				showGlow: happy ? 'rgba(255, 224, 80, 0.6)' : 'rgba(244, 58, 16, 0.6)'
			}
		});
		setTimeout(() => {
			this.setState({
				gameState: {
					...this.state.gameState,
					showGlow: null
				}
			});
		}, 2000);
	}

	feedEmojiRecogResult(emoji) {
		// return if game is not running currently
		if (this.state.gameState.state !== GAME_STATES.RUNNING) return;

		// just for giving delays in showing emojis
		if (this.state.gameState.timeLeft > 9) return;

		console.log(emoji, this.state.gameState.expectedEmoji.text);
		if (emoji === this.state.gameState.expectedEmoji.text) {
			this.setState({
				gameState: {
					...this.state.gameState,
					matches: this.state.gameState.matches + 1
				}
			}, () => {
				if (this.state.gameState.matches > 5) {
					this.showGlow(true);
					if (this.emojiInterval) clearInterval(this.emojiInterval);
					setTimeout(() => this.startGame(), Math.random() * 5000 + 2000);
				}
			});
		}
		// switch (emoji) {
		// 	case '😐': return console.log('neutral!');
		// 	case '😏': return console.log('asdinsa');
		// 	case '😞': return console.log('sad');
		// 	case '😗': return console.log('kiss');
		// 	case '😒': return console.log('kiss');
		// 	case '😜': return console.log('tough out stuck');
		// 	case '😗': return console.log('kiss');
		// 	case '😗': return console.log('kiss');
		// 	default: return console.log('');
		// }
	}

  render() {
    return (
      <div className="App">
        <Game
					channel={this.state.channel}
					onGameStart={this.startGame}
					gameState={this.state.gameState}
					feedEmojiRecogResult={this.feedEmojiRecogResult}
				/>
      </div>
    );
  }
}

export default Home;
