import React, {Component} from 'react';

import Button from './components/button';
import Card from './components/card';
import Splash from './components/splash';

import './App.css';

class App extends Component {
    render() {
        return (
            <main className='has-background-info'>
                <div className="container">
                    <Splash
                        heading="Memory"
                    >
                        card game
                    </Splash>
                </div>

                <div className="container has-text-centered">
                    <div className="section">
                        {
                            Array(3).fill(null).map(_ =>
                                <Card>Content</Card>
                            )
                        }
                    </div>

                    <Button>Do Nothing</Button>
                </div>
            </main>
        );
    }
}

export default App;
