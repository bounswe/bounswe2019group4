import React, {Component} from "react";
import {Menu, Dropdown} from "semantic-ui-react";
import * as userActions from "../../actions/userActions";
import connect from "react-redux/es/connect/connect";
import history from "../../_core/history";

class UserHeaderComponent extends Component {

    navigate(e, {name}) {
        history.push("/" + name);
    }

    logout() {
        this.props.logout().then(result => {
            history.push("/");
        })
    }

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
                    <Dropdown trigger={<i className="fas fa-cog" style={{ margin: 10}} />} icon={null}>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={this.logout.bind(this)}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Menu.Item>
            </Menu.Menu>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        logout: () => dispatch(userActions.logout())
    };
};

export default connect(
    null,
    dispatchToProps
)(UserHeaderComponent);
