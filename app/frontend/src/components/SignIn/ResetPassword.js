import React, {Component} from 'react';
import {Segment, Form, Container, Header} from 'semantic-ui-react';
import {connect} from 'react-redux';

import * as userActions from '../../actions/userActions';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = { password: "", confirmedPassword: "", passwordReset: false};
    }

    handleChange(e, { name, value }) {
        this.setState({[name]: value});
    }

    resetPassword() {
        this.props.resetPassword({token: this.props.match.params.token, password: this.state.password}).then(result => {
            this.setState({passwordReset: true});
        })
    }

    renderForm() {
        const {password, confirmedPassword} = this.state;

        return (
            <Segment raised>
                <Form onSubmit={this.resetPassword.bind(this)}>
                    <Form.Field>
                        <label>Password:</label>
                        <Form.Input
                            placeholder='password'
                            name='password'
                            value={password}
                            type="password"
                            onChange={this.handleChange.bind(this)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Confirm Password:</label>
                        <Form.Input
                            placeholder='confirm password'
                            name='confirmedPassword'
                            value={confirmedPassword}
                            type="password"
                            onChange={this.handleChange.bind(this)}
                            error={password && password !== confirmedPassword ? {content: "Password must match!", pointing: "above"} : undefined}
                        />
                    </Form.Field>
                    <Form.Button content="ResetPassword" disabled={!password || password !== confirmedPassword} />
                </Form>
            </Segment>
        )
    }

    renderSuccess() {
        return (
            <Segment raised>
                <Container>
                    <Header>Password Reset Successful!</Header>
                    <p>You can log in and use all the privilages of Arkenstone anytime :)</p>
                </Container>
            </Segment>
        )
    }

    render() {
        const {passwordReset} = this.state;

        if(passwordReset) {
            return this.renderSuccess();
        } else {
            return this.renderForm();
        }
    }
}

const dispatchToProps = dispatch => {
    return {
        resetPassword: params => dispatch(userActions.resetPassword(params))
    }
}

export default connect(null, dispatchToProps)(ResetPassword);