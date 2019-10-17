import React, {Component} from 'react';
import { Icon } from 'semantic-ui-react'
import {loadState} from '../../_core/localStorage'
import {Form, Checkbox, Grid, Segment, Header, Container, List, Divider} from 'semantic-ui-react';
import {connect} from 'react-redux';

import history from '../../_core/history';
import * as userActions from '../../actions/userActions';
import Image from "semantic-ui-react/dist/commonjs/elements/Image";
import profilePhoto from "./h2.jpg";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
             user: {}
        }
    }

    componentDidMount() {
        const localState = loadState();
        this.setState({user: localState.user});
    }


    render() {
        const { user } = this.state;

        return (
            <Segment raised piled padded compact textAlign='left' >
                <Image src={profilePhoto} size='medium'  floated='center' rounded />
                <Header textAlign='center'>

                {user.name} {user.surname}
            </Header>
                <ul >
                    <li><strong>Name</strong></li>
                    <li>{user.name}</li>
                    <li><strong>Surname</strong></li>
                    <li>{user.surname}</li>
                    <li><strong>E-Mail</strong></li>
                    <li>{user.email}</li>
                    <li><strong>Account Type</strong></li>
                    <li>{user.isTrader ? 'Trader' : 'Public'}</li>
                    {user.isTrader && <span>
                        <li><strong>IBAN</strong></li>
                        <li>{user.iban}</li>
                        <li><strong>TCKN</strong></li>
                        <li>{user.tckn}</li>

                    </span>}
                    <li><strong>Location</strong></li>
                    <li>{user.location}</li>


                </ul>

            </Segment>



        )
    }
}

export  default Profile;
