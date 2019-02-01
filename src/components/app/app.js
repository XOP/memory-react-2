import React, {Component} from 'react';

import Button from '../button';
import Card from '../card';

import { CONFIG_CLONES } from '../../constants';
import { MATCH_ID_NO_MATCH } from '../../contexts/cards-context';

import './app.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {

        };

        this.resetCards = this.resetCards.bind(this);
        this.handleCardPick = this.handleCardPick.bind(this);
    }

    componentDidMount() {
        this.props.cards.map(card => {
            const img = new Image();

            img.src = card.content;
        });

        this.props.initCards();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.pickedCardsIndexes.length !== prevProps.pickedCardsIndexes.length) {
            const matchId = this.props.getMatchId();

            if (this.props.pickedCardsIndexes.length === CONFIG_CLONES) {
                if (matchId === -1) {
                    setTimeout(() => {
                        this.props.resetPicks();
                    }, 1000);
                } else if (matchId >= 0) {
                    setTimeout(() => {
                        this.props.removeCards(matchId);
                    }, 1000);
                }
            }
        }
    }

    resetCards() {
        this.props.initCards();
    }

    handleCardPick({ index, isSelected }) {
        this.props.pickCard(index, isSelected);
    }

    // isDisabled={!isPickAvailable}
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
                    onClick={this.handleCardPick}
                >
                    {card.content}
                </Card>
            ))
        );
    }

    render() {
        return (
            <main className='has-background-info'>

                <div className="container has-text-centered">
                    <div className="section">
                        <div className="columns">
                            <div className="column is-8 is-offset-2">
                                {this.renderCards()}
                            </div>
                        </div>
                    </div>

                    <Button onClick={this.props.initCards}>Reset Cards</Button>
                </div>

            </main>
        );
    }
}

export default App;
