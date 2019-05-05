import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";
import {Form, Button} from "semantic-ui-react";
import styled from "styled-components"
import history from "../core/history"

const LoginForm = styled(Form)`
  display: flex !important;
  flex-shrink: 1;
  justify-content: flex-start;
  align-content: flex-start;
  height: 64px !important;
  font-size: 16px !important;
  line-height: 64px !important;
  background-color: transparent !important;
  float: right;
  border-bottom: 0px !important;
`

const LoginInput = styled(Form.Input)`
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  font-size: 16px !important;
  font-weight: bold !important;
  height: 32px !important;
  color: rgb(12,74,14) !important;
  flex-shrink: 1;
  font-family: "Times New Roman", Times, serif;
`

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            disabled: false,
            email: '',
            password: '',
        };
        this.submit = this.submit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        console.log(event.target)
        const stateObj = this.state
        stateObj[event.target.name] = event.target.value
        this.setState(stateObj);
    }

    updateEmail(value) {
        this.setState({
            email: value,
        });
    }

    updatePassword(value) {
        this.setState({
            password: value,
        });
    }

    async submit(event) {
        event.preventDefault()

        this.setState({
            disabled: true,
        });

        await axios.post('http://api.dev.arkenstone.ml/auth/login', {
            email: this.state.email,
            password: this.state.password,
        })
            .then(response => {
                console.log(response, 'Logged in!');
            })
            .catch(err => {
                console.log(err, 'Failure!');
            });

        this.setState({
            disabled: false,
        });
    }

    signUpClick() {
       history.push("/signup")
    }

    render() {
        return (
            <LoginForm onSubmit={this.submit}>
                <div style={{display: "flex", flexDirection: "column-flow", justifyContent: "flex-start", padding: 5}}>
                    <LoginInput
                        disabled={this.state.disabled}
                        name="email"
                        type="email"
                        placeholder= "Email"
                        onChange={this.handleChange }
                        value={this.state.email}
                    />

                    <LoginInput
                        disabled={this.state.disabled}
                        name="password"
                        type='password'
                        placeholder='Password'
                        onChange={(event) => { this.updatePassword(event.target.value) }}
                        value={this.state.password}
                    />
                </div>
                <div style={{display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: 5}}>
                    <Button
                        basic
                        disabled={this.state.disabled}
                        onClick={this.submit.bind(this)}
                        content='Login'
                        style={{padding:1, circular:true}}>

                    </Button>
                <Button
                    basic
                    content='Sign Up'
                    style={{padding:1, circular:true}}
                    onClick={this.signUpClick.bind(this)}>

                </Button>
                </div>
            </LoginForm>
        )
    }
}

export default Login
