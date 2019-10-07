import React, {Component} from 'react';
import {Menu, Form} from 'semantic-ui-react';
import history from '../../_core/history'

class GuestHeaderComponent extends Component {
    constructor(props) {
        super(props);
    }

    navigate(e, {name}) {
        history.push(name);
    }

    render() {
        return (
            <Menu.Menu position="right">
                <Menu.Item
                    name="sign_in"
                    onClick={this.navigate}
                >
                    Sign In
                </Menu.Item>
                <Menu.Item
                    name="sign_up"
                    onClick={this.navigate}
                >
                    Sign Up
                </Menu.Item>
            </Menu.Menu>
        )
    }

}

export default GuestHeaderComponent;