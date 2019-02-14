import React from 'react';
import { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

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
            <Paper>
                <Typography
                    align="center"
                    variant="h2"
                >
                    {heading}
                </Typography>
                {
                    text &&
                    <Typography
                        align="center"
                        variant="subtitle2"
                    >
                        {text}
                    </Typography>
                }
                {
                    children &&
                    <section>
                        <Divider variant="fullWidth" />
                        {children}
                        <Divider variant="fullWidth" />
                    </section>
                }
            </Paper>
        );
    }
}

export default Splash;
