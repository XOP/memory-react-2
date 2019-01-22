import { MouseEvent, Component } from 'react';
import React from 'react';

import cls from 'classnames';

export interface Props {
    children: any;
    className?: string;
    onClick?(e: MouseEvent<HTMLElement>): void;
    disabled?: boolean;
    full?: boolean;
    size?: boolean;
    mode?: string;
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
            className,
            disabled,
            full,
            size,
            mode
        } = this.props;

        return (
            <button
                className={cls('button', className, {
                    'is-disabled': disabled,
                    'is-fullwidth': full,
                    [`is-${size}`]: size,
                    [`is-${mode}`]: mode
                })}
                onClick={this.handleClick}
            >
                {children}
            </button>
        );
    }
}

export default Button;
