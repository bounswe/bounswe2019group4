import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react'
import {loadState} from '../../_core/localStorage'
import { Label, Grid, Segment, Header, Rating, List, Divider} from 'semantic-ui-react';
import {connect} from 'react-redux';
import history from '../../_core/history';
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import profilePhoto from "./h2.jpg";
import * as portfolios from "lodash";
import { Card } from 'semantic-ui-react'
import moment from 'moment';

import ProfileCard from "./ProfileCard";
import FriendsCard from "./FriendsCard";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userLocal:{},
            index:0,
            user: {},
            portfolios:[],
            tradingEqs:{}
        }
    }
    componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        this.setState({userLocal: localState.user});
        this.getProfile();
        //console.log(this.state.portfolios);
        this.state.portfolios.forEach(element =>{
            console.log(element);
            this.getPortfolios(element._id);
        })

    }

    acceptFollow(id) {
        this.props.acceptFollow(id).then(()=> {
            this.getProfile();
        })
    }

    rejectFollow(id) {
        this.props.rejectFollow(id).then(()=> {
            this.getProfile();
        })
    }


    async getPortfolios(i) {
        //let ikz = this.state.user.portfolios;
       // console.log(ikz)
        await this.props.portfolios(this.state.portfolios[i]._id).then(async result => {
                let newPortfolios = result.value
                let newTradingEqs = {}
                console.log(newPortfolios.tradingEqs)
                newTradingEqs[i] = newPortfolios.tradingEqs
                this.setState({tradingEqs:newTradingEqs})

            }
        )
    }

      async getProfile() {
        await this.props.profile(loadState().user._id).then(async result =>{
            console.log(result.value);
            let newProfile = result.value
            console.log(newProfile.portfolios)
            this.setState({user:newProfile})
            //console.log(this.state.portfolios)
            }
        )
    }





    render() {


        const { user,portfolios,userLocal,tradingEqs } = this.state;
        console.log(user);

        //console.log(portfolios)

        //const { portfolios } = this.state;
        //const portfolios = this.getData(user).then(data => console.log(data));
       // console.log(user)

        //console.log(JSON.parse(portfolios[0]));
        const profileCardProps = {...user.user, following: user.following, followers: user.follower};

        const ButtonExampleFloated = () => (
            <div>
                <Button active floated='right'>Right Floated</Button>

            </div>
        )
        return (

                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Grid.Row relaxed>
                                <ProfileCard user={profileCardProps} style={{background: "rgba(255,255,255,0.5)"}}/>
                            </Grid.Row>
                            {user.followRequests && user.followRequests.length > 0 &&
                            <Grid.Row relaxed>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.5)"}}>
                                    <List divided relaxed textAlign="left">
                                        <List.Header as="h3">Pending Requests</List.Header>
                                        {user.followRequests.map(follower => {
                                            return <List.Item>
                                                <div>
                                                <Icon name="user"/><span>{follower.FollowingName + " " + follower.FollowingSurname}</span>
                                                <Label circular content="Reject" basic color="red" style={{float: "right"}} onClick={this.rejectFollow.bind(this,follower._id)} />
                                                    <Label circular content="Accept" basic color="green" style={{float: "right"}} onClick={this.acceptFollow.bind(this,follower._id)} />
                                                </div>
                                            </List.Item>
                                        })}
                                    </List>
                                </Segment>
                            </Grid.Row>
                            }
                            <Grid.Row relaxed>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width:"100%", background: "rgba(255,255,255,0.15)"}}>
                                <List animated divided relaxed textAlign="left">
                                    <List.Header as="h3" style={{color: "#c9c9c9"}}>{user.follower + " Followers"}</List.Header>
                                    {user.followers && user.followers.map(follower => {
                                        return <List.Item icon="user"
                                                          style={{color: "#c9c9c9"}}
                                                          onClick={()=>{history.push("/profile/"+follower.FollowingId)}}
                                                          content={follower.FollowingName + " " + follower.FollowingSurname} />
                                    })}
                                </List>
                                </Segment>
                            </Grid.Row>
                            <Grid.Row relaxed>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width:"100%", background: "rgba(255,255,255,0.15)"}}>
                                    <List animated divided relaxed textAlign="left">
                                        <List.Header as="h3" style={{color: "#c9c9c9"}}>{user.following + " Following"}</List.Header>
                                        {user.followings && user.followings.map(follower => {
                                            return <List.Item icon="user"
                                                              style={{color: "#c9c9c9"}}
                                                              onClick={()=>{history.push("/profile/"+follower.FollowedId)}}
                                                              content={follower.FollowedName + " " + follower.FollowedSurname} />
                                        })}
                                    </List>
                                </Segment>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                <Header style={{color: "#c9c9c9"}}>Articles<Button style={{float:"right"}} basic color="green" onClick={()=>{history.push("/articles/new")}}>Add</Button></Header>
                                <Divider/>
                                {user.articles && user.articles.length>0 ?
                                    user.articles.map(article => {
                                        return (
                                            <Card style={{width: "100%"}} onClick={()=>{history.push("/articles/"+article._id)}}>
                                                <Card.Content>
                                                    <Card.Header>{article.title}</Card.Header>
                                                    <Card.Meta type="date">{moment(article.date).format("DD/MM/YYYY HH:mm")}</Card.Meta>
                                                    <Card.Description>{article.text}</Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <Rating defaultRating={article.rateAverage} maxRating={5} disabled />{" by "+ article.numberOfRates + " votes"}
                                                </Card.Content>
                                        </Card>
                                        )
                                    }) : <span style={{color: "#c9c9c9"}}>No Article Created!</span>
                                }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Grid.Row>
                            <Segment textAlign="left" color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                <List animated divided relaxed textAlign="left">
                                    <List.Header as="h3" style={{color: "#c9c9c9"}}>Followed Trading Equipment</List.Header>
                                    {user.followingTradings && user.followingTradings.length >0 ? user.followingTradings.map(teq => {
                                        return <List.Item icon="chart line"
                                                          style={{color: "#c9c9c9"}}
                                                          onClick={()=>{history.push({pathname: "trading-equipment",state:{currency: teq.TradingEq}})}}
                                                          content={teq.TradingEq}/>
                                    }): <List.Item style={{color: "#c9c9c9"}} content="No Trading Equipment Is Followed" />}
                                </List>
                            </Segment>
                            </Grid.Row>
                            <Grid.Row>
                                <Segment color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                    <Header style={{color: "#c9c9c9"}}>Portfolios</Header>
                                    <Divider style={{color: "#c9c9c9"}} />
                                    {user.portfolios && user.portfolios.length>0 ?
                                        user.portfolios.map(portfolio => {
                                            return (
                                                <Card style={{width: "100%"}}>
                                                    <Card.Content>
                                                        <Card.Header>{portfolio.title}</Card.Header>
                                                        <Card.Description>{portfolio.definition}</Card.Description>
                                                    </Card.Content>

                                                </Card>
                                            )
                                        }) : <span style={{color: "#c9c9c9"}}>No Portfolio Created!</span>
                                    }
                                </Segment>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
        )
    }


}

const dispatchToProps = dispatch => {
    return {
        profile: params => dispatch(userActions.profile(params)),
        portfolios: params => dispatch(userActions.portfolios(params)),
        acceptFollow: params => dispatch(userActions.acceptFollow(params)),
        rejectFollow: params => dispatch(userActions.rejectFollow(params))

    };
};

export default connect(null, dispatchToProps)(Profile);


