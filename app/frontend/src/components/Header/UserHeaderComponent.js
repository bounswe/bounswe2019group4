import React, {Component} from "react";
import {Menu} from "semantic-ui-react";

class UserHeaderComponent extends Component {

    render() {
        return (
            <Menu.Menu position="right">
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="profile"
                    onClick={this.navigate}
                >
                    <i className="fas fa-user-circle fa-2x" style={{ margin: 10}} />
                </Menu.Item>
                <Menu.Item
                    style={{display: "flex", alignItems: "center"}}
                    name="settings"
                    onClick={this.navigate}
                >
                    <i className="fas fa-cog" style={{ margin: 10}} />
                </Menu.Item>
            </Menu.Menu>
        )
    }
}