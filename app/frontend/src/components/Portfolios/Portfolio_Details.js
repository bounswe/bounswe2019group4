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
    Dimmer
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import {normalizeDate} from "../Events/Events";
import Portfolio_photo from "../../assets/Portfolio_photo.png"
import Loading from "../Loading";
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
            dimmer:false
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

        await this.props.portfolio("/"+this.props.match.params.id).then(async result=> {
                let newportfolio=result.value;
                this.setState({portfolio:newportfolio,text:newportfolio.text,titletext:newportfolio.title,tradingEqs:newportfolio.tradingEqs})

            }
        )

    }

    onSubmit=async ()=>{

        let param={
            text:this.state.text,
            title:this.state.titletext
        };
        this.setState({editloading:true});
        await this.props.editPortfolio("/"+this.state.Portfolio._id,param).then(()=>{
            this.setState({editloading:false});
            this.setState({dimmer:true});
            setTimeout(()=>this.setState({dimmer:false}),2000);

        })

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
