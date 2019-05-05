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

  updateFirst(value) {
    this.setState({
      first_cur: value,
    });
  }

  updateSecond(value) {
    this.setState({
      second_cur: value,
    });
  }

  async submit(event) {
    event.preventDefault()
    this.setState({
      disabled: true,
    });

    const {first_cur} =  this.state;
    const {second_cur} = this.state;

    await axios.get('http://api.dev.arkenstone.ml/t-equipments/'+first_cur+'-'+second_cur)
      .then(response => {
        console.log(response);
        this.setState({
          rate: response.data.rate,
          value: response.data.value,
        })
      })
      .catch(err => {
        this.setState({
          rate: 'Error',
          value: '',
        })
      });

    this.setState({
      disabled: false,
    });
  }

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
