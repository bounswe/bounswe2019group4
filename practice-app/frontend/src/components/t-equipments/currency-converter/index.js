import React, { Component } from 'react';
import axios from 'axios';

export default class CurrencyConverter extends Component {

  constructor(props){
    super(props);

    this.state = {
      disabled: false,
      first_cur: '',
      second_cur: '',
      rate: '',
      value: '',
    };
  }

  // Updates first currency name
  updateFirst(value) {
    this.setState({
      first_cur: value,
    });
  }


  // Updates second currency name
  updateSecond(value) {
    this.setState({
      second_cur: value,
    });
  }

  // Request to our api for get the value of fiven currencies.
  async submit(event) {
    event.preventDefault()
    this.setState({
      disabled: true,
    });

    const {first_cur} =  this.state;
    const {second_cur} = this.state;

    // Requests
    await axios.get('http://api.dev.arkenstone.ml/t-equipments/'+first_cur+'-'+second_cur)
      .then(response => {
        console.log(response);
        this.setState({
          rate: response.data.rate,
          value: response.data.value,
        })
      })
      .catch(err => {
        alert('Try again with currencies in use.')
        console.log(err)
        this.setState({
          rate: 'Error',
          value: '',
        })
      });

    this.setState({
      disabled: false,
    });
  }

  // Form which has input for first currency and second currency, submit button and fields for rate and value.
    render() {
      return (
        <form onSubmit={this.submit}>
          <div>
            <label>First Currency</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              placeholder='First Currency'
              onChange={(event) => {this.updateFirst(event.target.value)}}
              value={this.state.first_cur}
            />
          </div>

          <div>
            <label>Second Currency</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              placeholder='Second Currency'
              onChange={(event) => {this.updateSecond(event.target.value)}}
              value={this.state.second_cur}
            />
          </div>

          <button
            disabled= {this.state.disabled}
            onClick={this.submit.bind(this)}>
            Convert
          </button>

          <div>
            <label>Rate</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              readOnly
              value={this.state.rate}
            />
          </div>  

          <div>
            <label>Value</label>
            <input
              disabled= {this.state.disabled}
              type='text'
              readOnly
              value={this.state.value}
            />
          </div>          
        </form>
      )
  }
}
