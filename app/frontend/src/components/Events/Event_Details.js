import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Header, Segment,Table,Comment,Form,Button,Card,Divider,Grid,Rating,List,Popup} from 'semantic-ui-react';
import {connect} from 'react-redux';
import OneStar from '../../assets/onestar.png'
import TwoStar from '../../assets/twostar.png'
import ThreeStar from '../../assets/threestar.png'
import news from '../../assets/news.png'
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import userFactory from "../../factories/userFactory";
import {normalizeDate} from "./Events";
import Loading from "../Loading";
import {Link} from "react-router-dom";
import axios from "axios"
class Event_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: {},
            loading:false,
            rest:200,
            text:""
        }
    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getEvents();
    }



    async getEvents(){
      /*  const comments=[
            {
                userID: "5dab628e083bcb305a5eb172",
                text:"fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5dab628e083bcb305a5eb172",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5dab628e083bcb305a5eb172",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5dab628e083bcb305a5eb172",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            }
        ];*/
        await this.props.events("/"+this.props.match.params.id).then(async result=> {
                //alert(Object.keys(result.action.payload));
                let newevents=result.value;
                 await this.setState({events:newevents})

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

    onSubmit=()=>{                              //duzenle

        if(this.state.text!=="") {
                    let newlist = this.state.events.comments;
                    let user=this.state.user;

            let calendarID=this.props.match.params.id;
            let com = {
                text: this.state.text,
                related:calendarID,
                about:"events"
                };
            newlist = [com, ...newlist];
            let comment = {
                related: "195426",
                text: "yükselir",
                about: "EVENT"
            };
            const data = axios.post("api.dev.arkenstone.ml/comments", comment, {withCredentials: true})
            //alert(JSON.stringify(data));
            this.setState({events: {...this.state.events, comments: newlist}, text: ""})
        }
    };
    render() {
        const events  = this.state.events.event;
        const state=this.state;


        return (

            events?(


                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <Segment raised padded compact  style={{display:"flex",width:"70%"}}>
                        <Grid columns={2} relaxed={"very"}>
                            <Grid.Column>
                <Segment  textAlign="left" style={{display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                    {<Image size="medium" src={news} />}
                    <Header textAlign='center'>

                        {events.Event}
                    </Header>
                    <List>
                        <List.Item>
                            <List.Icon name={"calendar"}/>
                            <List.Content>
                            {normalizeDate(events.Date)}
                            </List.Content>
                        </List.Item>
                        <List.Item>
                            <List.Icon name={"world"}/>
                            <List.Content>
                            {events.Country}
                            </List.Content>
                        </List.Item>

                            <Popup
                                content={"Importance"}
                                trigger={
                                    <List.Item>
                                        <List.Icon name={"attention"}/>
                                        < List.Content >
                                        < Rating defaultRating={events.Importance} maxRating={3} disabled />

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
                                <td>{events.Actual}</td>
                                <td>{events.Previous}</td>
                                <td>{events.Forecast}</td>
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
                    <Comment.Group style={{overflow:"auto",height:"250px",backgroundColor:"#fcfcfc",borderRadius:10}}>

                        {state.events.comments.length>0?state.events.comments.map(item=>(

                            <Comment style={{backgroundColor:"white",borderRadius:10}}>
                               <Comment.Content >
                                   <Comment.Author ><Link to={"/profile/"+item.userId}>{item.username+" "+item.usersurname}</Link></Comment.Author>
                                    <Comment.Metadata >
                                        <span>{normalizeDate(item.date)}</span>
                                    </Comment.Metadata>
                                    <Comment.Text>{item.text}</Comment.Text>

                                </Comment.Content>
                                <Divider/>
                            </Comment>

                            )




                        ):<h1>No comments yet</h1>}

                    </Comment.Group>
                    <Segment >
                    <Form >
                        <Form.TextArea style={{borderWidth:1,borderColor:"gray"}} maxLength={200} value={this.state.text}  onChange={(item)=>this.setState({rest:200-item.target.value.length,text:item.target.value})}/>

                        <div style={{display:"flex",flex:1}}>
                            <div style={{display:"flex",flexDirection:"row",flex:3}}/>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"center",flex:3}}>
                                <Button onClick={this.onSubmit} content='Add Comment' labelPosition='left' icon='edit' basic color={"black"} />
                            </div>
                            <div style={{display:"flex",flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",flex:3}}>
                                <h4>{this.state.rest}</h4>
                            </div>
                        </div>
                    </Form>
                    </Segment>
                </Segment>
                        </Grid.Column>
                        </Grid>
                        <Divider vertical></Divider>
                </Segment>

                </div>

                    ):(<Loading/>)



        )
    }
}

const dispatchToProps = dispatch => {
    return {
        events: params => dispatch(userActions.events(params)),
        userInformation:params=>dispatch(userActions.users(params))

    };
};

export default connect(null, dispatchToProps)(Event_Details);

