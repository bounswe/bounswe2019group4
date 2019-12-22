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
    Dimmer, Dropdown
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {normalizeDate} from "../Events/Events";
import Loading from "../Loading";
class Create_Portfolio extends Component {

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
            dimmer:false,
            options: [
                { key: 'angular', text: 'Angular', value: 'angular' },
                { key: 'css', text: 'CSS', value: 'css' },
                { key: 'design', text: 'Graphic Design', value: 'design' },
                { key: 'ember', text: 'Ember', value: 'ember' },
                { key: 'html', text: 'HTML', value: 'html' },
                { key: 'ia', text: 'Information Architecture', value: 'ia' },
                { key: 'javascript', text: 'Javascript', value: 'javascript' },
                { key: 'mech', text: 'Mechanical Engineering', value: 'mech' },
                { key: 'meteor', text: 'Meteor', value: 'meteor' },
                { key: 'node', text: 'NodeJS', value: 'node' },
                { key: 'plumbing', text: 'Plumbing', value: 'plumbing' },
                { key: 'python', text: 'Python', value: 'python' },
                { key: 'rails', text: 'Rails', value: 'rails' },
                { key: 'react', text: 'React', value: 'react' },
                { key: 'repair', text: 'Kitchen Repair', value: 'repair' },
                { key: 'ruby', text: 'Ruby', value: 'ruby' },
                { key: 'ui', text: 'UI Design', value: 'ui' },
                { key: 'ux', text: 'User Experience', value: 'ux' },
            ],
            tradingEqs : [],
            isPrivate : false
        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
    }


    onSubmit=async ()=>{
        let {text,titletext,isPrivate, tradingEqs}=this.state;
        if(text!==""&&titletext!=="") {
            let param = {
                text: text,
                title: titletext,
                isPrivate : isPrivate,
                tradingEqs : tradingEqs
            };
            this.setState({editloading: true});
            await this.props.createPortfolio(param).then(async() => {
                this.setState({editloading: false, dimmer: true});
                setTimeout(() => {this.setState({dimmer: false});
                    history.push("/profile")
                }, 2000);
            })
        }else{
            alert("Title or text should not be empty!");
        }
    };

    onDropChange=(e,{value})=>{
        this.setState({tradingEqs:value},this.onDropdownsChange)
        //console.log(this.state.tradingEqs)
    };

    handleChangeChk = (e) =>{
        this.setState({isPrivate : !this.state.isPrivate})
    }


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
                                        Create new portfolio
                                    </Header>
                                ) :
                                (
                                    <Header style={{fontFamily: "timesnewroman"}}>
                                        Sign in to create an portfolio!
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

                                            <div style={{display:"flex",flexDirection:"row",alignItems:"center"}}>

                                                Trading Equipments

                                                <Dropdown
                                                    style={{marginLeft:5}}
                                                    placeholder='All'

                                                    multiple

                                                    selection
                                                    options={this.state.options}
                                                    onChange={this.onDropChange}

                                                />
                                                <div style={{marginLeft:41, marginRight: 14}}>     Do you want to make your Portfolio Private?     </div>
                                                <input style={{width: 20,height: 20}} type="checkbox" defaultChecked={this.state.isPrivate} onChange={this.handleChangeChk} />
                                            </div>

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
                                            Your portfolio has been created!
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
        createPortfolio:params=>dispatch(userActions.createPortfolio(params))
    };
};

export default connect(null, dispatchToProps)(Create_Portfolio);
