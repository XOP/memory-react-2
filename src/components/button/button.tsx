import React from 'react';
import { MouseEvent, Component } from 'react';

import ButtonComponent from '@material-ui/core/Button';

interface Props {
    children: any;
    className?: string;
    onClick?(e: MouseEvent<HTMLElement>): void;
    disabled?: boolean;
    size?: any | string;
    mode?: any | string;
    variant?: any | string;
}

class Button extends Component<Props, {}> {
    constructor(props: Props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e: MouseEvent<HTMLElement>) {
        const { onClick } = this.props;

        if (onClick) {
            onClick(e);
        }
    };

    render() {
        const {
            children,
            disabled,
            size,
            mode,
            variant
        } = this.props;

        return (
            <ButtonComponent
                variant={variant}
                onClick={this.handleClick}
                size={size}
                color={mode}
                disabled={disabled}
            >
                {children}
            </ButtonComponent>
        );
    }

    static defaultProps = {
        variant: 'contained'
    }
}

export default Button;
