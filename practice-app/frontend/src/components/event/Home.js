import React, {Component} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import OneStar from '../../one-star.png'
import TwoStar from '../../two-star.png'
import ThreeStar from '../../three-star.png'
//import './styles.css';


class Home extends Component{ 
    state ={
        events: []
    }
    componentDidMount(){
        
        axios.get('http://api.dev.arkenstone.ml/events/list')
        .then(response => {
            console.log(response, 'eventler geliyor');
            
            this.setState({ events:response.data });
            console.log(this.state.events);
        })
        .catch(err => {
            console.log(err, 'Failure!');
        });
    }  
    render(){
        const {events}=this.state;
        const eventList=events.length ? (
            events.map(event=>{
                const signifanceLevel1=event.signifanceLevel===1;
                const signifanceLevel2=event.signifanceLevel===2;
                const signifanceLevel3=event.signifanceLevel===3;
                /*{signifanceLevel2? (<img src={TwoStar}/>): (null)}
                            {signifanceLevel3? (<img src={ThreeStar}/>): (null)}
                            */
                return (
                    
                    <div className="event-list" key={event.eventId}>
                        <div className="event-content">
                            <Link to={'/'+event.id}>
                            <span className="event-title red-text">{event.eventName}</span>
                            </Link>
                            <div className="country">Country: {event.country}</div>
                            <div className="significance">Significance Level: {event.signifanceLevel}</div>
                            <div className="date">Date: {event.date}</div>
                            <div className="actual">Actual value: {event.actual}</div>
                            <div className="previous">Previous value: {event.previous}</div>
                            <div className="forecast">Forecast: {event.forecast}</div>

                        </div>
                    </div>
                )
            })
        ):(
            <div className="center">No Events yet</div>
        )
        return (
            <div className="container home">
                <h4 className="center">Home</h4>
                {eventList}
            </div>
        )
    }

}
export default Home