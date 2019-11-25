import React, {Component} from 'react';
import history from "../../_core/history";
import {loadState} from '../../_core/localStorage'
import {
    Header,
    Segment,
    Table,
    Comment,
    Form,
    Button,
    Card,
    Divider,
    Grid,
    Rating,
    List,
    Popup,
    Image,
    Icon,
    Label,
    Dimmer
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {normalizeDate} from "../Events/Events";
import Loading from "../Loading";
class Create_Article extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            loading:false,
            rest:1000,
            text:"",
            titletext:"",
            editloading:false,
            ratesubmitted:false,
            dimmer:false
        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
    }


    onSubmit=async ()=>{
       let {text,titletext}=this.state;
        if(text!==""&&titletext!=="") {
            let param = {
                text: text,
                title: titletext
            };
            this.setState({editloading: true});
            await this.props.createArticle(param).then(async() => {
                this.setState({editloading: false, dimmer: true});
                setTimeout(() => this.setState({dimmer: false}), 2000);
                //history.push("/profile")
            })
        }else{
            alert("Title or text should not be empty!");
        }
    };

    render() {

        let user=this.state.user;
        let active=this.state.dimmer;
        return (


                <div style={{display:"flex",flex:1,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                            <div style={{display:"flex",width:"80%"}}>
                                <Segment raised piled padded compact style={{display:"flex",flex:1,flexDirection:"column",alignItems:"center"}}>
                                    <div style={{margin:20,fontFamily:"timesnewroman",fontSize:15,width:"80%"}}>

                                        {user && user.loggedIn?(
                                                <Header style={{fontFamily: "timesnewroman",color:"grey",fontSize:30}}>
                                                    Create new article
                                                </Header>
                                            ) :
                                            (
                                                <Header style={{fontFamily: "timesnewroman"}}>
                                                    Sign in to create an article!
                                                </Header>
                                            )
                                        }




                                        {user && user.loggedIn ? (
                                                <Dimmer.Dimmable dimmed={active}>
                                                    <Form
                                                        loading={this.state.editloading}
                                                    >
                                                        <Form.TextArea
                                                            label={"Title"}
                                                            style={{borderWidth: 1, borderColor: "gray"}}
                                                            value={this.state.titletext}
                                                            onChange={(item) => this.setState({
                                                                titletext: item.target.value
                                                            })}
                                                        />
                                                        <Form.TextArea
                                                            label={"Text"}
                                                            style={{borderWidth: 1, borderColor: "gray",height:300}}
                                                            value={this.state.text}
                                                            onChange={(item) => this.setState({
                                                                text: item.target.value
                                                            })}
                                                        />

                                                        <div style={{display: "flex", flex: 1}}>
                                                            <div style={{display: "flex", flexDirection: "row", flex: 3}}/>
                                                            <div style={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                justifyContent: "center",
                                                                flex: 3
                                                            }}>

                                                                <Button onClick={this.onSubmit} content='Submit'
                                                                        labelPosition='left'
                                                                        icon={'edit'}
                                                                        basic color={"black"}
                                                                />
                                                            </div>
                                                            <div style={{
                                                                fontSize: 14,
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                justifyContent: "flex-end",
                                                                alignItems: "flex-start",
                                                                flex: 3
                                                            }}>

                                                            </div>
                                                        </div>
                                                    </Form>
                                                    <Dimmer
                                                        active={active}
                                                        onClickOutside={this.handleHide}
                                                    >
                                                        Your article has been created!
                                                    </Dimmer>
                                                </Dimmer.Dimmable>
                                            )
                                            : null
                                        }
                                    </div>
                                </Segment>
                </div>

                </div>




        )
    }
}

const dispatchToProps = dispatch => {
    return {
        createArticle:params=>dispatch(userActions.createArticle(params))
    };
};

export default connect(null, dispatchToProps)(Create_Article);
