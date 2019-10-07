import React, {Component} from 'react';
import {Menu} from 'semantic-ui-react';
import history from '../../_core/history';

import GuestHeaderComponent from './GuestHeaderComponent';


class ArkenHeader extends Component {
    constructor(props) {
        super(props);

    }

    navigate(e, { name }) {
      history.push(name);
    }


    render() {
        return (
            <Menu
                size="small"
                color="brown"
                inverted
                style={{margin: "0px !important", height: "40px"}}
            >
                <Menu.Header
                    style={{display: "flex", alignItems: "center"}}

                >
                    <Menu.Item
                        name="/"
                        onClick={this.navigate}
                    >
                    <img src="../../assets/arken_logo.png" style={{height: "30px", marginLeft: 10}} />
                    </Menu.Item>
                </Menu.Header>
                <Menu.Menu position="center">
                    <Menu.Item
                        name="item1"
                        onClick={this.navigate}
                    >
                        Menu Item 1
                    </Menu.Item>
                    <Menu.Item
                        name="item2"
                        onClick={this.navigate}
                    >
                        Menu Item 2
                    </Menu.Item>
                </Menu.Menu>

                <GuestHeaderComponent/>
            </Menu>
        )
    }

}

export default ArkenHeader;