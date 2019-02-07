import React, {Component} from 'react';

import Button from '../button';
import Card from '../card';
import Splash from '../splash';

import resources from '../../resources';

import {
    CONFIG_CLONES,
    CONFIG_WIN_THRESHOLD,
    CONFIG_PICK_DURATION,
    CONFIG_RESET_DURATION,
    CONFIG_HINT_DURATION,
    CONFIG_FAIL_PICKS
} from '../../constants';

import { MATCH_ID_NO_MATCH } from '../../contexts/cards-context';

import './app.css';

export const GAME_STATE = {
    start: 0,
    progress: 1,
    over: 2
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameState: GAME_STATE.start,
            isLastMove: false,
            lastGameMoves: 0,
            hintsUsed: 0,
            failPicks: 0
        };

        this.handleCardPick = this.handleCardPick.bind(this);
        this.handleShowHint = this.handleShowHint.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);
        this.handleGameReset = this.handleGameReset.bind(this);
        this.initGame = this.initGame.bind(this);
    }

    componentDidMount() {
        const images = [];

        for (let i = 0; i < this.props.cards.length; i++) {
            const img = new Image();

            img.src = this.props.cards[i].content;
            images.push(img);
        }

        this.props.initGame();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const leftToWin = this.props.getIdsLeft().length;

        if (leftToWin === CONFIG_WIN_THRESHOLD && !this.state.isLastMove) {
            this.props.setPickAvailable(false);
            this.setState({
                isLastMove: true
            });

            setTimeout(() => {
                this.props.pickCard();

                setTimeout(() => {
                    this.props.removeCards();

                    setTimeout(() => {
                        this.setState({
                            gameState: GAME_STATE.over,
                            lastGameMoves: this.props.movesMade
                        });

                        this.props.setPickAvailable(true);
                    }, CONFIG_PICK_DURATION);
                }, CONFIG_PICK_DURATION/2);
            }, CONFIG_PICK_DURATION/2);

            return;
        }

        if (this.props.pickedCardsIndexes.length !== prevProps.pickedCardsIndexes.length) {
            const matchId = this.props.getMatchId();

            if (this.props.pickedCardsIndexes.length === CONFIG_CLONES) {
                this.props.setPickAvailable(false);

                if (matchId === MATCH_ID_NO_MATCH) {
                    this.setState({
                        failPicks: this.state.failPicks + 1
                    });

                    setTimeout(() => {
                        this.props.resetPicks();
                        this.props.setPickAvailable(true);
                    }, CONFIG_PICK_DURATION);
                } else if (matchId >= 0) {
                    setTimeout(() => {
                        this.props.removeCards(matchId);
                        this.props.setPickAvailable(true);
                    }, CONFIG_PICK_DURATION);

                    this.setState({
                        failPicks: 0
                    });
                }
            }
        }
    }

    initGame() {
        this.setState({
            isLastMove: false,
            hintsUsed: 0,
            failPicks: 0
        });

        this.props.initGame();
    }

    handleGameStart() {
        this.setState({
            gameState: GAME_STATE.progress,
        });

        this.initGame();
        this.props.initGame();
    }

    handleGameReset() {
        this.props.removeCards();

        setTimeout(() => {
            this.initGame();
        }, CONFIG_RESET_DURATION);
    }

    handleCardPick({ index, isSelected }) {
        this.props.pickCard(index, isSelected);
    }

    handleShowHint() {
        if (!this.props.hintsLeft) return;

        const leftIds = this.props.getIdsLeft();
        const leftToWin = leftIds.length;
        const randomId = leftIds[~~(Math.random() * leftToWin)];

        this.props.toggleCardHint(randomId, true);

        setTimeout(() => {
            this.props.toggleCardHint(randomId, false)
        }, CONFIG_HINT_DURATION);

        this.setState({
            hintsUsed: this.state.hintsUsed + 1
        });
    }

    renderCards() {
        return (
            this.props.cards.map((card, idx) => (
                <Card
                    key={idx}
                    id={card.id}
                    index={card.index}
                    isHighlighted={card.isHighlighted}
                    isRemoved={card.isRemoved}
                    isSelected={card.isSelected}
                    isDisabled={!this.props.isPickAvailable}
                    onClick={this.handleCardPick}
                >
                    {card.content}
                </Card>
            ))
        );
    }

    renderStateStart() {
        return (
            <section>
                <Splash
                    heading={resources.start.heading}
                >
                    <Button
                        size="large"
                        mode="primary"
                        onClick={this.handleGameStart}
                    >
                        {resources.controls.start}
                    </Button>
                </Splash>
            </section>
        );
    }

    renderStateProgress() {
        return (
            <section>
                <h2 className="title is-3 has-text-centered">
                    {resources.heading}
                </h2>

                <section className="has-text-centered">
                    { this.renderCards() }
                </section>

                <br/>

                <section className="box has-text-centered">
                    {
                        <Button mode="warning" size="medium" onClick={this.handleGameReset}>
                            {resources.controls.restart}
                        </Button>
                    }
                    <span>&nbsp;</span>
                    {
                        (Boolean(this.props.hintsLeft) && this.state.failPicks >= CONFIG_FAIL_PICKS) &&
                        <Button className="is-info" size="medium" onClick={this.handleShowHint}>
                            {resources.controls.hint}
                            <span>&nbsp;</span>
                            <span className="tag is-white">{ this.props.hintsLeft }</span>
                        </Button>
                    }
                </section>
            </section>
        );
    }

    renderStateOver() {
        return (
            <section>
                <Splash
                    heading={resources.result.heading}
                >
                    <div className="content is-large">
                        <div>{resources.result.moves}: { this.props.movesMade }</div>
                        <div>{resources.result.hints}: { this.state.hintsUsed }</div>
                    </div>
                    <br/>
                    <Button
                        size="large"
                        mode="primary"
                        onClick={this.handleGameStart}
                    >
                        {resources.controls.retry}
                    </Button>
                </Splash>
            </section>
        );
    }

    renderStates() {
        switch(this.state.gameState) {
            case GAME_STATE.start:
                return this.renderStateStart();

            case GAME_STATE.progress:
                return this.renderStateProgress();

            case GAME_STATE.over:
                return this.renderStateOver();

            default:
                return this.renderStateStart();
        }
    }

    render() {
        return (
            <main>

                <div className="container has-text-centered">
                    <div className="section">
                        <div className="columns">
                            <div className="column is-8 is-offset-2">
                                {this.renderStates()}
                            </div>
                            <div className="column is-2">
                                {
                                    this.state.gameState === GAME_STATE.progress &&
                                    <section>
                                        <h2 className="title is-3 has-text-centered">
                                            {resources.score.heading}
                                        </h2>
                                        <div className="box">
                                            <table className="table is-fullwidth">
                                                <tbody>
                                                <tr>
                                                    <td>{resources.score.moves}</td>
                                                    <td className="has-text-right">{ this.props.movesMade }</td>
                                                </tr>
                                                <tr>
                                                    <td>{resources.score.lastGame}</td>
                                                    <td className="has-text-right">{ this.state.lastGameMoves }</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </section>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        );
    }
}

export default App;
