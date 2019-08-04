import React, { Component } from 'react';
import firebase from '../firebase.init';
import './Home.css';
import languages from '../assets/language'; 

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
			user: {},
			findingMatch: false,
			match: null,
			matchFound: false,
			selfHosted: false,
      language: {}
		};

		this.unsubscribe = null;
		this.startMatch = this.startMatch.bind(this);
  }
  componentDidMount() {
    this.setState({ user: JSON.parse(localStorage.getItem('user') || {}) });
    const langKey = localStorage.getItem('lang') || 'english';
    this.setState({ language: languages[langKey] });
  }
  startGame = () => {
		this.setState({ findingMatch: true });
		const matchmakingCollection = firebase.firestore().collection('matchmaking');
		this.unsubscribe = matchmakingCollection.onSnapshot((res) => {
			const matches = res.docs.map(r => r.data());
			let joined = false;
			
			// find and join someone else' hosted match
			matches.forEach(match => {
				if (match.status === 'FINDING' && match.player1.uid !== this.state.user) {
					this.unsubscribe();
					joined = true;
					matchmakingCollection.doc(match.timestamp).update({
						status: 'RUNNING',
						player2: {
							name: this.state.user.displayName,
							uid: this.state.user.uid
						}
					}).then(() => {
						matchmakingCollection.doc(match.timestamp).get().then(res => {
							const match = res.data();
							console.log('Starting Match...', match);
							this.setState({
								findingMatch: false,
								matchFound: true,
								match
							});
						});
						this.startMatch(match);
					});
				}
			});

			// add a new match to queue if somebody else not already finding the match
			if (!joined) {
				this.unsubscribe();
				this.setState({ selfHosted: true });
				const newMatchTimestamp = Number(new Date()).toString();
				matchmakingCollection.doc(newMatchTimestamp).set({
					player1: {
						name: this.state.user.displayName,
						uid: this.state.user.uid
					},
					status: 'FINDING',
					timestamp: newMatchTimestamp
				});
				matchmakingCollection.doc(newMatchTimestamp).onSnapshot(res => {
					const match = res.data();
					if (match.status === 'RUNNING') {
						console.log('MATCH STARTED', match);
						this.setState({
							findingMatch: false,
							matchFound: true,
							match
						});
						this.startMatch(match);
					}
				});
			}
		});
	}
	
	startMatch(match) {
		localStorage.setItem('match', JSON.stringify(match));
		this.props.history.push('/game');
	}

	componentWillUnmount() {
		if (this.unsubscribe) this.unsubscribe();
	}

  render() {
    const { language, findingMatch } = this.state;
    return (
      <div className="main">
				<div style={{ textAlign: 'center' }}>
					<img className="avatar-large" src={this.state.user.imageUrl} onClick={this.showUploadPanel} />
				</div>
        <img src={this.state.user.photoURL} alt="avatar" className="avatar" width="100%" />
        <h2 className="username">{language.WELCOME} {this.state.user.displayName}</h2>
				<button className="button" onClick={this.startGame}>
					{findingMatch ? language.FINDING_MATCH : language.START}
				</button>
      </div>
    );
  }
}

export default Home;
