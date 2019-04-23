import React, { Component } from 'react';
import "./styles.css";

export default class Login extends Component {

  constructor(props){
    super(props);

    this.state = {
      disabled: false,
      email: '',
      password: '',
    };
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

  async submit() {
    this.setState({
      disabled: true,
    })
  }

    render() {
      return (
        <form>
          <div>
            <label>Email</label>
            <input
              disabled= {this.state.disabled}
              type='email'
              placeholder='Email'
              onChange={(event) => {this.updateEmail(event.target.value)}}
              value={this.state.email}
            />
          </div>

          <div>
            <label>Password</label>
            <input
              disabled= {this.state.disabled}
              type='password'
              placeholder='Password'
              onChange={(event) => {this.updatePassword(event.target.value)}}
              value={this.state.password}
            />
          </div>
          <button
            disabled= {this.state.disabled}
            onClick={() => {this.submit()}}>
            Login
          </button>
        </form>
      )
  }
}
