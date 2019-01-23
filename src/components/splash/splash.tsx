import React from 'react';
import { Component } from 'react';

interface Props {
    heading: string;
    children?: any;
    text?: string;
}

class Splash extends Component<Props, {}> {
    render() {
        const {
            heading,
            children,
            text
        } = this.props;

        return (
            <section>
                <div className="section has-text-centered">
                    <h1 className="title is-2">
                        {heading}
                    </h1>
                    {
                        text &&
                        <h2 className="subtitle is-4">
                            {text}
                        </h2>
                    }
                    {
                        children &&
                        <div className="section">
                            {children}
                        </div>
                    }
                </div>
            </section>
        );
    }
}

export default Splash;
