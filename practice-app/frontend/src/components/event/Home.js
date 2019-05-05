import React, {Component} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import './styles.css';


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
        const eventList=events.length ? (
            events.map(event=>{
                /*const signifanceLevel1=event.signifanceLevel===1;
                const signifanceLevel2=event.signifanceLevel===2;
                const signifanceLevel3=event.signifanceLevel===3;
                /*{signifanceLevel2? (<img src={TwoStar}/>): (null)}
                            {signifanceLevel3? (<img src={ThreeStar}/>): (null)}
                            <img src={ThreeStar} alt="bg" style={{zIndex:0} }/>
                            */
                           
                return (
                    <div className="event-list" key={event.eventId}>
                        
                        <div className="event-content">
                            
                            {/* <Link to={'/'+event.id}>
                                <span className="event-title red-text" style={{zIndex:0}}>{event.eventName} </span>
                            </Link> */}
                            <div className="country" style={{zIndex:0}}>Country: {event.country} </div>
                            <div className="significance" style={{zIndex:0}}>Significance Level: {event.signifanceLevel}</div>
                            <div className="date" style={{zIndex:0}}>Date: {event.date} </div>
                            <div className="actual" style={{zIndex:0}}>Actual value: {event.actual} </div>
                            <div className="previous"style={{zIndex:0}}>Previous value: {event.previous} </div>
                            <div className="forecast" style={{zIndex:0}}>Forecast: {event.forecast} </div>

                        </div>
                    </div>
                    
                )
            })
        ):(
            <div className="center">No Events yet</div>
        )
        return (
            <div className="container home">
                <h4 className="center" style={{fontSize:'40px'}}>Events</h4>
                {eventList}
            </div>
        )
    }

}
export default Home