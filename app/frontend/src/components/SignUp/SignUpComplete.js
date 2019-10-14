import React,{Component} from 'react';
import {Segment, Container, Header, Button} from 'semantic-ui-react';

import history from '../../_core/history';

class SignUpComplete extends Component {
    constructor(props) {
        super(props);
    }

    navigateHome() {
        history.push("/");
    }

    render() {
        return (
            <Segment>
                <Container>
                    <Header>Sign Up Complete!</Header>
                    <p>Now is the time for you to check your email for verification and start earning as soon as possible!</p>
                    <p>See you soon!</p>
                    <Button onClick={this.navigateHome}>Head back to home page</Button>
                </Container>
            </Segment>
        )
    }
}

export default SignUpComplete;