import React, {Component} from 'react';
import {Card, Label, Image, Icon} from 'semantic-ui-react';

const initialState={
    name: "",
    surname: "",
    email: "",
    predictionRate: "",
    isPublic: false,
    isTrader: false,
    followers: 0,
    following: 0
}

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
        const newState={...initialState,...props.user};
        this.setState(newState);
    }

    render() {
        const {name, surname, email, predictionRate, isPublic, isTrader,location, followers, following} = this.state;

        return(
            <Card style={{width: "100%", margin: 20, background: "rgba(255,255,255,0.15)"}}>
                <Image src='https://cnam.ca/wp-content/uploads/2018/06/default-profile-300x300.gif' wrapped ui={false} />
                <Card.Content>
                    <Card.Header style={{color: "#c9c9c9"}}>{name + " " + surname}</Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <Label basic color='red' horizontal >
                        Prediction Rate
                    </Label>
                    <span className='date' style={{color: "#c9c9c9"}}>{predictionRate}</span>
                </Card.Content>
                <Card.Content extra>
                    <Label color={isPublic ? "green" : "red"} horizontal >
                        {isPublic ? "Public Profile": "Private Profile"}
                    </Label>
                    <Label color="grey" horizontal>
                        {isTrader ? "Trading User" : "Basic User"}
                    </Label>
                </Card.Content>
                {email &&
                <Card.Content extra>
                    <Icon inverted name='mail' />
                    <span style={{color: "#c9c9c9"}}>{email}</span>

                </Card.Content>

                }
                {location &&
                <Card.Content extra>
                    <Icon inverted name='map pin'/>
                    <span style={{color: "#c9c9c9"}}>{location}</span>

                </Card.Content>
                }
            </Card>
        )
    }

}
export default ProfileCard;