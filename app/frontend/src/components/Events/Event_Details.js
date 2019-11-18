import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Header, Segment,Loader} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import news from '../../assets/news.png'
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";


class Event_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: {}


        }


    }

    componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});



    }
    componentWillMount() {
        this.getEvents();

    }

    normalizeDate(date){


        const dat = new Date(date);
        const formatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return dat.toLocaleDateString('en-US', formatOptions);
    }


    getEvents(){

        this.props.events("/"+this.props.match.params.id).then(result=> {
                //alert(Object.keys(result.action.payload));
                this.setState({events:result.value});

            }



        )

    }

    getStars=()=>{


            const imp=this.state.events.event.Importance;
        let src;
        if (imp === 3) {
                src = ThreeStar;
            } else if (imp === 2) {
                src = TwoStar;
            } else {
                src = OneStar;
            }
            return(

                    <img style={{width: "50px"}} src={src} alt='stars'/>

            )

    };

    render() {
        const events  = this.state.events.event;



        return (

            events?(


                <div style={{display:"flex",justifyContent:"center"}}>
                <Segment raised piled padded compact textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                    {<Image size="medium" src={news} />}
                    <Header textAlign='center'>

                        {events.Event}
                    </Header>
                    <ul>
                        <li><strong>Date:</strong>{this.normalizeDate(events.Date)}</li>
                        <li><strong>Country:</strong>{events.Country}</li>

                        <li><strong>Importance:</strong>{this.getStars()}</li>

                    </ul>


                    <Segment  textAlign="center">
                        <h4>Values</h4>
                    <table  className="ui inverted table">
                        <thead>
                        <tr>
                            <th>Actual</th>
                            <th>Previous</th>
                            <th>Forecast</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{events.Actual}</td>
                                <td>{events.Previous}</td>
                                <td>{events.Forecast}</td>
                            </tr>
                        </tbody>

                    </table>
                    </Segment>

                </Segment>
                </div>

                    ):(<div className="ui active text loader" style={{color:"gray",backgroundColor:"white"}}>Loading</div>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params))
    };
};

export default connect(null, dispatchToProps)(Event_Details);

