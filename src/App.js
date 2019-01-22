import React, {Component} from 'react';

import Button from './components/button';

import './App.css';

class App extends Component {
    render() {
        return (
            <main className='has-background-info'>
                <div className="hero is-large has-text-centered">
                    <div className="hero-body">
                        <div className="container">
                            <Button>Do Nothing</Button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
