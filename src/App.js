import React from 'react';
import './App.css';

import Box from './components/box';

function App() {
    return (
        <div className="app">
            <header className="app-header">
                <h1>{'3D Box'}</h1>
                <p>Click & drag in order to rotate the cube</p>
            </header>
            <main>
                <Box />
            </main>
        </div>
    );
}

export default App;
