import React, { Component } from 'react'
import axios from 'axios'

class Post extends Component {
  state = {
    post: null
  }
  componentDidMount(){
    let getId = this.props.match.params.post_id;
    
    let id=getId.split("+");
    var name=id[0];
    var country=id[1];
    var date=id[2];
    

    axios.get('http://api.dev.arkenstone.ml/events/list' )
      .then(res => {

        
        let a=res.data.find((arg) =>{
           
            return arg.eventName===name&&arg.country===country&&arg.date===date;
        });
       
        this.setState({
          post: a
        });
       
        //console.log(res.data);
      });
  }
  render() {

    const post = this.state.post ? (
      <div className="post">
        <h1 className="center">{this.state.post.eventName}</h1>
        <br></br>
        <p>Event content will be shown here soon...</p>
        <br></br>

        <div className='row'>
                  <span className= 'keys'>Date:  </span> 
                  <span className= 'values'>{this.state.post.date}</span> 
        </div>
        <div className='row'>
                  <span className= 'keys'>Country:  </span> 
                  <span className= 'values'>{this.state.post.country}</span> 
        </div>
        <div className='row'>
                  <span className= 'keys'>Significance Level:  </span> 
                  <span className= 'values'> {this.state.post.signifanceLevel}</span> 
        </div>
        <div className='row'>
                  <span className= 'keys'>Actual Value:  </span> 
                  <span className= 'values'>{this.state.post.actual}</span> 
        </div>
        <div className='row'>
                  <span className= 'keys'>Previous Value:  </span> 
                  <span className= 'values'>{this.state.post.previous}</span> 
        </div>

        <br></br>
        
      </div>
    ) : (
      <div className="center">Loading event...</div>
    );

    return (
      <div className="container">
        {post}
      </div>
    )
  }
}

export default Post