import React, {Fragment, Component} from 'react';

import urljoin from 'url-join';
import localStorage from 'localStorage';

import Toolbar from '@material-ui/core/Toolbar';

import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from '@material-ui/core/Link';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';

import { withStyles } from '@material-ui/core/styles';

import Button from '../button';
import Card from '../card';
import Panel from '../panel';

import { IconBulb } from '../icons';

import resources from '../../resources';

import {
    CONFIG_CLONES,
    CONFIG_COUNT,
    CONFIG_DEFAULT_IMAGES,
    CONFIG_WIN_THRESHOLD,
    CONFIG_PICK_DURATION,
    CONFIG_RESET_DURATION,
    CONFIG_HINT_DURATION,
    CONFIG_FAIL_PICKS,
    ENDPOINT_IMAGES
} from '../../constants';

import { MATCH_ID_NO_MATCH } from '../../contexts/cards-context';

const styles = theme => ({
    p4: {
        padding: `${theme.spacing.unit * 4}px`
    },

    container: {
        height: '100vh',
        flexWrap: 'nowrap'
    },

    content: {
        flex: '1 0 auto'
    },

    main: {
        padding: `${theme.spacing.unit * 4}px ${theme.spacing.unit * 4}px`,
        margin: '0 auto',
        maxWidth: '800px'
    },

    cards: {
        margin: '0 auto'
    },

    toolbar: {
        padding: `${theme.spacing.unit * 2}px`
    },

    controls: {
        justifyItems: 'center',
        justifyContent: 'space-around'
    },

    footer: {
        textAlign: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 4}px`,
        background: theme.palette.grey[800],
        color: theme.palette.grey[100]
    },

    linkInverted: {
        color: theme.palette.grey[100],
        '&:hover': {
            color: theme.palette.grey[100]
        }
    },

    hero: {
        textAlign: 'center',
        padding: `${theme.spacing.unit * 4}px 0`
    },

    heroButton: {
        marginTop: `${theme.spacing.unit * 4}px`
    },

    heroImage: {
        width: '32vh',
        maxWidth: '360px',
        [theme.breakpoints.down('sm')]: {
            width: '80%'
        }
    }
});


export const GAME_STATE = {
    start: 0,
    progress: 1,
    over: 2
};

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
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
        this.handleMenuNav = this.handleMenuNav.bind(this);
        this.handleImagesRequest = this.handleImagesRequest.bind(this);
        this.initGame = this.initGame.bind(this);
    }

    componentDidMount() {
        let imagesData = localStorage.getItem('memory2Images') || CONFIG_DEFAULT_IMAGES;

        if (typeof imagesData === 'string') {
            imagesData = JSON.parse(imagesData);
        }

        this.props.setCards(imagesData.map(item => ({...item, content: item })));
        this.props.initGame();

        setTimeout(() => {
            const images = [];

            for (let i = 0; i < this.props.cards.length; i++) {
                const img = new Image();

                img.src = this.props.cards[i].content;
                images.push(img);
            }
        }, 0);
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

    handleMenuNav() {
        this.setState({
            gameState: GAME_STATE.start
        });
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

    async handleImagesRequest() {
        this.setState({
            isLoading: true
        });

        const requestUrl = urljoin(ENDPOINT_IMAGES, 'images', `?count=${CONFIG_COUNT}`);
        const images = await fetch(requestUrl, {
            mode: 'cors'
        });

        let imagesData = await images.json();

        if (imagesData.length) {
            imagesData = imagesData.map(item => item.urls.small);
            localStorage.setItem('memory2Images', JSON.stringify(imagesData));

            this.props.setCards(imagesData.map(item => ({ content: item })));
        }

        this.setState({
            isLoading: false
        });
    }

    renderCards() {
        const {classes} = this.props;

        return (
            <Grid
                className={classes.cards}
                container
                justify="space-evenly"
                spacing={24}
                xs={12}
                sm={10}
            >
                {
                    this.props.cards.map((card, idx) => (
                        <Grid
                            item
                        >
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
                        </Grid>
                    ))
                }
            </Grid>
        );
    }

    renderStateStart() {
        const { classes } = this.props;

        return (
            <section>
                <div>
                    <Typography
                        align="center"
                        variant="h2"
                    >
                        {resources.start.heading}

                        <div className={classes.hero}>
                            <img
                                className={classes.heroImage}
                                src="https://upload.wikimedia.org/wikipedia/commons/5/58/Human_brain.png"
                                alt=""
                            />

                            <div className={classes.heroButton}>
                                <Button
                                    mode="primary"
                                    size="large"
                                    onClick={this.handleGameStart}
                                >
                                    {resources.controls.start}
                                </Button>
                            </div>
                        </div>
                    </Typography>

                </div>

                {/* START Menu component */}
                {/*
                <Panel>
                    <Button
                        size="middle"
                        onClick={this.handleImagesRequest}
                    >
                        Randomize images
                    </Button>
                </Panel>
                */}
                {/* END Menu component */}
            </section>
        );
    }

    renderStateProgress() {
        const { classes } = this.props;

        return (
            <section>
                <section>
                    { this.renderCards() }
                </section>

                <br/>

                <Panel>
                    <Toolbar className={classes.controls} variant="dense">
                        <Button mode="primary" size="medium" onClick={this.handleMenuNav}>
                            {resources.controls.menu}
                        </Button>
                        <Button mode="secondary" size="medium" onClick={this.handleGameReset}>
                            {resources.controls.restart}
                        </Button>
                        {
                            (Boolean(this.props.hintsLeft) && this.state.failPicks >= CONFIG_FAIL_PICKS) &&
                            <Button
                                mode="secondary"
                                variant="outlined"
                                size="medium"
                                onClick={this.handleShowHint}
                            >
                                {resources.controls.hint}
                                <span>&nbsp;</span>
                                <span className="tag is-white">{this.props.hintsLeft}</span>
                            </Button>
                        }
                    </Toolbar>
                </Panel>
            </section>
        );
    }

    renderStateOver() {
        const { classes } = this.props;

        return (
            <section>
                <Panel
                    heading={resources.result.heading}
                >
                    <div className={classes.p4}>
                        <Typography
                            align="center"
                            variant="h5"
                        >
                            <div>{resources.result.moves}: { this.props.movesMade }</div>
                            <div>{resources.result.hints}: { this.state.hintsUsed }</div>
                        </Typography>
                    </div>

                    <Typography align="center">
                        <Button
                            size="large"
                            mode="primary"
                            onClick={this.handleGameStart}
                            disabled={this.state.isLoading}
                        >
                            {resources.controls.retry}
                        </Button>
                    </Typography>

                    {/*
                    <div className="section">
                        <Button mode="link" size="medium" onClick={this.handleMenuNav}>
                            {resources.controls.menu}
                        </Button>
                    </div>
                    */}
                </Panel>
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
        const { classes } = this.props;

        return (
            <Fragment>
                <CssBaseline />
                <Grid
                    className={classes.container}
                    container
                    direction="column"
                    alignContent="stretch"
                >
                    <Grid item>
                        <Toolbar className={classes.toolbar}>
                            <Fab color="secondary">
                                <IconBulb />
                            </Fab>
                        </Toolbar>
                        {
                            this.state.isLoading &&
                            <LinearProgress color="secondary"/>
                        }
                    </Grid>
                    <Grid item className={classes.content}>
                        <main className={classes.main}>
                            {this.renderStates()}
                        </main>

                        {/*
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
                        */}
                    </Grid>
                    <Grid item className={classes.footer}>
                        <Link
                            href="https://github.com/XOP/memory-react-2"
                            variant="body1"
                            color="inherit"
                            className={classes.linkInverted}
                        >
                            React Memory 2 © 2019
                        </Link>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default withStyles(styles)(App);
