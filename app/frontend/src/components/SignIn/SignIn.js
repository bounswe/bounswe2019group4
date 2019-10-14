import React, {Component} from 'react';
import {Modal, Form, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';

import * as userActions from '../../actions/userActions';
import history from "../../_core/history";


class SignInModal extends Component {
    constructor(props) {
        super(props);
        this.state= {openModal: false, email: "", password: ""};
    }

    componentWillReceiveProps(props) {
        this.setState({openModal: props.openModal});
    }

    signIn() {
        const {email, password} = this.state;
        this.props.signIn({email, password}).then(result => {
            history.push("/");
            this.props.handleClose();
        });
    }

    handleChange(e, { name, value }) {
        this.setState({[name]: value});
    }

    render() {
        const {email, password} = this.state;
        return (
            <Modal open={this.state.openModal}
                   onClose={this.props.handleClose}
                   size="tiny"
                   centered={false}
            >
                <Modal.Header>
                    Sign In
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.signIn.bind(this)}>
                        <Form.Input
                            placeholder='email'
                            name='email'
                            value={email}
                            onChange={this.handleChange.bind(this)}
                        />
                        <Form.Input
                            placeholder='password'
                            name='password'
                            type='password'
                            value={password}
                            onChange={this.handleChange.bind(this)}
                        />
                        <Form.Button content='Sign In' />

                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


const dispatchToProps = dispatch => {
    return {
        signIn: params => dispatch(userActions.login(params)),
    };
};

export default connect(null, dispatchToProps)(SignInModal);