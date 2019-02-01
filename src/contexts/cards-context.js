import React from 'react';

import arrayShuffle from 'array-shuffle';
import _uniq from 'lodash/uniq';

import { CONFIG_CLONES } from '../constants';

export const MATCH_ID_NO_MATCH = -1;
export const MATCH_ID_NO_CARDS = -0;

export const CardsContext = React.createContext(undefined);

export class CardsProvider extends React.Component {
    state = {
        cardsData: [
            {
                content: 'https://picsum.photos/256?image=1062'
            },
            {
                content: 'https://picsum.photos/256?image=1042'
            },
            {
                content: 'https://picsum.photos/256?image=1070'
            },
            {
                content: 'https://picsum.photos/256?image=1074'
            },
            {
                content: 'https://picsum.photos/256?image=1084'
            },
            {
                content: 'https://picsum.photos/256?image=1048'
            }
        ],

        cards: [],
        pickedCardsIndexes: [],
        pickedCardsIds: [],

        removedCardsIds: [],
        isPickAvailable: true,
        hintsLeft: 0,
        moves: 0
    };

    /**
     * Retrieves matching cards id value is any
     * @return number
     * @default -1
     */
    getMatchId = () => {
        const pickedCards = this.state.cards.filter(item => this.state.pickedCardsIndexes.indexOf(item.index) > -1);

        if (pickedCards.length !== CONFIG_CLONES) {
            return MATCH_ID_NO_CARDS;
        }

        const pickedCardsIds = pickedCards.map(item => item.id);

        if (_uniq(pickedCardsIds).length === 1) {
            return pickedCardsIds[0];
        } else {
            return MATCH_ID_NO_MATCH;
        }
    };

    /**
     * Cards reset and shuffle
     * @return array
     * @default []
     */
    initCards = () => {
        const cards = this.state.cardsData;

        // {...} -> {..., id}
        const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));

        // duplicating initial array N times
        const cardsCloned = new Array(CONFIG_CLONES).fill(null).reduce((acc) => {
            return acc.concat(cardsWithId.slice(0));
        }, []);

        // {...} -> {..., index}
        const cardsWithIndex = cardsCloned.map((card, index) => Object.assign({}, card, { index }));

        const newCards = arrayShuffle(cardsWithIndex);

        this.setState({
            cards: newCards
        });

        return newCards;
    };

    /**
     * Card click callback
     * @return void
     */
    pickCard = (index, isSelected) => {
        this.setState({

            // toggle select the card
            cards: this.state.cards.map(item => {
                if (item.index === index) {
                    return {
                        ...item,
                        isSelected: isSelected
                    }
                } else {
                    return item;
                }
            }),

            // add or remove card index from array
            pickedCardsIndexes: (() => {
                if (index === undefined) return this.state.pickedCardsIndexes;

                if (isSelected) {
                    return this.state.pickedCardsIndexes.concat(index);
                } else {
                    return this.state.pickedCardsIndexes.filter(item => item !== index);
                }
            })()
        });
    };

    /**
     * Removes cards of matching id
     * @param id
     * @return void
     */
    removeCards = (id) => {
        if (!id) {
            // if no id provided
            // remove all cards
            this.setState({
                cards: this.state.cards.map(item => ({
                    ...item,
                    isRemoved: true
                }))
            });
        } else {
            // otherwise remove
            // only specified id
            this.setState({
                cards: this.state.cards.map(item => {
                    if (item.id === id) {
                        return  {
                            ...item,
                            isRemoved: true
                        };
                    } else {
                        return item;
                    }
                })
            });
        }

        // reset picked indexes
        this.setState({
            pickedCardsIndexes: []
        });
    };

    /**
     * De-selects all cards
     * @return void
     */
    resetPicks = () => {
        this.setState({
            cards: this.state.cards.map(item => ({
                ...item,
                isSelected: false
            })),
            pickedCardsIndexes: []
        });
    };

    render() {
        return (
            <CardsContext.Provider
                value={{
                    ...this.state,
                    initCards: this.initCards,
                    pickCard: this.pickCard,
                    getMatchId: this.getMatchId,
                    removeCards: this.removeCards,
                    resetPicks: this.resetPicks
                }}
            >
                {this.props.children}
            </CardsContext.Provider>
        );
    }
}
