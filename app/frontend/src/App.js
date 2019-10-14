import React from 'react';
import Alert from './components/Alert';
import './App.css';
import ArkenHeader from './components/Header/ArkenHeader';
import 'semantic-ui-css/semantic.min.css'
import Routes from './components/Router';


function App() {
  return (
    <div className="App">
        <div>
            <ArkenHeader />
            <Routes />
        </div>
        <Alert />
    </div>
  );
}

export default App;
