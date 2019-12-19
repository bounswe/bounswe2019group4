import React, {Component} from 'react';
import {colorBG, colorPrimary} from "../../utils/constants/Colors";
import {Form, Header, Radio, Segment, Checkbox, Dimmer} from "semantic-ui-react";
import * as userActions from "../../actions/userActions";
import {connect} from "react-redux";
import {loadState, saveState} from "../../_core/localStorage";
import history from "../../_core/history";
import LocationPicker from 'react-location-picker';

class EditProfile extends Component {

    state={
        user:{},
        all:{},
        loading:false,
        dimmer:false,
        location: ""
    };

    componentDidMount() {
        let user=loadState().user;
        if(user!==null&&user.loggedIn){
            this.setState({user,location:user.location},this.getProfile)

        }
        else{
            history.push("/home")
        }

    }

    getProfile=()=>{

        this.props.profile(this.state.user._id).then(result=>{
            this.setState({all:result.value})
        });
    };

    onChangeHandler=(e,value)=>{

        let iban=this.state.user.iban;
        if(e.target.id==="isTrader"&&!value.checked){
            iban=null;
        }

        this.setState({user:{...this.state.user,[e.target.id]:value.checked,iban:iban}})
    };
    onChangeHandler2=(e)=>{

        this.setState({user:{...this.state.user,[e.target.name]:e.target.value}})

    };
    handleSubmit=async()=>{
        this.setState({loading:true});
        let user={...this.state.user,location:this.state.location};
        await this.props.editProfile(user).then(()=>{
            this.props.changeUserState(user);
            this.setState({dimmer:true});
            setTimeout(()=>this.setState({dimmer:false}),2000);
        });
        this.setState({loading:false})

    };
    handleLocationChange ({ position, address, places }) {

            if (places.length === 1) {
                if(places[0]) {
                    this.setState({location: places[0]["formatted_address"]});
                }else{
                    this.setState({location:""});
                }
            } else {
                if(places[0]) {
                this.setState({location: places[places.length - 2]["formatted_address"].split(",")[0]});
                }else{
                this.setState({location:""});
            }
            }

    }

    render() {
        let active=this.state.dimmer;
        let user=this.state.user;
        return (
            <div style={{display:"flex",justifyContent:"center"}}>
            <Segment style={{margin: 20, width: "50%",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                <Header style={{color:"grey"}}>Edit Profile</Header>
                <div style={{display:"flex",flexDirection:"row"}}>
                    <div style={{width:"50%"}}>
                <Dimmer.Dimmable dimmed={active}>
                <Form loading={this.state.loading}>

                    <Form.Field>
                        <label style={{color:"white"}}>First Name</label>
                        <input name={"name"} onChange={this.onChangeHandler2} value={user.name} placeholder='First Name' />
                    </Form.Field>
                    <Form.Field>
                        <label style={{color:"white"}}>Last Name</label>
                        <input name={"surname"} onChange={this.onChangeHandler2} value={user.surname}  placeholder='Last Name' />
                    </Form.Field>
                    <Form.Field>
                        <label style={{color:"white"}}>Location</label>
                        <input name={"location"} disabled={true} onChange={this.onChangeHandler2} value={this.state.location} placeholder='Location' />
                    </Form.Field>
                    <Form.Field style={{color:"white",flexDirection:"row"}}>
                        <Checkbox id={"isPublic"} onChange={this.onChangeHandler} checked={user.isPublic} style={{marginRight:5}}  />
                        My account is public.
                    </Form.Field>

                    <Form.Field style={{color:"white",flexDirection:"row"}}>
                        <Checkbox id={"isTrader"} onChange={this.onChangeHandler} checked={user.isTrader} style={{marginRight:5}}  />
                        I am a trader.
                    </Form.Field>
                    {user.isTrader &&
                    <Form.Field>
                        <label style={{color: "white"}}>IBAN</label>
                        <input name={"iban"} onChange={this.onChangeHandler2} value={user.iban} placeholder='IBAN'/>
                    </Form.Field>
                    }
                    <Form.Button inverted style={{borderRadius:20,marginTop:20}} onClick={this.handleSubmit}>Edit</Form.Button>
                </Form>
                    <Dimmer
                        active={active}
                        onClickOutside={this.handleHide}
                    >
                        Your profile details has been edited!
                    </Dimmer>
                </Dimmer.Dimmable>
                    </div>
                    <div style={{marginLeft:40,width:"40%"}} >
                        <LocationPicker
                            containerElement={ <div style={ {height: '100%'} } /> }
                            mapElement={ <div style={ {height: '400px'} } /> }
                            zoom={5}
                            defaultPosition={{lat: 41.0082, lng: 28.9784}}
                            onChange={this.handleLocationChange.bind(this)}

                        />


                    </div>

                </div>

            </Segment>
            </div>
        );
    }
}

const dispatchToProps = dispatch => {
    return {
        profile: params => dispatch(userActions.profile(params)),
        editProfile:params => dispatch(userActions.editProfile(params)),
        changeUserState:params=>dispatch(userActions.changeUserState(params))

    };
};

export default connect(null, dispatchToProps)(EditProfile);
