import React, {Component} from 'react';
import {Segment, Container, Header, Loader} from 'semantic-ui-react';
import * as userActions from "../../actions/userActions";
import connect from "react-redux/es/connect/connect";

class VerifyEmail extends Component {

    constructor(props){
        super(props);
        this.state = {loading: true, verified: false}
    }

    componentDidMount() {
        this.props.verify({token: this.props.match.params.token}).then(result => {
            this.setState({
                loading: false,
                verified: true
            })
        }).finally(() => {
            this.setState({ loading: false });
        })
    }

    render() {
        const {loading, verified} = this.state;
        return (
            <Segment>
                {loading && <Loader/>}
                {!loading && verified &&
                (
                    <Container>
                        <Header>Account Verified Succesfully!</Header>
                        <p>Sign in and start earning!</p>
                    </Container>
                )
                }
                {!loading && !verified &&
                (
                    <Container>
                        <Header>We couldn't verify your account :(</Header>
                        <p>There seems to be a problem, please try again later or contact info@arkenstone.ml for support.</p>
                    </Container>
                )
                }
            </Segment>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        verify: params => dispatch(userActions.verify(params))
    };
};

export default connect(
    null,
    dispatchToProps
)(VerifyEmail);
