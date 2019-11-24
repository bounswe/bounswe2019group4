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
import news from '../../assets/news.png'
import * as userActions from '../../actions/userActions';
import userFactory from "../../factories/userFactory";
import {normalizeDate} from "./Events";
import Loading from "../Loading";
import Comments from "../Comments"
import {Link} from "react-router-dom";
import axios from "axios"
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



    async getEvents(){

        await this.props.events("/"+this.props.match.params.id).then(async result=> {
                //alert(Object.keys(result.action.payload));
                let newevents=result.value;
                 await this.setState({events:newevents})

            }
        )

    }



    onSubmit=async ()=>{

        if(this.state.text!=="") {
                    let newlist = this.state.events.comments;


            let calendarID=this.props.match.params.id;

            let com = {
                text: this.state.text,
                related:calendarID,
                about:"EVENT"
                };
            let user=this.state.user;
            await this.props.postComment(com).then(async result=>{

                await this.getEvents();
                this.setState({text: "",rest:1000})
            });



        }
    };
    render() {
        const event  = this.state.events.event;
        const comments=this.state.events.comments;
        return (

            event?(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <Segment raised padded compact  style={{display:"flex",width:"70%"}}>
                        <Grid columns={2} relaxed={"very"}>
                            <Grid.Column>
                <Segment  textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                    {<Image size="medium" src={news} />}
                    <Header textAlign='center'>

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
                                        < Rating defaultRating={event.Importance} maxRating={3} disabled />

                                        </List.Content>
                                    </List.Item>
                                }
                        />


                    </List>


                    <Segment style={{borderWidth:2}} textAlign="center">
                        <h4>Values</h4>
                    <Table fixed  className="ui table">
                        <thead>
                        <tr>
                            <th>Actual</th>
                            <th>Previous</th>
                            <th>Forecast</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
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
                  <Segment loading={this.state.loading} style={{borderRadius:10,borderWidth:2,backgroundColor:"#f5f5f5"}}>

                        <Header as='h4' inverted block style={{borderRadius:10}} textAlign={"left"}>
                            Comments
                        </Header>

                        <Comments  data={comments}/>

                    <Segment >

                        {this.state.user.loggedIn?
                            (<Form >
                        <Form.TextArea maxLength={1000} style={{borderWidth:1,borderColor:"gray"}} value={this.state.text}  onChange={(item)=>this.setState({rest:1000-item.target.value.length,text:item.target.value})}/>

                        <div style={{display:"flex",flex:1}}>
                            <div style={{display:"flex",flexDirection:"row",flex:3}}/>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",flex:3}}>
                                <Button onClick={this.onSubmit} content='Send Comment' labelPosition='left' icon='edit' basic color={"black"} />
                            </div>
                            <div style={{fontSize:14,display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",flex:3}}>
                                    {this.state.rest}
                            </div>
                        </div>
                    </Form>)
                            :
                            <h3>Sign in to make comments!</h3>}
                    </Segment>
                </Segment>
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
