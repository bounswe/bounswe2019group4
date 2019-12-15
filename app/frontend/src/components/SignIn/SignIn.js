import React, {Component} from 'react';
import {Modal, Form, Container} from 'semantic-ui-react';
import {connect} from 'react-redux';

import * as userActions from '../../actions/userActions';
import history from "../../_core/history";

import GoogleLogin from "react-google-login";


class SignInModal extends Component {
    constructor(props) {
        super(props);
        this.state= {openModal: false, email: "", password: "", forgetEmail: "", forget: false, forgetSuccessful: false};
    }

    componentWillReceiveProps(props) {

        if(!this.props.openModal) {
            this.resetFields(() => { this.setState({openModal: props.openModal}) });
        } else {
            this.setState({openModal: props.openModal});
        }
    }

    googleSignIn(googleUser) {
        const profile = googleUser.getBasicProfile();
        this.props.signIn({googleId: profile.getId()}).then( result => {
            history.push("/");
        }).catch(result => {
            const googleUserCredentials = {
                googleId: profile.getId(),
                name: profile.getGivenName(),
                surname: profile.getFamilyName(),
                email: profile.getEmail()
            };
            history.push({pathname: "/sign_up_google", state: googleUserCredentials});
        });
        this.resetFields(this.props.handleClose);
    }

    signIn() {
        const {email, password} = this.state;
        this.props.signIn({email, password}).then(result => {
            window.location.reload();
            this.resetFields(this.props.handleClose);
        });
    }

    handleChange(e, { name, value }) {
        this.setState({[name]: value});
    }

    forgetClicked() {
        this.resetFields(() => {this.setState({forget: true})});
    }

    resetFields(callback) {
        this.setState({email: "", password: "", forgetEmail: "", forget: false, forgetSuccessful: false},()=> {callback()});
    }

    forgetPassword() {
        this.props.forgetPassword({email: this.state.forgetEmail}).then(result => {
            this.setState({forgetSuccessful: true});
        })
    }

    renderSignIn() {
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
                        <Form.Group inline>
                            <Form.Button content='Sign In' />
                            <Form.Field style={{float: "right"}}>
                                <a onClick={this.forgetClicked.bind(this)}>Forgot password?</a>
                            </Form.Field>
                        </Form.Group>
                        <GoogleLogin
                            style={{float: "right"}}
                            clientId="826170904423-vk4ihhnoh5ba9n0veus79gupca4nfnq1.apps.googleusercontent.com"
                            onSuccess={this.googleSignIn.bind(this)}
                            onFailure={this.googleSignIn.bind(this)}
                            cookiePolicy={'single_host_origin'}
                        />
                    </Form>

                </Modal.Content>
            </Modal>
        )
    }

    renderForgetPasswordSuccessful() {
        const {forgetEmail} = this.state;
        return (
            <Modal open={this.state.openModal}
                   onClose={this.props.handleClose}
                   size="tiny"
                   centered={false}
            >
                <Modal.Header>
                    Email Sent
                </Modal.Header>
                <Modal.Content>
                    <Container>
                        <p>We sent an email to <b>{forgetEmail}</b> for further steps. Please check your email.</p>
                    </Container>
                </Modal.Content>
            </Modal>
        )
    }

    renderForgetPassword() {
        const {forgetEmail} = this.state;
        return (
            <Modal open={this.state.openModal}
                   onClose={this.props.handleClose}
                   size="tiny"
                   centered={false}
            >
                <Modal.Header>
                    Reset Password
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.forgetPassword.bind(this)}>
                        <Form.Input
                            placeholder='email'
                            name='forgetEmail'
                            value={forgetEmail}
                            onChange={this.handleChange.bind(this)}
                        />
                        <Form.Button content='Reset Password' />
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }

    render() {
        const {forget, forgetSuccessful} = this.state;

        if(forgetSuccessful) {
            return this.renderForgetPasswordSuccessful();
        } else if(forget) {
            return this.renderForgetPassword();
        } else {
            return this.renderSignIn();
        }

    }
}


const dispatchToProps = dispatch => {
    return {
        signIn: params => dispatch(userActions.login(params)),
        forgetPassword: params => dispatch(userActions.forgetPassword(params)),
    };
};

export default connect(null, dispatchToProps)(SignInModal);