import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import history from "./core/history"
import SignUp from "./signup/SignUp"
import TradingEq from "./t-equipments";
import Home from "./event";
import CurrencyConverter from "./t-equipments/currency-converter";
import Post from "./event/Post"

class Routes extends Component {
    render() {
        return (
        <Router history={history}>
            <Switch>
                <Route path="/signup" render={() => { return <SignUp />; }} />
                <Route path="/t-equipments/converter" render={() => { return <CurrencyConverter />; }} />
                <Route path="/t-equipments" render={() => { return <TradingEq />; }} />
                <Route path="/events" render={() => { return <Home />; }} />
                <Route path='/:post_id' component={Post} />
                <Route path="/" render={() => { return <Home />; }} />
            </Switch>
        </Router>
    )
    }
}

export default Routes