import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";

export default class Signup extends Component {

  constructor(props){
    super(props);

    this.state = {
      disabled: false,
      name: '',
      surname: '',
      email: '',
      password: '',
      location: '',
    };
  }

  updateName(value) {
    this.setState({
      name: value,
    });
  }

  updateSurname(value) {
    this.setState({
      surname: value,
    });
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

  updateLocation(value) {
    this.setState({
      location: value,
    });
  }

  async submit(event) {
    event.preventDefault()
    this.setState({
      disabled: true,
    });

    await axios.post('http://api.dev.arkenstone.ml/auth/signup', {
      name: this.state.name,
      surname: this.state.surname,
      email: this.state.email,
      password: this.state.password,
      location: this.state.location,
    })
      .then(response => {
        console.log(response, 'Signed up!');
      })
      .catch(err => {
        console.log(err, 'Failure!');
      });

    this.setState({
      disabled: false,
    });
  }

    render() {
      return (
        <form onSubmit={this.submit}>
          <div>
            <label>Name</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              placeholder='Name'
              onChange={(event) => {this.updateName(event.target.value)}}
              value={this.state.name}
            />
          </div>

          <div>
            <label>Surname</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              placeholder='Surname'
              onChange={(event) => {this.updateSurname(event.target.value)}}
              value={this.state.surname}
            />
          </div>

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

          <div>
            <label>Location</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              placeholder='Location'
              onChange={(event) => {this.updateLocation(event.target.value)}}
              value={this.state.location}
            />
          </div>

          <button
            disabled= {this.state.disabled}
            onClick={this.submit.bind(this)}>
            Signup
          </button>
        </form>
      )
  }
}
