import React from 'react';
import App from './app';

import { CardsContext } from '../../contexts/cards-context';

export default props => (
    <CardsContext.Consumer>
        {rest => (
            <App
                {...props}
                {...rest}
            />
        )}
    </CardsContext.Consumer>
);
