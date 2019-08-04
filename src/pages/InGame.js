import React, { Component } from 'react'
import Game from "../components/Game";
import firebase from '../firebase.init';
import { GAME_STATES, EMOJIS } from '../constants';

class InGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
			channel: null,
			gameState: {
				state: GAME_STATES.WAITING_FOR_OPPONENT,
				expectedEmoji: '',
				score: 0
			},
			match: {}
		};
		
		// manage emoji shown and position updates
		this.emojiInterval = null;
		this.unsubscribe = null;

		this.showGlow = this.showGlow.bind(this);
		this.startGame = this.startGame.bind(this);
		this.feedEmojiRecogResult = this.feedEmojiRecogResult.bind(this);
	}
	
	componentDidMount() {
		// init match
		const match = JSON.parse(localStorage.getItem('match') || {});
		const user = JSON.parse(localStorage.getItem('user') || {});
		firebase.firestore()
		.collection('matchmaking')
		.doc(match.timestamp)
		.get()
		.then(res => {
			const match = res.data();
			this.setState({ match, channel: match.timestamp, user });
		});
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
					this.setState({
						gameState: {
							...this.state.gameState,
							timeLeft: 0
						}
					});
					console.log('start game 1 called');
					setTimeout(() => this.startGame(), 2000);
				} else {
					this.setState({
						gameState: {
							...this.state.gameState,
							timeLeft: this.state.gameState.timeLeft - 1
						}
					});
					console.log('timeleft', this.state.gameState.timeLeft - 1);
				}
			}, 1000);
		});
	}

	showGlow(happy) {
		this.setState({
			gameState: {
				...this.state.gameState,
				state: GAME_STATES.NO_EMOJI,
				score: Math.max(0, (this.state.gameState.score + (happy ? 30 : -15))),
				showGlow: happy ? 'rgba(255, 224, 80, 0.6)' : 'rgba(244, 58, 16, 0.6)'
			}
		});

		// update score online for current player
		const playerKey = this.state.match.player1.name === this.state.user.displayName ? 'player1' : 'player2';
		firebase.firestore()
			.collection('matchmaking')
			.doc(this.state.match.timestamp)
			.update({
				[playerKey]: {
					...this.state.match[playerKey],
					score: Math.max(0, (this.state.gameState.score + (happy ? 30 : -15))),
				}
			});

		setTimeout(() => {
			this.setState({
				gameState: {
					...this.state.gameState,
					showGlow: null
				}
			});
		}, 1500);
	}

	feedEmojiRecogResult(emoji) {
		// return if game is not running currently
		if (this.state.gameState.state !== GAME_STATES.RUNNING) return;

		// just for giving delays in showing emojis
		if (
			this.state.gameState.timeLeft > 9 &&
			this.state.gameState.timeLeft <= 1
		) return;

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
					setTimeout(() => {
						console.log('start game 2 called');
						this.startGame()
					}, Math.random() * 5000 + 2000);
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

	componentWillUnmount() {
		if (this.unsubscribe) this.unsubscribe();
	}

  render() {
    return (
      <div className="App">
				{
					this.state.channel &&
					<Game
						match={this.state.match}
						channel={this.state.channel}
						onGameStart={this.startGame}
						gameState={this.state.gameState}
						feedEmojiRecogResult={this.feedEmojiRecogResult}
					/>
				}
      </div>
    );
  }
}

export default InGame;
