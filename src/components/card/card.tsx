import React from 'react';
import { MouseEvent, Component } from 'react';

import cls from 'classnames';
import styles from './card.module.scss';

interface Props {
    children?: string;
    imageSrc?: string;
    onClick?(e: MouseEvent<HTMLElement>): void;
    title?: string;

    isHighlighted: boolean;
    isRemoved: boolean
    isSelected: boolean;
}

class Card extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e: MouseEvent<HTMLElement>) {
        const {onClick} = this.props;

        if (onClick) {
            onClick(e);
        }
    };

    render() {
        const {
            children,
            imageSrc,
            isHighlighted,
            isRemoved,
            isSelected,
            title
        } = this.props;

        const cardImage = (
            imageSrc ?
                <img src={imageSrc} alt={title} /> :
                <img src={children} alt={children} />
        );

        return (
            <div
                className={cls('card', styles.card, {
                    [`${styles.card__hl}`]: isHighlighted,
                    [`${styles.card__selected}`]: isSelected,
                    [`${styles.card__removed}`]: isRemoved
                })}
                onClick={this.handleClick}
            >
                {
                    isSelected ?
                        <figure className="image is-square">
                            {cardImage}
                        </figure> :
                        <div className={cls('image is-square', styles.back)} />
                }
            </div>
        );
    }

    static defaultProps = {
        isHighlighted: false,
        isRemoved: false,
        isSelected: false
    };
}

export default Card;
