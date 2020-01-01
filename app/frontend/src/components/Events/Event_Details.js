import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {
    Header,
    Segment,
    Table,
    Comment,
    Form,
    Button,
    Card,
    Divider,
    Grid,
    Rating,
    List,
    Popup,
    Image,
    Icon
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import news from '../../assets/event_bg.jpg'
import * as userActions from '../../actions/userActions';
import userFactory from "../../factories/userFactory";
import {normalizeDate} from "./Events";
import Loading from "../Loading";
import Comments from "../Comments"
import {Link} from "react-router-dom";
import axios from "axios"
import {colorBG, colorDarkerBlue, colorLightBG, colorLightgrey, colorPrimary} from "../../utils/constants/Colors";
class Event_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: {},
            loading:false,
            rest:1000,
            text:""
        }
    }

    async componentDidMount() {


        const localState = loadState();
        this.setState({user: localState.user});
        await this.getEvents();

    }

    componentDidUpdate(props) {
        if(props.match.params.id !== this.props.match.params.id) {
            this.getEvents();
        }
    }



     getEvents=async()=>{


        await this.props.events("/"+this.props.match.params.id).then(async result=> {
                //alert(Object.keys(result.action.payload));
                let newevents=result.value;
                 await this.setState({events:newevents})

            }
        )

    };




    render() {
        const event  = this.state.events.event;
        const comments=this.state.events.comments;
        return (

            event?(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <Segment  raised padded compact  style={{display:"flex",width:"70%",backgroundColor:colorBG,borderWidth:2,borderColor:colorDarkerBlue,borderRadius:20}}>
                        <Grid columns={2} relaxed={"very"}>
                            <Grid.Column>
                <Segment  textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:colorBG,color:"white"}}>
                    {<Image size="medium" src={news} />}
                    <Header style={{color:"white"}} textAlign='center'>

                        {event.Event}
                    </Header>
                    <List>
                        <List.Item>
                            <List.Icon name={"calendar alternate"}/>
                            <List.Content>
                            {normalizeDate(event.Date)}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name={"world"}/>
                            <List.Content>
                            {event.Country}
                            </List.Content>
                        </List.Item>

                            <Popup
                                content={"Importance"}
                                trigger={
                                    <List.Item>
                                        <List.Icon name={"attention"}/>
                                        < List.Content >
                                        < Rating defaultRating={event.Importance} maxRating={3} icon={"star"} disabled />

                                        </List.Content>
                                    </List.Item>
                                }
                        />


                    </List>


                    <Segment style={{borderWidth:2,backgroundColor:colorBG,color:"white",borderColor:colorDarkerBlue,borderRadius:20}} textAlign="center">
                        <h4>Values</h4>
                    <Table fixed className="ui table" style={{backgroundColor:colorLightBG}}>
                        <thead style={{backgroundColor:colorLightBG}}>
                        <tr style={{backgroundColor:colorLightBG}}>
                            <th>Actual</th>
                            <th>Previous</th>
                            <th>Forecast</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr style={{color:"white"}}>
                                <td>{event.Actual}</td>
                                <td>{event.Previous}</td>
                                <td>{event.Forecast}</td>
                            </tr>
                        </tbody>

                    </Table>
                    </Segment>

                </Segment>
                            </Grid.Column>
                            <Grid.Column>


                                <Comments type={"event"} _id={this.props.match.params.id} resendComments={this.getEvents}  data={comments}/>

                             </Grid.Column>
                        </Grid>
                        <Divider vertical/>
                </Segment>

                </div>

                    ):(<Loading/>)



        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params)),
        userInformation:params=>dispatch(userActions.users(params)),
        postComment:params=>dispatch(userActions.postComment(params))

    };
};

export default connect(null, dispatchToProps)(Event_Details);
