import React from 'react';
import { Component, CSSProperties } from 'react';

import cls from 'classnames';

import CardComponent from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme : any) => ({
    card: {
        transition: `all ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeOut}`,
        [theme.breakpoints.down('sm')]: {
            width: 'calc(32px + 10vh)',
            height: 'calc(32px + 10vh)'
        },
        [theme.breakpoints.up('sm')]: {
            width: 'calc(64px + 10vh)',
            height: 'calc(64px + 10vh)'
        }
    },

    image: {
        width: 'calc(64px + 10vh)',
        height: 'calc(64px + 10vh)'
    },

    back: {
        transition: `all ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeOut}`,
        background: theme.palette.primary.main,
        padding: '1vh'
    },

    isHighlighted: {
        background: theme.palette.primary.light
    },

    isSelected: {
    },

    isRemoved: {
        opacity: 0,
        visibility: 'hidden' as 'hidden',
        transform: 'translateY(-50%)'
    }
});


interface ClickProps {
    index: number | string;
    isSelected: boolean;
}

interface Props {
    classes?: any;
    children?: string;
    imageSrc?: string;
    onClick?(props: ClickProps): void;
    title?: string;

    id: number | string;
    index: number | string;
    isDisabled: boolean;
    isHighlighted: boolean;
    isRemoved: boolean;
    isSelected: boolean;
}

class Card extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        if (this.props.isDisabled || this.props.isRemoved) {
            return false;
        }

        if (this.props.isSelected === true) {
            return false;
        }

        if (this.props.onClick) {
            this.props.onClick({
                index: this.props.index,
                isSelected: !this.props.isSelected
            });
        }
    };

    render() {
        const {
            classes,
            children,
            imageSrc,
            isHighlighted,
            isRemoved,
            isSelected,
            title
        } = this.props;

        const cardImage = (
            imageSrc ?
                <CardMedia
                    className={classes.image}
                    image={imageSrc}
                    title={title}
                /> :
                <CardMedia
                    className={classes.image}
                    image={children}
                    title={children}
                />
        );

        return (
            <CardComponent
                className={cls(classes.card,  {
                    [classes.isRemoved]: isRemoved
                })}

                elevation={isSelected ? 16: 4}
            >
                <CardActionArea onClick={this.handleClick}>
                    {
                        isSelected ?
                            cardImage :
                            <figure
                                className={cls(classes.image, classes.back, {
                                    [classes.isHighlighted]: isHighlighted
                                })}
                            />
                    }
                </CardActionArea>
            </CardComponent>
        );
    }

    static defaultProps = {
        isHighlighted: false,
        isRemoved: false,
        isSelected: false,
        isDisabled: false
    };
}

export default withStyles(styles)(Card);
