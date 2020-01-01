import React, {Component} from 'react';
import {Menu, Form, Icon} from 'semantic-ui-react';
import history from '../../_core/history';

import SignInModal from '../SignIn/SignIn';
import SearchBar from "../Search/Search";

class GuestHeaderComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {openSignInModal: false};
    }

    navigate(e, {name}) {
        history.push("/" + name);
    }

    openSignInModal() {
        this.setState({openSignInModal: true});
    }

    closeSignInModal() {
        this.setState({openSignInModal: false});
    }

    render() {
        return (
            <Menu.Menu position="right">
                <SignInModal openModal={this.state.openSignInModal} handleClose={this.closeSignInModal.bind(this)} />
                <Menu.Item position="right">
                    <SearchBar/>
                </Menu.Item>
                <Menu.Item
                    name="sign_in"
                    onClick={this.openSignInModal.bind(this)}
                >
                    Sign In
                </Menu.Item>
                <Menu.Item
                    name="sign_up"
                    onClick={this.navigate}
                >
                    Sign Up
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="settings"

                >
                    <a style={{color:"white"}} href={"https://github.com/bounswe/bounswe2019group4"}>
                        <Icon name={"github"}/>
                    </a>

                </Menu.Item>
            </Menu.Menu>
        )
    }

}

export default GuestHeaderComponent;