import React, {Component} from 'react';
import {Card} from 'semantic-ui-react';

class FriendsCard extends Component {
    constructor(props){
        super(props);
        this.state= {friends: []}
    }

    componentWillReceiveProps(props) {
        if(props.friends){
            this.setState({ friends: this.configureFriends(props.friends, props.following)});
        }
    }

    configureFriends(friends, following) {
         return friends.map(friend => {
             if(!following) {
                 return {header: friend.FollowingName + " " + friend.FollowingSurname}
             } else {
                 return {header: friend.FollowedName + " " + friend.FollowedSurname}
             }
         })
    }

    render() {
        const {friends} = this.state;
        return (
            <Card.Group items={friends} />
        )
    }
}

export default FriendsCard;