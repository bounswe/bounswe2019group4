import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import EmptyPage from "../EmptyPage";
import history from "../_core/history";

import SignUp from "../components/SignUp/SignUp";


class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/sign_up" render={() => { return <SignUp />; }} />
                    <Route path="/" render={() => { return <EmptyPage />; }} />
                </Switch>
            </Router>
        )
    }
}

export default Routes