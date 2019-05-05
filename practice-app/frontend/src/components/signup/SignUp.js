import React, { Component } from 'react';
import axios from 'axios';
import {Grid, GridColumn, GridRow} from 'semantic-ui-react'
import "./styles.css";

export default class SignUp extends Component {

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
        <form class="ui form" onSubmit={this.submit} font-family="">
           <Grid id="layout-grid">
               <GridRow>
                  <GridColumn width={8}>
                      <label>Name</label>
                  </GridColumn>
                  <Grid.Column>
                      <input
                          disabled={this.state.disabled}
                          type='text'
                          placeholder='Name'
                          onChange={(event) => {
                            this.updateName(event.target.value)
                          }}
                          value={this.state.name}
                      />
                  </Grid.Column>
               </GridRow>
               <GridRow>
                 <GridColumn>
                   <label>Surname</label>
                 </GridColumn>
                 <GridColumn>
                   <input
                       disabled={this.state.disabled}
                       type='text'
                       placeholder='Surname'
                       onChange={(event) => {
                         this.updateSurname(event.target.value)
                       }}
                       value={this.state.surname}
                   />
                 </GridColumn>
               </GridRow>
             <GridRow>
               <GridColumn>
                 <label>Email</label>
               </GridColumn>
               <GridColumn>
                 <input
                     disabled={this.state.disabled}
                     type='email'
                     placeholder='Email'
                     onChange={(event) => {
                       this.updateEmail(event.target.value)
                     }}
                     value={this.state.email}
                 />
               </GridColumn>
             </GridRow>
             <GridRow>
               <GridRow>
                 <GridColumn>
                   <label>Password</label>
                 </GridColumn>
                 <GridColumn>
                   <input
                       disabled={this.state.disabled}
                       type='password'
                       placeholder='Password'
                       onChange={(event) => {
                         this.updateEmail(event.target.value)
                       }}
                       value={this.state.email}
                   />
                 </GridColumn>
               </GridRow>
             </GridRow>
             <GridRow>
               <GridColumn>
                 <label>Location</label>
               </GridColumn>
               <GridColumn>
                 <input
                     disabled={this.state.disabled}
                     type='text'
                     placeholder='Location'
                     onChange={(event) => {
                       this.updateEmail(event.target.value)
                     }}
                     value={this.state.email}
                 />
               </GridColumn>
             </GridRow>
             <GridRow>
               <button
                   disabled={this.state.disabled}
                   onClick={this.submit.bind(this)}>
                 Sign Up
               </button>
             </GridRow>
           </Grid>
        </form>
      )
  }
}
