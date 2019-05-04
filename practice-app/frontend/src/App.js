import React, { Component } from 'react';
import { Route } from "react-router-dom";

import Signup from "./components/signup"
import Login from "./components/login"
import Home from "./components/event/Home"

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/" component={Home} exact></Route>
        <Route path="/auth/signup" component={Signup} exact></Route>
        <Route path="/auth/login" component={Login} exact></Route>

      </div>
    );
  }
}

export default App;
