import React, { Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import history from "./core/history"
import SignUp from "./signup/SignUp"

class Routes extends Component {
    render() {
        return (
        <Router history={history}>
            <Switch>
                <Route
                    path="/signup"
                    render={() => {
                        return <SignUp />;
                    }}
                />
                <Route
                    path="/"
                    render={() => {
                        return null;
                    }}
                />
            </Switch>
        </Router>
    )
    }
}

export default Routes