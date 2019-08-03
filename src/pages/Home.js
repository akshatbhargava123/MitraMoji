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
		
		this.startGame = this.startGame.bind(this);
		this.feedEmojiRecogResult = this.feedEmojiRecogResult.bind(this);
  }
	
	startGame() {
		const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
		console.log('RANDON EMOJI', randomEmoji);
		this.setState({
			gameState: {
				expectedEmoji: randomEmoji,
				score: this.state.gameState.score,
				state: GAME_STATES.RUNNING,
				timeLeft: 10, // in seconds,
				showInLeftOrRight: Math.random() > 0.5 ? 1 : -1,
			}
		}, () => {
			const interval = setInterval(() => {
				console.log(this.state.gameState)
				if (this.state.gameState.timeLeft === 1) {
					// change emoji here, player couldn't get previous emoji match done
					console.log("%c CLEAR INTERVAL", "font-size: 30px")
					clearInterval(interval);
					this.startGame();
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

	feedEmojiRecogResult(emoji) {
		// return if game is not running currently
		if (this.state.gameState.state !== GAME_STATES.RUNNING) return;

		console.log(emoji, this.state.gameState.expectedEmoji.text);
		if (emoji === this.state.gameState.expectedEmoji.text) {
			console.log('MATCH MATCH MATCH!!!');
		} else {
			console.log('CHANGE EMOJI NOW!');
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
