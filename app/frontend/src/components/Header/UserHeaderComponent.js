import React, {Component} from "react";
import {Menu, Dropdown} from "semantic-ui-react";
import * as userActions from "../../actions/userActions";
import connect from "react-redux/es/connect/connect";
import history from "../../_core/history";
import SearchBar from "../Search/Search";
import {loadState} from "../../_core/localStorage";

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
        const user = loadState().user;
        return (
            <Menu.Menu position="right">
                <Menu.Item position="right">
                    <SearchBar/>
                </Menu.Item>
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
                   // onClick={this.navigate}
                >
                    <Dropdown trigger={<i className="fas fa-cog" style={{ margin: 10}} />} icon={null}>
                        <Dropdown.Menu>
                            {user && user.isTrader && <Dropdown.Item icon="briefcase" name="investments" onClick={this.navigate} text="My Investments"/> }
                            <Dropdown.Item icon="sign-out" onClick={this.logout.bind(this)} text="Logout" />

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
