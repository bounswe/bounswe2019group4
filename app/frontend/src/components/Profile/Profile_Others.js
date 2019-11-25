import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react'
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
            profile_Id:"",
            index:0,
            user: {},
            portfolios:[],
            tradingEqs:{}


        }
    }
    componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        this.getProfile();
        //console.log(this.state.portfolios);
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
        await this.props.profile(this.props.id).then(async result =>{
                let newProfile = result.value
                console.log(newProfile)
                this.setState({user:newProfile})
                this.setState({portfolios:(newProfile.portfolios)})
                //console.log(this.state.portfolios)
            }
        )

        let newTradingEqs = {}
        for (let i=0;i<=portfolios.length;i++){

            await this.props.portfolios(this.state.portfolios[i]._id).then(async result => {
                    let newPortfolios = result.value
                    newTradingEqs[i] = newPortfolios.tradingEqs
                    //console.log(newPortfolios.tradingEqs)
                    //console.log(i)
                }
            )

        }
        console.log(newTradingEqs)
        //console.log(newTradingEqs[0])
        this.setState({tradingEqs:newTradingEqs})

    }





    render() {


        const { user,portfolios,userLocal,tradingEqs } = this.state;


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

                            {userLocal.name} {userLocal.surname}




                            {user.isPublic?<button className="ui right floated button">Follow</button>
                                : null}


                        </Header>
                        <small >
                            Following {user.following} Follower {user.follower}
                        </small>

                        <ul >
                            <li><strong>Name        :{userLocal.name}</strong></li>
                            <li><strong>Surname     :{userLocal.surname}</strong></li>

                            <li><strong>E-Mail      :{userLocal.email}</strong></li>
                            <li><strong>Account Type:{userLocal.isTrader ? 'Trader' : 'Normal'}</strong></li>
                            {userLocal.isTrader && <span>
                            <li><strong>IBAN     :{userLocal.iban}</strong></li>

                            <li><strong>TCKN      :{userLocal.tckn}</strong></li>


                        </span>}
                            <li><strong>Location:{userLocal.location}</strong></li>



                        </ul>




                    </Segment>

                    <Segment raised piled padded compact textAlign='left'>

                        <Header textAlign='Middle'>

                            My Portfolios

                        </Header>

                        <ul>
                            {portfolios.map((item,ind) => {

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
        portfolios: params => dispatch(userActions.portfolios(params))

    };
};

export default connect(null, dispatchToProps)(Profile);
