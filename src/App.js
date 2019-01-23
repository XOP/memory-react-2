import React, {Component} from 'react';

import Button from './components/button';
import Card from './components/card';

import './App.css';

class App extends Component {
    render() {
        return (
            <main className='has-background-info'>
                <div className="hero is-large has-text-centered">
                    <div className="hero-body">
                        <div className="container">
                            <div className="section">
                                {
                                    Array(3).fill(null).map(_ =>
                                        <Card>Content</Card>
                                    )
                                }
                            </div>

                            <Button>Do Nothing</Button>
                        </div>
                    </div>
                </div>
            </main>
        );
    }
}

export default App;
