import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {Header, Segment} from 'semantic-ui-react';
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

class Event_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            events: {



            },


        }


    }

    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getEvents();
        await this.getsetUsername();

    }


    getsetUsername=async ()=>{
        const comments=[];
        for(let i of this.state.events.comments) {

            let data=await this.props.userInformation("/" + i.userID);
            let user=data.value;
            i.username=user.user.name + " " + user.user.surname;
            comments.push(i);


        }
        this.setState({events:{...this.state.events,comments:comments}});
    };


    async getEvents(){
        const comments=[
            {
                userID: "5da9098b3866660dabd30d6f",
                text:"fdsfsdssfgfasffssfsdssfgfasffssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5da9098b3866660dabd30d6f",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5da9098b3866660dabd30d6f",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            },
            {
                userID: "5da9098b3866660dabd30d6f",
                text:"fssfsdssfgfasf",
                date:"2019-11-11T13:56:51.066Z"

            }
        ];
        await this.props.events("/"+this.props.match.params.id).then(async result=> {
                //alert(Object.keys(result.action.payload));
                let newevents=result.value;
                newevents.comments=comments;

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

    render() {
        const events  = this.state.events.event;
        const state=this.state;


        return (

            events?(


                <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                <Segment raised piled padded compact textAlign="left" style={{display:"flex",flexDirection:"column",width:"30%",alignItems:"center"}}>
                    {<Image size="medium" src={news} />}
                    <Header textAlign='center'>

                        {events.Event}
                    </Header>
                    <ul>
                        <li><strong>Date:</strong>{normalizeDate(events.Date)}</li>
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

                <Segment style={{width:"50%"}}>
                    <Header textAlign={"center"}>
                        Comments
                    </Header>
                    <table  className="ui red table">
                        <thead>
                        <tr>
                            <th>User</th>
                            <th class="ten wide" style={{whiteSpace:"wrap"}}>Comment</th>
                            <th class="two wide">Date</th>
                        </tr>
                        </thead>
                        <tbody>
                        {state.events.comments.map(item=>(
                            <tr>
                                <td>{item.username?item.username: <Loading/>}</td>
                                <td>{item.text}</td>
                                <td>{normalizeDate(item.date)}</td>
                            </tr>
                        ))}

                        </tbody>

                    </table>

                </Segment>
                </div>

                    ):(<Loading/>
                )


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

