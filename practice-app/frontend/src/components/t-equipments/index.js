import React, { Component } from 'react';
import axios from 'axios';
import "./styles.css";

class TradingEq extends Component {


  constructor(props){
    super(props);

    this.state = {
      data: []
    };
  }

  componentDidMount(){
    axios.get('http://api.dev.arkenstone.ml/t-equipments')
    .then(response => {
      console.log(response);
      this.setState({
          data: response.data,
        }
      );
    })
    .catch(err => {
      console.log(err);
    })
  }

  render(){
    const {data} = this.state;
    return(
      <div>
      <div className='title'>Exchange Rates</div>
        {
          Object.keys(data).map(key=>{
            var value = data[key];
            return(
                <div className='row'>
                  <span className= 'keys'>{key} </span> 
                  <span className= 'texts'> ratio is </span>
                  <span className= 'values'>{value}</span>
                  
                </div>
              )
            })
        }
      </div>
    )
  }
}

export default TradingEq