import React from 'react';

import arrayShuffle from 'array-shuffle';
import _uniq from 'lodash/uniq';

import {
    CONFIG_CLONES,
    CONFIG_HINTS
} from '../constants';

export const MATCH_ID_NO_MATCH = -1;
export const MATCH_ID_NO_CARDS = -0;

export const CardsContext = React.createContext(undefined);

export class CardsProvider extends React.Component {
    state = {
        cards: [],
        cardsData: [],

        pickedCardsIndexes: [],
        removedCardsIds: [],

        isPickAvailable: true,

        hintsLeft: CONFIG_HINTS,
        movesMade: 0
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
     * Retrieves unpicked cards
     * @return array
     */
    getCardsLeft = () => {
        return this.state.cards.filter(item => this.state.removedCardsIds.indexOf(item.id) === -1);
    };

    /**
     * Retrieves number of unpicked cards ids
     * @return array
     */
    getIdsLeft = () => {
        return _uniq(this.getCardsLeft().map(item => item.id));
    };

    /**
     * Allows or blocks card pick
     * @param isAvailable
     * @return void
     */
    setPickAvailable = (isAvailable) => {
        this.setState({
            isPickAvailable: isAvailable
        });
    };

    /**
     * High level wrapper that restores init state
     * @return void
     */
    initGame = () => {
        this.setCards();

        this.setState({
            movesMade: 0,
            hintsLeft: CONFIG_HINTS
        });
    };

    /**
     * Cards reset and shuffle
     * @param {array} cardsData
     */
    setCards = (cardsData = []) => {
        let cards = cardsData;

        if (!cards.length) {
            cards = this.state.cardsData;

            if (!cards.length) {
                return;
            }
        } else {
            this.setState({
                cardsData
            });
        }

        // {...} -> {..., id}
        const cardsWithId = cards.map((card, id) => Object.assign({}, card, { id }));

        // duplicating initial array N times
        const cardsCloned = new Array(CONFIG_CLONES).fill(null).reduce((acc) => {
            return acc.concat(cardsWithId.slice(0));
        }, []);

        // {...} -> {..., index}
        const cardsWithIndex = cardsCloned.map((card, index) => Object.assign({}, card, { index }));

        this.setState({
            cards: arrayShuffle(cardsWithIndex)
        });
    };

    /**
     * Card click callback
     * @return void
     */
    pickCard = (index, isSelected) => {
        if (index === undefined) {
            this.setState({
                cards: this.state.cards.map(item => ({
                    ...item,
                    isSelected: true
                }))
            });

            return;
        }

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
            })(),

            movesMade: (() => {
                if (this.state.pickedCardsIndexes.length === 0) {
                    return this.state.movesMade + 1;
                } else {
                    return this.state.movesMade
                }
            })()
        });
    };

    /**
     *
     * @param id
     * @param state
     * @return void
     */
    toggleCardHint = (id, state) => {
        if (id === undefined) return;
        if (state === undefined) state = false;

        this.setState({
            // toggle hint the card
            cards: this.state.cards.map(item => {
                if (item.id === id) {
                    return {
                        ...item,
                        isHighlighted: state
                    }
                } else {
                    return item;
                }
            })
        });

        if (state) {
            this.setState({
                hintsLeft: this.state.hintsLeft - 1
            });
        }
    };

    /**
     * Removes cards of matching id
     * @param id
     * @return void
     */
    removeCards = (id) => {
        if (id === undefined) {
            // if no id provided
            // remove all cards
            this.setState({
                cards: this.state.cards.map(item => ({
                    ...item,
                    isRemoved: true
                })),
                removedCardsIds: []
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
                }),
                removedCardsIds: this.state.removedCardsIds.concat(id)
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

                    // game handle
                    initGame: this.initGame,

                    // cards operations
                    setCards: this.setCards,
                    pickCard: this.pickCard,
                    toggleCardHint: this.toggleCardHint,
                    removeCards: this.removeCards,
                    resetPicks: this.resetPicks,

                    // aux operations
                    getMatchId: this.getMatchId,
                    getIdsLeft: this.getIdsLeft,

                    // extras and ui
                    setPickAvailable: this.setPickAvailable
                }}
            >
                {this.props.children}
            </CardsContext.Provider>
        );
    }
}
