import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Segment, Header,Table,Pagination,Grid} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import news from '../../assets/news.png'


import history from '../../_core/history';
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import profilePhoto from "../Profile/h2.jpg";

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
        //alert(this.normalizeDate("2019-10-20T23:50:00.000Z"));
        // alert("here");
    }

    normalizeDate(date){

        var dat = new Date(date);
        var formatOptions = {
            day:    '2-digit',
            month:  '2-digit',
            year:   'numeric',
            hour:   '2-digit',
            minute: '2-digit',
            hour12: true
        };
        var dateString = dat.toLocaleDateString('en-US', formatOptions);



        return dateString;
    }


    getEvents(){

        this.props.events("/"+this.props.match.params.id).then(result=> {
                //alert(Object.keys(result.action.payload));
                this.setState({events:result.value});

            }



        )

    }

    getStars=()=>{


            const imp=this.state.events.Importance;
            var src;
            if (imp == 3) {
                src = ThreeStar;
            } else if (imp == 2) {
                src = TwoStar;
            } else {
                src = OneStar;
            }
            return(

                    <img style={{width: "50px"}} src={src} alt='stars'/>

            )

    }

    render() {
        const {events}  = this.state;



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

                    ):(<h1 style={{color:"white"}}>Loading</h1>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params))
    };
};

export default connect(null, dispatchToProps)(Event_Details);

