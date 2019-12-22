import React, {Component} from 'react';
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
import Portfolio_photo from "../../assets/Portfolio_photo.png"
import Loading from "../Loading";
import history from "../../_core/history";
class Portfolio_Details extends Component {

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
            tradingEqs:[],
            isPrivate:false
        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getPortfolio();
        //await this.getRating();
    }

    componentDidUpdate(props) {
        if(props.match.params.id !== this.props.match.params.id) {
            this.getPortfolio();
        }
    }


    async getPortfolio(){

        await this.props.getPortfolio("/"+this.props.match.params.id).then(async result=> {
                let newportfolio=result.value;
                this.setState({portfolio:newportfolio,text:newportfolio.text,titletext:newportfolio.title,tradingEqs:newportfolio.tradingEqs,isPrivate:newportfolio.isPrivate})

            }
        )

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

    render() {
        const Portfolio  = this.state.Portfolio;
        let user=this.state.user;
        let active=this.state.dimmer;
        return (

            Portfolio?(
                <div style={{display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <div style={{width:"100%"}}>
                        <Grid>

                            <Grid.Column width={4} >
                                <Segment  textAlign="left" style={{marginRight:50,marginLeft:20,display:"flex",flexDirection:"column",alignItems:"center",borderWidth:2,borderRadius:10,backgroundColor:"#f9f9f9"}}>
                                    {<Image size="medium" src={Portfolio_photo} />}

                                    <List relaxed>
                                        <List.Item>
                                            <List.Icon name={"user"}/>
                                            <List.Content>
                                                <a href={"/profile/"+Portfolio.userId}>{Portfolio.username+" "+Portfolio.usersurname}</a>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item>
                                            <List.Icon name={"calendar alternate"}/>
                                            <List.Content>
                                                {normalizeDate(Portfolio.date)}
                                            </List.Content>
                                        </List.Item>

                                    </List>

                                </Segment>
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Segment raised piled padded compact style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                    <div style={{margin:20,fontFamily:"timesnewroman",fontSize:15,width:"80%"}}>

                                        {user && user.loggedIn&&Portfolio.userId===user._id ? (
                                                <Header style={{fontFamily: "timesnewroman"}}>
                                                    Edit your Portfolio
                                                </Header>
                                            ) :
                                            (
                                                <Header style={{fontFamily: "timesnewroman"}}>
                                                    {Portfolio.title}
                                                </Header>
                                            )
                                        }




                                        {user && user.loggedIn&&Portfolio.userId===user._id ? (
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
                                                            style={{borderWidth: 1, borderColor: "gray"}}
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
                                                        Your Portfolio has been edited!
                                                    </Dimmer>
                                                </Dimmer.Dimmable>
                                            )
                                            : (
                                                <p>
                                                    {Portfolio.text}
                                                </p>

                                            )
                                        }
                                    </div>
                                </Segment>
                            </Grid.Column>

                        </Grid>


                    </div>

                </div>

            ):(<Loading/>)



        )
    }
}

const dispatchToProps = dispatch => {
    return {
        Portfolio: params => dispatch(userActions.getPortfolioDetails(params)),
        userInformation:params=>dispatch(userActions.users(params)),
        editPortfolio:(path,params)=>dispatch(userActions.editPortfolio(path,params))
    };
};

export default connect(null, dispatchToProps)(Portfolio_Details);
