import React, {Component} from 'react';
import {Form, Checkbox, Grid, Segment, Header, Container, List, Divider} from 'semantic-ui-react';
import {connect} from 'react-redux';

import history from '../../_core/history';
import * as userActions from '../../actions/userActions';

import LocationPicker from 'react-location-picker';


class SignUpGoogle extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            surname: "",
            location: "İstanbul",
            email: "",
            isTrader: false,
            iban: null,
            tckn: null,
            isPublic: true
        }
    }

    componentWillMount() {
        const googleUser = this.props.location.state;
        this.setState(googleUser);

    }

    handleLocationChange ({ position, address, places }) {
        if(places.length === 1) {
            this.setState({location: places[0]["formatted_address"]});
        } else {
            this.setState({location: places[places.length-2]["formatted_address"].split(",")[0]});
        }
    }

    handleChange(e, { name, value }) {
        if(name === "isTrader" || name === "isPublic") {
            this.setState({[name]: !this.state[name]});
        } else {
            this.setState({[name]: value});
        }
    }

    signUp() {
        this.props.signUp(this.state).then(result => {
            this.props.login(this.state).then(result => {
                history.push("/");
            })
        })
    }

    render() {
        const { name, surname, location, email, isTrader, iban, tckn, isPublic } = this.state;
        return (
            <Grid columns={2} divided>
                <Grid.Row>
                    <Grid.Column>
                        <Segment raised>
                            <Header>
                                Complete Your Profile
                            </Header>
                            <Form onSubmit={this.signUp.bind(this)}>
                                <Grid columns={2} divided>
                                    <Grid.Row>
                                        <Grid.Column stretched>
                                            <Form.Group grouped>
                                                <Form.Field width={16}>
                                                    <label>Name:</label>
                                                    <Form.Input
                                                        disabled
                                                        placeholder='name'
                                                        name='name'
                                                        value={name}
                                                        onChange={this.handleChange.bind(this)}
                                                    />
                                                </Form.Field>
                                                <Form.Field width={16}>
                                                    <label>Surname:</label>
                                                    <Form.Input
                                                        disabled
                                                        placeholder='surname'
                                                        name='surname'
                                                        value={surname}
                                                        onChange={this.handleChange.bind(this)}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                        </Grid.Column>
                                        <Grid.Column stretched>
                                            <Form.Group grouped>
                                                <Form.Field>
                                                    <label>Email:</label>
                                                    <Form.Input
                                                        disabled
                                                        placeholder='email'
                                                        name='email'
                                                        value={email}
                                                        onChange={this.handleChange.bind(this)}
                                                    />
                                                </Form.Field>
                                                <Form.Field width={16}>
                                                    <label>Location:</label>
                                                    <LocationPicker
                                                        containerElement={ <div style={ {height: '100%'} } /> }
                                                        mapElement={ <div style={ {height: '400px'} } /> }
                                                        defaultPosition={{lat: 41.0082, lng: 28.9784}}
                                                        onChange={this.handleLocationChange.bind(this)}
                                                    />
                                                </Form.Field>
                                            </Form.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Form.Group grouped>
                                                <Form.Field control={Checkbox} slider name="isTrader" checked={isTrader} onChange={this.handleChange.bind(this)} label="Want to be a trader and join the winning community?" />
                                                { isTrader && (
                                                    <Form.Field>
                                                        <label>IBAN:</label>
                                                        <Form.Input
                                                            placeholder='IBAN'
                                                            name='iban'
                                                            value={iban}
                                                            onChange={this.handleChange.bind(this)}
                                                        />
                                                    </Form.Field>
                                                )}
                                                {isTrader && (
                                                    <Form.Field>
                                                        <label>TCKN:</label>
                                                        <Form.Input
                                                            placeholder='TCKN'
                                                            name='tckn'
                                                            value={tckn}
                                                            onChange={this.handleChange.bind(this)}
                                                        />
                                                    </Form.Field>
                                                )}
                                            </Form.Group>
                                        </Grid.Column>
                                        <Grid.Column>
                                            <Form.Group grouped>
                                                <Form.Field control={Checkbox} name="isPublic" checked={isPublic} onChange={this.handleChange.bind(this)} label="Want your profile to be seen by other users?" />
                                                <Form.Button content="Sign Up" />
                                            </Form.Group>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column>
                        <Segment raised textAlign="left">
                            <Container>
                                <Header>
                                    Join today and get rich!
                                </Header>
                                <List bulleted>
                                    <List.Item>
                                        Sign up easily!
                                    </List.Item>
                                    <List.Item>
                                        Become a basic user and follow the leading minds in the area!
                                    </List.Item>
                                    <List.Item>
                                        Become a trader and start getting into it.
                                    </List.Item>
                                    <List.Item>
                                        See what others think, do and suggest!
                                    </List.Item>
                                </List>
                            </Container>
                            <Divider/>
                            <Container>
                                <Header>
                                    Arkenstone. It's time for you to find your gem!
                                </Header>
                            </Container>
                        </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        login: params => dispatch(userActions.login(params)),
        signUp: params => dispatch(userActions.signUp(params)),
    };
};

export default connect(null, dispatchToProps)(SignUpGoogle);