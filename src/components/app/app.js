import React, {Component} from 'react';

import Button from '../button';
import Card from '../card';
import Splash from '../splash';

import resources from '../../resources';

import {
    CONFIG_CLONES,
    CONFIG_PICK_DURATION,
    CONFIG_RESET_DURATION,
    CONFIG_WIN_THRESHOLD
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
            isLastMove: false
        };

        this.handleCardPick = this.handleCardPick.bind(this);
        this.handleGameStart = this.handleGameStart.bind(this);
        this.handleGameReset = this.handleGameReset.bind(this);
    }

    componentDidMount() {
        this.props.cards.map(card => {
            const img = new Image();

            img.src = card.content;
        });

        this.props.initCards();
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
                            gameState: GAME_STATE.over
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
                    setTimeout(() => {
                        this.props.resetPicks();
                        this.props.setPickAvailable(true);
                    }, CONFIG_PICK_DURATION);
                } else if (matchId >= 0) {
                    setTimeout(() => {
                        this.props.removeCards(matchId);
                        this.props.setPickAvailable(true);
                    }, CONFIG_PICK_DURATION);
                }
            }
        }
    }

    handleGameStart() {
        this.setState({
            gameState: GAME_STATE.progress,
            isLastMove: false
        });

        this.props.initCards();
    }

    handleGameReset() {
        this.props.removeCards();

        setTimeout(() => {
            this.props.initCards();

            // this.setState({
            //     failedMatchClicks: 0,
            //     isGameLastMove: false
            // });
        }, CONFIG_RESET_DURATION);
    }

    handleCardPick({ index, isSelected }) {
        this.props.pickCard(index, isSelected);
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

    renderStates() {
        // eslint-disable-next-line default-case
        switch(this.state.gameState) {
            case GAME_STATE.start:
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

            case GAME_STATE.progress:
                return (
                    <section>
                        <section className="has-text-centered">
                            { this.renderCards() }
                        </section>

                        <br/>

                        <section className="box has-text-centered">
                            {
                                // this.state.failedMatchClicks >= CONFIG_RESET_CLICKS &&
                                <Button mode="warning" size="medium" onClick={this.handleGameReset}>
                                    {resources.controls.restart}
                                </Button>
                            }
                            <span>&nbsp;</span>
                            {
                                // Boolean(this.props.hintsLeft) &&
                                // <Button className="is-info" size="medium" onClick={this.handleShowHint}>
                                //     {resources.controls.hint}
                                //     <span>&nbsp;</span>
                                //     <span className="tag is-white">{ this.props.hintsLeft }</span>
                                // </Button>
                            }
                        </section>
                    </section>
                );

            case GAME_STATE.over:
                return (
                    <section>
                        <Splash
                            heading={resources.result.heading}
                        >
                            <div className="content is-large">
                                <div>{resources.result.moves}: {-1}</div>
                                <div>{resources.result.hints}: {-1}</div>
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
    }

    render() {
        return (
            <main className='has-background-info'>

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
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>{resources.score.moves}</td>
                                                    <td className="has-text-right">{ -1 }</td>
                                                </tr>
                                                <tr>
                                                    <td>{resources.score.lastGame}</td>
                                                    <td className="has-text-right">{ -1 }</td>
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
