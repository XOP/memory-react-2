import React, {Component} from 'react';
import Data from './playground';

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    Number: {Data.cardsNumber}
                </header>
            </div>
        );
    }
}

export default App;
