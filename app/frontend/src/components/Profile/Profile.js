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

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            portfolios:[]
        }
    }

    componentDidMount() {
        const localState = loadState();
        this.setState({user: localState.user});
        const { id } = this.state;
        fetch(`http://api.dev.arkenstone.ml/profile/${id}`)
            .then(results => {
                return results.json();
            }).then(data =>{
                const { portfolios } = data;
                this.setState({portfolios})
            })
    }


    render() {
        const { user } = this.state;
        const ButtonExampleFloated = () => (
            <div>
                <Button active floated='right'>Right Floated</Button>

            </div>
        )

        return (



            <Segment.Group horizontal >



                <Segment raised piled padded compact textAlign='left' >
                    <Image src={profilePhoto} size='middle'   rounded />
                    <Header textAlign='center'>

                        {user.name} {user.surname}



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

                    {portfolios.forEach(function(item, index){
                        console.log(item[index]);
                    })}

                    {   portfolios.forEach(function(key) {

                        console.log(key, this.portfolios[key]);

                    })}




                    {portfolios.forEach(function (key) {
                        if(portfolios.key.map(isPrivate =>portfolios[key].contains(false))){

                            return (<ul>
                                <li><strong> {} </strong></li>
                                <li> {key.definition}</li>
                                <li><small> {key.date} IFFFFFFFF</small></li>
                            </ul>);

                        }else{
                            return (       <line>ELSEEEE</line>)
                        }
                    })}

                ffsdsdfsdf
                </Segment>


                <Segment raised piled padded compact textAlign='left'>

                    <Header textAlign='Middle'>

                        Profit/Loss

                    </Header>

                sdfdsfsdfdsfsd


                </Segment>

            </Segment.Group>
        )
    }


}

export  default Profile;
