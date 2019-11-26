import React, {Component} from 'react';
import {Card, Label, Image, Icon} from 'semantic-ui-react';

class ProfileCard extends Component {
    constructor(props){
        super(props);
        this.state={
            name: "",
            surname: "",
            email: "",
            predictionRate: "",
            isPublic: false,
            isTrader: false,
            followers: 0,
            following: 0
        }
    }

    componentWillReceiveProps(props) {
        this.setState(props.user);
    }

    render() {
        const {name, surname, email, predictionRate, isPublic, isTrader, followers, following} = this.state;

        return(
            <Card style={{width: "100%", margin: 20}}>
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                <Card.Content>
                    <Card.Header>{name + " " + surname}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Label basic color='red' horizontal>
                        Prediction Rate
                    </Label>
                    <span className='date'>{predictionRate}</span>
                </Card.Content>
                <Card.Content extra>
                    <Label color={isPublic ? "green" : "red"} horizontal>
                        {isPublic ? "Public Profile": "Private Profile"}
                    </Label>
                    <Label color="grey" horizontal>
                        {isTrader ? "Trading User" : "Basic User"}
                    </Label>
                </Card.Content>
                <Card.Content extra>
                        <Icon name='mail' />
                        {email}
                </Card.Content>
            </Card>
        )
    }

}
export default ProfileCard;