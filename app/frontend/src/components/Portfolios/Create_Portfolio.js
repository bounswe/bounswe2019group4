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
import {colorBG, colorPrimary} from "../../utils/constants/Colors";
import tradingEquipment from "../../utils/constants/tradingEquipment";
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
                { key: 'USD', text: 'USD', value: 'USD' },
                { key: 'TRY', text: 'TRY', value: 'TRY' },
                { key: 'EUR', text: 'EUR', value: 'EUR' },
                { key: 'AUD', text: 'AUD', value: 'AUD' },
                { key: 'CNY', text: 'CNY', value: 'CNY' },
                { key: 'HKD', text: 'HKD', value: 'HKD' },
                { key: 'INR', text: 'INR', value: 'INR' },
                { key: 'JPY', text: 'JPY', value: 'JPY' },
                { key: 'AED', text: 'AED', value: 'AED' },
                { key: 'BTC', text: 'BTC', value: 'BTC' },
                { key: 'ETH', text: 'ETH', value: 'ETH' },
                { key: 'XRP', text: 'XRP', value: 'XRP' },
                { key: 'LTC', text: 'LTC', value: 'LTC' },
                { key: 'GOOG', text: 'GOOG', value: 'GOOG' },
                { key: 'MSFT', text: 'MSFT', value: 'MSFT' },
                { key: 'AAPL', text: 'AAPL', value: 'AAPL' },
                { key: 'AMZN', text: 'AMZN', value: 'AMZN' },
                { key: 'FB', text: 'FB', value: 'FB' },
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
                definition: text,
                title: titletext,
                isPrivate : isPrivate,
                tradingEqs : tradingEqs
            };
            alert(JSON.stringify(param))
            this.setState({editloading: true});
            await this.props.createPortfolio(param).then(async() => {
                this.setState({editloading: false, dimmer: true});
                setTimeout(() => {this.setState({dimmer: false});
                    history.push("/profile")
                }, 2000);
            }).catch((e)=>{
                this.setState({editloading:false})
                alert(e)
            })
        }else{
            alert("Title or text should not be empty!");
        }
    };

    onDropChange=(e,{value})=>{
        this.setState({tradingEqs:value})
        //console.log(this.state.tradingEqs)
    };

    handleChangeChk = (e) =>{
        this.setState({isPrivate : !this.state.isPrivate})
    }


    render() {

        let user=this.state.user;
        let active=this.state.dimmer;
        return (


            <div style={{display:"flex",justifyContent:"center"}}>
                    <Segment style={{margin: 20,background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>



                            {user!=null && user.loggedIn?(
                                    <Header style={{fontFamily: "timesnewroman",color:"grey",fontSize:30}}>
                                        Create a New Portfolio
                                    </Header>
                                ) :
                                (
                                    <Header style={{fontFamily: "timesnewroman"}}>
                                        Sign in to create an portfolio!
                                    </Header>
                                )
                            }

                        <div style={{display:"flex",flexDirection:"row"}}>



                            {user!==null && user.loggedIn ? (
                                    <Dimmer.Dimmable dimmed={active}>
                                        <Form
                                            loading={this.state.editloading}
                                        >
                                            <Form.Field>
                                                <label style={{color:"white"}}>Title</label>
                                                <input style={{width:"50%"}} name={"name"} onChange={(item) => this.setState({
                                                    titletext: item.target.value
                                                })} value={this.state.titletext} placeholder='Title' />
                                            </Form.Field>

                                            <Form.Field>
                                                <label style={{color:"white"}}>Definition</label>
                                            <Form.TextArea

                                                style={{borderWidth: 1, borderColor: "gray"}}
                                                value={this.state.text}
                                                onChange={(item) => this.setState({
                                                    text: item.target.value
                                                })}
                                            />
                                            </Form.Field>

                                            <div style={{display:"flex",flexDirection:"row",alignItems:"center",color:"white"}}>

                                                Trading Equipments

                                                <Dropdown
                                                    style={{marginLeft:5}}
                                                    placeholder='All'
                                                    multiple
                                                    selection
                                                    search
                                                    options={tradingEquipment}
                                                    onChange={this.onDropChange}

                                                />
                                                <div style={{marginLeft:41, marginRight: 14,color:"white"}}>     Do you want to make your Portfolio Private?     </div>
                                                <input style={{width: 20,height: 20}} type="checkbox" defaultChecked={this.state.isPrivate} onChange={this.handleChangeChk} />
                                            </div>

                                            <Form.Button inverted style={{borderRadius:20,marginTop:20}} onClick={this.onSubmit}>Submit</Form.Button>
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





        )
    }
}

const dispatchToProps = dispatch => {
    return {
        createPortfolio:params=>dispatch(userActions.createPortfolio(params))
    };
};

export default connect(null, dispatchToProps)(Create_Portfolio);
