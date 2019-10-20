import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import history from '../../_core/history';
import {connect} from 'react-redux';

import GuestHeaderComponent from './GuestHeaderComponent';
import UserHeaderComponent from './UserHeaderComponent';

import authService from "../../factories/authFactory";

import arkenLogo from "../../assets/arken_logo.png";


class ArkenHeader extends Component {
    constructor(props) {
        super(props);

    }

    navigate(e, { name }) {
      history.push("/" + name);
    }

    renderRightMenu() {
        if(authService.isUserLoggedIn()) {
            return <UserHeaderComponent/>
        } else {
            return <GuestHeaderComponent/>
        }
    }


    render() {
        return (
            <Menu
                size="small"
                inverted
                style={{margin: "0px !important", height: "40px", background: "#396D7C"}}
            >
                <Menu.Header
                    style={{display: "flex", alignItems: "center"}}

                >
                    <Menu.Item
                        name=""
                        onClick={this.navigate}
                    >
                    <img src={arkenLogo} style={{height: "30px", marginLeft: 10}} />
                    </Menu.Item>
                </Menu.Header>
                <Menu.Menu position="center">
                    <Menu.Item
                        name="events"
                        onClick={this.navigate}
                    >
                        Events
                    </Menu.Item>
                    <Menu.Item
                        name="item2"
                        onClick={this.navigate}
                    >
                        Menu Item 2
                    </Menu.Item>
                </Menu.Menu>

                {this.renderRightMenu()}
            </Menu>
        )
    }

}

const stateToProps = state => {
    return {
        user: state.user
    };
};

export default connect(stateToProps, null)(ArkenHeader);