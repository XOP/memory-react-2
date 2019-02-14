import React from 'react';
import ReactDOM from 'react-dom';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from './components/app';
import { CardsProvider } from './contexts/cards-context';

import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#40c4ff',
            light: '#82f7ff',
            dark: '#0094cc'
        },
        secondary: {
            main: '#ff3d00',
            light: '#ff7539',
            dark: '#c30000'
        },
        text: {

        }
    }
});

ReactDOM.render(
    <MuiThemeProvider theme={theme}>
        <CardsProvider>
            <App />
        </CardsProvider>
    </MuiThemeProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
