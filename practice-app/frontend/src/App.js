import React, { Component } from 'react';
import { Route } from "react-router-dom";

import Signup from "./components/signup"
import Login from "./components/login"
import TradingEq from "./components/t-equipments"
import CurrencyConverter from "./components/t-equipments/currency-converter"

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route path="/auth/signup" component={Signup} exact></Route>
        <Route path="/auth/login" component={Login} exact></Route>
        <Route path="/t-equipments" component={TradingEq} exact></Route>
        <Route path="/t-equipments/lol" component={CurrencyConverter} exact></Route>
      </div>
    );
  }
}

export default App;
