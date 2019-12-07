import React, {Component} from 'react';
import {Button, Icon, Menu, Rating} from 'semantic-ui-react'
import {loadState} from '../../_core/localStorage'
import {Form, Checkbox, Grid, Segment, Header, Container, List, Divider} from 'semantic-ui-react';
import {connect} from 'react-redux';
import history from '../../_core/history';
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import profilePhoto from "./h2.jpg";
import * as portfolios from "lodash";
import { Card } from 'semantic-ui-react'
import SegmentGroup from "semantic-ui-react/dist/commonjs/elements/Segment/SegmentGroup";
import ProfileCard from "./ProfileCard";
import moment from 'moment';

class Profile extends Component {



    constructor(props) {
        super(props);
        this.state = {
            follower:0,
            following:0,
            otherUser:{},
            portfolios:[],
            isPublic:false,
            newProfile:{}
        }
    }
    componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        this.getProfile();
        console.log(this.props.match.params.id);
        this.state.portfolios.forEach(element =>{
            console.log(element);
            this.getPortfolios(element._id);
        })





    }

    componentDidUpdate(props) {
        if(props.match.params.id === loadState().user._id) {
            history.push("/profile");
        }
        if(props.match.params.id !== this.props.match.params.id) {
            this.getProfile();
        }
    }

    async getPortfolios(i) {
        //let ikz = this.state.user.portfolios;
        // console.log(ikz)
        await this.props.portfolios(this.state.portfolios[i]._id).then(async result => {
                let newPortfolios = result.value
                //let newTradingEqs = {}
                console.log(newPortfolios.tradingEqs)
                //newTradingEqs[i] = newPortfolios.tradingEqs
                //this.setState({tradingEqs:newTradingEqs})

            }
        )
    }

    async getProfile() {
        await this.props.profile(this.props.match.params.id).then(async result =>{
                let newProfile = result.value
                console.log(newProfile)
                this.setState({newProfile:newProfile,otherUser:newProfile.user, following:newProfile.following,
                            follower:newProfile.follower,
                            isPublic:newProfile.user.isPublic,
                            portfolios:newProfile.portfolios || []})

                //console.log(newProfile.portfolios)
                console.log(this.state.portfolios)
            }
        )
    }

    followUser(id) {
        this.props.follow(id).then(()=> {
            this.getProfile();
        })
    }

    unFollowUser(id){
        this.props.unfollow(id).then(()=> {
            this.getProfile();
        })
    }



    render() {


        const {newProfile, otherUser,portfolios,following,follower } = this.state;

        const currentlyFollowing = newProfile.followStatus === "TRUE";

        const profileCardProps = {...newProfile.user};

        return (
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}>
                            <Grid.Row relaxed>
                                <ProfileCard user={profileCardProps}/>
                            </Grid.Row>
                            {newProfile.followStatus === "FALSE" && newProfile.followStatus !== "PENDING"?
                                <Button style={{width: "100%", marginLeft: 20,marginRight: 20}} color="teal" onClick={this.followUser.bind(this, otherUser._id)}>Follow</Button>
                                :null}
                            {newProfile.followStatus === "TRUE" && newProfile.followStatus !== "PENDING"?
                                <Button style={{width: "100%", marginLeft: 20,marginRight: 20}} color="google plus" onClick={this.unFollowUser.bind(this, otherUser._id)}>Unfollow</Button>
                                :null
                            }
                            {newProfile.followStatus === "PENDING"?
                                <Button style={{width: "100%", marginLeft: 20,marginRight: 20}} color="grey" disabled>Pending</Button>
                                :null}
                            {(newProfile.user && (newProfile.user.isPublic || currentlyFollowing)) &&
                            <Grid.Row relaxed>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                    <List animated divided relaxed textAlign="left">
                                        <List.Header as="h3" style={{color: "#c9c9c9"}}>{newProfile.follower + " Followers"}</List.Header>
                                        {newProfile.followers && newProfile.followers.map(follower => {
                                            return <List.Item icon="user"
                                                              style={{color: "#c9c9c9"}}
                                                              onClick={()=>{history.push("/profile/"+follower.FollowingId)}}
                                                              content={follower.FollowingName + " " + follower.FollowingSurname}/>
                                        })}
                                    </List>
                                </Segment>
                            </Grid.Row>
                            }
                            {(newProfile.user && (newProfile.user.isPublic || currentlyFollowing)) &&
                            <Grid.Row relaxed>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width:"100%", background: "rgba(255,255,255,0.15)"}}>
                                    <List animated divided relaxed textAlign="left">
                                        <List.Header as="h3" style={{color: "#c9c9c9"}}>{newProfile.following + " Following"}</List.Header>
                                        {newProfile.followings && newProfile.followings.map(follower => {
                                            return <List.Item icon="user"
                                                              style={{color: "#c9c9c9"}}
                                                              onClick={()=>{history.push("/profile/"+follower.FollowedId)}}
                                                              content={follower.FollowedName + " " + follower.FollowedSurname} />
                                        })}
                                    </List>
                                </Segment>
                            </Grid.Row>
                            }
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Segment color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                <Header style={{color: "#c9c9c9"}}>Articles</Header>
                                <Divider/>
                                {newProfile.user && (newProfile.user.isPublic || currentlyFollowing) && newProfile.articles && newProfile.articles.length>0 ?
                                    newProfile.articles.map(article => {
                                        return (
                                            <Card style={{width: "100%", background: "rgba(255,255,255,0.15)"}} onClick={()=>{history.push("/articles/"+article._id)}}>
                                                <Card.Content>
                                                    <Card.Header style={{color: "#c9c9c9"}}>{article.title}</Card.Header>
                                                    <Card.Meta type="date" style={{color: "#c9c9c9"}}>{moment(article.date).format("DD/MM/YYYY HH:mm")}</Card.Meta>
                                                    <Card.Description style={{color: "#c9c9c9"}}>{article.text}</Card.Description>
                                                </Card.Content>
                                                <Card.Content extra>
                                                    <Rating defaultRating={article.rateAverage} maxRating={5} disabled icon="star inverted"/>
                                                    <span style={{color: "#c9c9c9"}}>{" by "+ article.numberOfRates + " votes"}</span>
                                                </Card.Content>
                                            </Card>
                                        )
                                    }) : (newProfile.user && !newProfile.user.isPublic && !currentlyFollowing) ? <span style={{color: "#c9c9c9"}}>Can't See User's Articles</span>
                                        : <span style={{color: "#c9c9c9"}}>No Article Created!</span>
                                }
                            </Segment>
                        </Grid.Column>
                        <Grid.Column width={5}>
                            <Grid.Row>
                                <Segment textAlign="left" color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                    <List animated divided relaxed textAlign="left">
                                        <List.Header as="h3" style={{color: "#c9c9c9"}}>Followed Trading Equipment</List.Header>
                                        {newProfile.user && (newProfile.user.isPublic || currentlyFollowing) && newProfile.followingTradings && newProfile.followingTradings.length >0 ? newProfile.followingTradings.map(teq => {
                                            return <List.Item icon="chart line"
                                                              style={{color: "#c9c9c9"}}
                                                              onClick={()=>{history.push({pathname: "trading-equipment",state:{currency: teq.TradingEq}})}}
                                                              content={teq.TradingEq}/>
                                        }): (newProfile.user && !newProfile.user.isPublic && !currentlyFollowing) ? <List.Item style={{color: "#c9c9c9"}} content="Can't See Followed Trading Equipment" /> : <List.Item style={{color: "#c9c9c9"}} content="No Trading Equipment Is Followed" />}
                                    </List>
                                </Segment>
                            </Grid.Row>
                            <Grid.Row>
                                <Segment color="teal" style={{margin: 20, width: "100%", background: "rgba(255,255,255,0.15)"}}>
                                    <Header style={{color: "#c9c9c9"}}>Portfolios</Header>
                                    <Divider style={{color: "#c9c9c9"}}/>
                                    {newProfile.user && (newProfile.user.isPublic || currentlyFollowing) && newProfile.portfolios && newProfile.portfolios.length>0 ?
                                        newProfile.portfolios.map(portfolio => {
                                            return (
                                                <Card style={{width: "100%"}} style={{color: "#c9c9c9"}}>
                                                    <Card.Content>
                                                        <Card.Header style={{color: "#c9c9c9"}}>{portfolio.title}</Card.Header>
                                                        <Card.Description style={{color: "#c9c9c9"}}>{portfolio.definition}</Card.Description>
                                                    </Card.Content>

                                                </Card>
                                            )
                                        }) : (newProfile.user && !newProfile.user.isPublic && !currentlyFollowing) ? <span style={{color: "#c9c9c9"}}>Can't See User's Portfolios</span>
                                            : <span style={{color: "#c9c9c9"}}>No Portfolio Created!</span>
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
        follow:params => dispatch(userActions.follow(params)),
        unfollow:params => dispatch(userActions.unfollow(params))
    };
};

export default connect(null, dispatchToProps)(Profile);
