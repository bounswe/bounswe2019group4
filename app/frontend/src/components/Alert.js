import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Icon, Modal } from "semantic-ui-react";

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
            <Modal size="tiny" open={showAlert} onClose={this.close.bind(this)}>
                <Modal.Header>{title === "Error" ? <FormattedMessage id="ERROR" /> : title}</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        {actionFunc && (
                            <Icon style={{ color: colors.MH_GREEN }} size="huge" name="check circle outline" />
                        )}
                        {body}
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={this.close.bind(this)}>
                        <FormattedMessage id="CLOSE" />
                    </Button>
                    )}
                </Modal.Actions>
            </Modal>
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
