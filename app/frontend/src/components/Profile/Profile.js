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
            index:0,
            user: {},
            portfolios: [
                {
                    "_id": "5ddb04331d01120dba5c7a2a",
                    "title": "My Favorite Trading Eqs",
                    "definition": "This portfolio includes my favourite trading equipments",
                    "isPrivate": true,
                    "userId": "5dd986e3221a57705b9a4d14",
                    "date": "2019-11-23T19:37:17.822Z",
                    "__v": 0
                },
                {
                    "_id": "5ddb050a1d01120dba5c7a2b",
                    "title": "My Second Favorite ones",
                    "definition": "This portfolio includes my 2nd favourite trading equipments",
                    "isPrivate": true,
                    "userId": "5dd986e3221a57705b9a4d14",
                    "date": "2019-11-22T21:57:06.278Z",
                    "__v": 0
                }
            ]


        }
    }
    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user, rest:1000});
        await this.getProfile()
    }

    getPortfolios(i) {

        const son ={}
        this.props.portfolios(this.state.portfolios[i]._id).then(result => console.log(result)
        )


        //this.setState({portfolios: result.user.portfolios})


    }

      getProfile() {
        this.props.profile(loadState().user._id).then( result =>{
            let newProfile = result.value;
            this.setState({newProfile})

        })
            //this.setState({portfolios: result.user.portfolios}
    }




    render() {


        const { user,portfolios,follower,following } = this.state;


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


                        Following {console.log(following)}
                        Follower {console.log(follower)}

                        <button className="ui right floated button">Follow</button>


                    </Header>

                    <ul >
                        <li><strong>Name        :{user.name}</strong></li>
                        <li><strong>Surname     :{user.surname}</strong></li>

                        <li><strong>E-Mail      :{user.email}</strong></li>
                        <li><strong>Account Type:{user.isTrader ? 'Trader' : 'Public'}</strong></li>
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
                        {portfolios.map((item,ind) => {

                            return (
                            <div>
                                <Card
                                header={item.title}
                                meta={item.date.substring(0,10)}
                                description={item.definition}>
                                </Card>
                                {this.getPortfolios(ind)}
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


