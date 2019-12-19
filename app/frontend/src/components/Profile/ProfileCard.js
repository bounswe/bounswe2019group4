import React, {Component} from 'react';
import {Card, Label, Image, Icon, Button} from 'semantic-ui-react';
import {loadState} from "../../_core/localStorage";
import history from "../../_core/history";

const initialState={
    _id:"",
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
            _id:"",
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
        let user=loadState().user;
        const {name, surname, email, predictionRate, isPublic, isTrader,location, followers, following} = this.state;

        return(
            <Card style={{width: "100%", margin: 20, background: "rgba(255,255,255,0.15)"}}>

                <Card.Content>
                    <Card.Header style={{color: "#c9c9c9",fontSize:30}}>{name + " " + surname}</Card.Header>
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
                {
                    (user!==null&&user.loggedIn&&user._id===this.state._id)&&<Button onClick={()=>history.push("/profile/edit")}>Edit Profile</Button>

                }
            </Card>
        )
    }

}
export default ProfileCard;