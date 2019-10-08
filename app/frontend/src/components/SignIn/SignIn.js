import React, {Component} from 'react';
import {Modal, Form, Button} from 'semantic-ui-react';


class SignInModal extends Component {
    constructor(props) {
        super(props);
        this.state= {openModal: false};
    }

    componentWillReceiveProps(props) {
        this.setState({openModal: props.openModal});
    }

    render() {
        return (
            <Modal open={this.state.openModal}
                   onClose={this.props.handleClose}
                   size="tiny"
                   centered={false}
                   dimmer="blurring"
            >
                <Modal.Header>
                    Sign In
                </Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field>
                            <Form.Field>
                                <label>Username</label>
                                <input placeholder='username' />
                            </Form.Field>
                            <Form.Field>
                                <label>Password</label>
                                <input placeholder='password' type='password' />
                            </Form.Field>
                        </Form.Field>
                        <Button style={{float: "right", margin: "7px"}} type='submit'>Sign In</Button>

                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}

export default SignInModal;