import React, { Component } from 'react';
import { Route } from "react-router-dom";
import Header from "./components/Header/Header"
import Routes from "./components/Routes"
import Signup from "./components/signup/SignUp"
import Login from "./components/login/Login"

import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header/>
                {

                }
                <Routes/>
            </div>
        )
    }
}

export default App;
