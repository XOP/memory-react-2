import React from 'react';
import App from './app';

import { CardsContext } from '../../contexts/cards-context';

export default props => (
    <CardsContext.Consumer>
        {({
              initCards,
              pickCard,
              ...rest
        }) => (
            <App
                {...props}
                initCards={initCards}
                pickCard={pickCard}
                {...rest}
            />
        )}
    </CardsContext.Consumer>
);
