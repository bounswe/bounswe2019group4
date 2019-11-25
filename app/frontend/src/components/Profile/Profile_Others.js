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
            user:{},
            portfolios:[],
            isPublic:false,
            tradingEqs:{}


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
                let newTradingEqs = {}
                console.log(newPortfolios.tradingEqs)
                newTradingEqs[i] = newPortfolios.tradingEqs
                this.setState({tradingEqs:newTradingEqs})

            }
        )
    }

    async getProfile() {
        await this.props.profile(this.props.match.params.id).then(async result =>{
                let newProfile = result.value
                console.log(newProfile)
                this.setState({user:newProfile.user})
                this.setState({following:newProfile.following})
                this.setState({follower:newProfile.follower})
                this.setState({isPublic:newProfile.user.isPublic})
                this.setState({portfolios:(newProfile.portfolios)})
                //console.log(this.state.portfolios)
            }
        )

        // let newTradingEqs = {}
        // for (let i=0;i<=portfolios.length;i++){
        //
        //     await this.props.portfolios(this.state.portfolios[i]._id).then(async result => {
        //             let newPortfolios = result.value
        //             newTradingEqs[i] = newPortfolios.tradingEqs
        //             //console.log(newPortfolios.tradingEqs)
        //             //console.log(i)
        //         }
        //     )
        //
        // }
        // console.log(newTradingEqs)
        // //console.log(newTradingEqs[0])
        // this.setState({tradingEqs:newTradingEqs})

    }





    render() {


        const { user,portfolios,tradingEqs,following,follower } = this.state;


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

                            {user.name} {user.surname}




                            {this.state.isPublic?
                                null    :
                                <button onClick={this.navigate} className="ui right floated button">Follow</button>
                            }


                        </Header>
                        <small >
                            Following {following} Follower {follower}
                        </small>

                        <ul >
                            <li><strong>Name        :{user.name}</strong></li>
                            <li><strong>Surname     :{user.surname}</strong></li>
                            {this.state.isPublic?
                                <li><strong>E-Mail      :{user.email}</strong></li>:null}
                            <li><strong>Account Type:{user.isTrader ? 'Trader' : 'Normal'}</strong></li>
                            {user.isTrader && <span>
                            <li><strong>IBAN     :{user.iban}</strong></li>

                            <li><strong>TCKN      :{user.tckn}</strong></li>


                        </span>}
                            <li><strong>Location:{user.location}</strong></li>



                        </ul>




                    </Segment>

                    <Segment raised piled padded compact textAlign='left'>

                        <Header textAlign='Middle'>

                            My Portfolios

                        </Header>

                        <ul>
                            {!user.isPublic? null :
                                portfolios.map((item,ind) => {

                                return (
                                    <div class="ui card">
                                        <Card raised piled padded compact
                                              header={item.title}
                                              meta={item.date.substring(0,10)}
                                              description={item.definition}>
                                        </Card>
                                        <div className="extra content">
                                            <i className="check icon"></i>
                                            {tradingEqs[ind]}
                                        </div>
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
        follow:params => dispatch(userActions.follow(params))
    };
};

export default connect(null, dispatchToProps)(Profile);
