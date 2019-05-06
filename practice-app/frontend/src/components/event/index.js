import React, {Component} from 'react'
import axios from 'axios'
//import { Link } from 'react-router-dom'
import './styles.css';
import {List} from "semantic-ui-react"
import OneStar from '../../onestar.png'
import TwoStar from '../../twostar.png'
import ThreeStar from '../../threestar.png'

class Home extends Component{ 
    state ={
        events: []
    }
    componentDidMount(){
        
        axios.get('http://api.dev.arkenstone.ml/events/list')
        .then(response => {
            
            this.setState({ events:response.data });
            console.log(this.state.events);
        })
        .catch(err => {
            console.log(err, 'Failure!');
        });
    }  
    render(){
        const {events}=this.state;
        const length=events.length===0;
        return (
            <List>
            <div className="name">
            <h1> Events</h1>
            </div>
            {length ? (
                <h1 className="noev"> No events yet!</h1>


            ):""}
            
        {events.map(function(event, index){
            const sign1=event.signifanceLevel===1;
            const sign2=event.signifanceLevel===2;
            const sign3=event.signifanceLevel===3;
            const forecastNotEx=event.forecast==="";
            return (
            <List.Item key={event.date + event.country + event.eventName}>
                {sign1? (
                    <img src={OneStar} alt='oneStar'/>
                ):(<br></br>)}
                {sign2? (
                    <img src={TwoStar} alt='twoStar'/>
                ):(<br></br>)} 
                {sign3? (
                    <img src={ThreeStar} alt='threeStar'/>
                ):(<br></br>)}     
            
               
                <List.Content>
                    <List.Header as={"a"}>
                    <Link to={'/'+event.eventName+"+"+event.country+"+"+event.date }>
                        <span className="eventName">{event.eventName}</span>
                    </Link> 
                    </List.Header>
                    <List.Description>

                        <div className="country">Country: {event.country}</div>
                        <div className="significance">Significance Level: {event.signifanceLevel}</div>
                        <div className="date">Date: {event.date}</div>
                        <div className="actual">Actual value: {event.actual}</div>
                        <div className="previous">Previous value: {event.previous}</div>
                        {forecastNotEx ? (
                            <br></br>
                        ):(
                            <div className="forecast">Forecast: {event.forecast}</div>
                        )}
                       
                    </List.Description>
                </List.Content>
            </List.Item>)
            })}
        </List>
        )
    }

}
export default Home
