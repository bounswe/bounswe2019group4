import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import history from '../../_core/history';
import {connect} from 'react-redux';

import GuestHeaderComponent from './GuestHeaderComponent';
import UserHeaderComponent from './UserHeaderComponent';
import {colorBG} from "../../utils/constants/Colors";
import authService from "../../factories/authFactory";

import arkenLogo from "../../assets/arken_logo.png";
import SearchBar from "../Search/Search";


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
                size="huge"

                style={{margin: "0px !important", height: "70px", background: "#101617"}}
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
                        name="trading-equipment"
                        onClick={this.navigate}
                    >
                        Trading Equipment
                    </Menu.Item>
                </Menu.Menu>
                <Menu.Menu position="right">
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