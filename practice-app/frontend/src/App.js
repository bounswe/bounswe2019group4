import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Header from "./components/Header/Header"

import Signup from "./components/signup"
import Login from "./components/login"

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header a={"b"}/>
            </div>
        )
    }
}

export default App;
