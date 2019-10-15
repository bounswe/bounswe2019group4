import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import EmptyPage from "../EmptyPage";
import history from "../_core/history";

import SignUp from "../components/SignUp/SignUp";
import SignUpComplete from "../components/SignUp/SignUpComplete";
import VerifyEmail from "../components/SignUp/VerifyEmail";
import ResetPassword from "../components/SignIn/ResetPassword";


class Routes extends Component {
    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route path="/reset-password/:token" render={(props) => {return <ResetPassword {...props} />; }} />
                    <Route path="/verify/:token" render={(props) => {return <VerifyEmail {...props} />; }} />
                    <Route path="/sign_up_complete" render={() => { return <SignUpComplete />; }} />
                    <Route path="/sign_up" render={() => { return <SignUp />; }} />
                    <Route path="/" render={() => { return <EmptyPage />; }} />
                </Switch>
            </Router>
        )
    }
}

export default Routes