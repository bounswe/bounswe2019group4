import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";
import EmptyPage from "../EmptyPage";
import history from "../_core/history";

import SignUp from "../components/SignUp/SignUp";
import SignUpGoogle from "../components/SignUp/SignUpGoogle";
import SignUpComplete from "../components/SignUp/SignUpComplete";
import VerifyEmail from "../components/SignUp/VerifyEmail";
import ResetPassword from "../components/SignIn/ResetPassword";
import Profile from "./Profile/Profile";

import authService from "../factories/authFactory";


class Routes extends Component {

    checkAuthorization () {
        if (!authService.isUserLoggedIn()) {
            history.push("/");
            return false;
        }
        return true;
    }

    render() {
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path="/reset-password/:token" render={(props) => {return <ResetPassword {...props} />; }} />
                    <Route path="/verify/:token" render={(props) => {return <VerifyEmail {...props} />; }} />
                    <Route path="/sign_up_complete" render={() => { return <SignUpComplete />; }} />
                    <Route path="/sign_up_google" render={(props) => { return <SignUpGoogle {...props} />; }} />
                    <Route path="/sign_up" render={() => { return <SignUp />; }} />
                    <Route path="/profile" render={
                        () => {
                            if(this.checkAuthorization()) {
                                return <Profile />;
                            } else {
                                return null;
                            }
                        }
                    } />
                    <Route path="/" render={() => { return <EmptyPage />; }} />
                </Switch>
            </Router>
        )
    }
}

export default Routes