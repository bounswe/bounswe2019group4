import React, {Component} from 'react';
import {Button, Icon, Menu} from 'semantic-ui-react'
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


        //console.log(portfolios)

        //const { portfolios } = this.state;
        //const portfolios = this.getData(user).then(data => console.log(data));
        // console.log(user)

        //console.log(JSON.parse(portfolios[0]));


        const ButtonExampleFloated = () => (
            <div>
                <Button active floated='right'>Right Floated</Button>

            </div>
        )
        return (
            <>


                <Segment.Group horizontal >



                    <Segment raised piled padded compact textAlign='left' >
                        <Image src={profilePhoto} size='middle'   rounded />
                        <Header textAlign='center'>

                            {otherUser.name} {otherUser.surname}




                            {newProfile.followStatus === "FALSE" && newProfile.followStatus !== "PENDING"?
                                <button onClick={this.followUser.bind(this, otherUser._id)} className="ui right floated button">Follow</button>
                                :null}
                            {newProfile.followStatus === "TRUE" && newProfile.followStatus !== "PENDING"?
                                <button onClick={this.unFollowUser.bind(this, otherUser._id)} className="ui right floated button">Unfollow</button>:null
                            }
                            {newProfile.followStatus === "PENDING"? <button className="ui right floated button">Pending</button>
                                :null}


                        </Header>
                        <small >
                            Following {following} Follower {follower}
                        </small>

                        <ul >
                            <li><strong>Name        :{otherUser.name}</strong></li>
                            <li><strong>Surname     :{otherUser.surname}</strong></li>
                            {this.state.isPublic?
                                <li><strong>E-Mail      :{otherUser.email}</strong></li>:null}
                            <li><strong>Account Type:{otherUser.isTrader ? 'Trader' : 'Normal'}</strong></li>
                            {otherUser.isTrader && <span>
                            <li><strong>IBAN     :{otherUser.iban}</strong></li>

                            <li><strong>TCKN      :{otherUser.tckn}</strong></li>


                        </span>}

                        <li><strong>Location:{otherUser.location}</strong></li>



                        </ul>




                    </Segment>

                    <Segment raised piled padded compact textAlign='left'>

                        <Header textAlign='Middle'>

                            My Portfolios

                        </Header>

                        <ul>
                            {!newProfile.followStatus? null:
                                portfolios.map((item,ind) => {

                                return (
                                    <div class="ui card">
                                        <Card raised piled padded compact
                                              header={item.title}
                                              meta={item.date.substring(0,10)}
                                              description={item.definition}>
                                        </Card>
                                    </div>);

                            })}
                        </ul>




                    </Segment>


                    <Segment raised piled padded compact textAlign='left'>

                        <Header textAlign='Middle'>

                            Profit/Loss

                        </Header>




                    </Segment>

                </Segment.Group>
            </>
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
