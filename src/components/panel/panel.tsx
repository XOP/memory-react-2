import React from 'react';
import { Fragment, Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import { withStyles } from '@material-ui/core/styles';

const styles = (theme : any) => ({
    panel: {
        padding: `${theme.spacing.unit * 2}px`
    },

    heading: {
        padding: `${theme.spacing.unit * 2}px`
    },

    content: {
        padding: `${theme.spacing.unit * 2}px`
    }
});

interface Props {
    children: any;
    classes?: any;
    heading?: string;
}

class Panel extends Component<Props, {}> {
    render() {
        const {
            classes,
            heading,
            children
        } = this.props;

        return (
            <Paper className={classes.panel}>
                {
                    heading &&
                    <Fragment>
                        <Typography
                            className={classes.heading}
                            align="center"
                            variant="h3"
                        >
                            {heading}
                        </Typography>
                        <Divider />
                    </Fragment>
                }
                <section>
                    <div className={classes.content}>
                        {children}
                    </div>
                </section>
            </Paper>
        );
    }
}

export default withStyles(styles)(Panel);
