import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Icon, Message } from "semantic-ui-react";

import * as alertActions from "../actions/alertActions";

class Alert extends Component {
    close() {
        this.props.close();
    }

    render() {
        const {
            showAlert,
            body,
            actionFunc,
            actionFunc2,
            actionTitle,
            actionTitle2,
            title = "Error"
        } = this.props;

        return (
            <Message
                style={{ position: "fixed", right: 15, top: 15, zIndex: 1001 }}
                onDismiss={this.close.bind(this)}
                header={title}
                content={body}
                floating
                negative
                visible={showAlert}
                hidden={!showAlert}
            />
        );

    }
}

const stateToProps = state => {
    return {
        showAlert: state.alert.showAlert,
        body: state.alert.body,
        title: state.alert.title,
        actionFunc: state.alert.actionFunc,
        actionTitle: state.alert.actionTitle,
        actionFunc2: state.alert.actionFunc2,
        actionTitle2: state.alert.actionTitle2
    };
};

const dispatchToProps = dispatch => {
    return {
        close: () => dispatch(alertActions.closeAlert())
    };
};

export default connect(
    stateToProps,
    dispatchToProps
)(Alert);
