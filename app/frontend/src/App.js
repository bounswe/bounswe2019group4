import React from 'react';
import Header from './components/Header/Header';
import './App.css';
import ArkenHeader from './components/Header/ArkenHeader';
import 'semantic-ui-css/semantic.min.css'
import Routes from './components/Router';


function App() {
  return (
    <div className="App">
      <ArkenHeader />
        <Routes />
    </div>
  );
}

export default App;
