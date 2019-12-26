import React, {Component} from 'react';
import {loadState} from '../../_core/localStorage'
import {
    Header,
    Segment,
    Form,
    Button,
    List,
    Dimmer, Dropdown
} from 'semantic-ui-react';
import {connect} from 'react-redux';
import * as userActions from '../../actions/userActions';
import Loading from "../Loading";
import history from "../../_core/history";
import {colorBG, colorPrimary} from "../../utils/constants/Colors";
import tradingEquipment from "../../utils/constants/tradingEquipment";

class Portfolio_Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {},
            loading: false,
            rest: 1000,
            text: "",
            titletext: "",
            editloading: false,
            ratesubmitted: false,
            dimmer: false,
            options: [
                {key: 'USD', text: 'USD', value: 'USD'},
                {key: 'TRY', text: 'TRY', value: 'TRY'},
                {key: 'EUR', text: 'EUR', value: 'EUR'},
                {key: 'AUD', text: 'AUD', value: 'AUD'},
                {key: 'CNY', text: 'CNY', value: 'CNY'},
                {key: 'HKD', text: 'HKD', value: 'HKD'},
                {key: 'INR', text: 'INR', value: 'INR'},
                {key: 'JPY', text: 'JPY', value: 'JPY'},
                {key: 'AED', text: 'AED', value: 'AED'},
                {key: 'BTC', text: 'BTC', value: 'BTC'},
                {key: 'ETH', text: 'ETH', value: 'ETH'},
                {key: 'XRP', text: 'XRP', value: 'XRP'},
                {key: 'LTC', text: 'LTC', value: 'LTC'},
                {key: 'GOOG', text: 'GOOG', value: 'GOOG'},
                {key: 'MSFT', text: 'MSFT', value: 'MSFT'},
                {key: 'AAPL', text: 'AAPL', value: 'AAPL'},
                {key: 'AMZN', text: 'AMZN', value: 'AMZN'},
                {key: 'FB', text: 'FB', value: 'FB'},
            ],
            tradingEqs: [],
            isPrivate: false,
            trEq: [],
            followed: "FALSE"
        }
    }


    async componentDidMount() {

        const localState = loadState();
        this.setState({user: localState.user});
        await this.getPortfolio();
    }

    componentDidUpdate(props) {
        if (props.match.params.id !== this.props.match.params.id) {
            this.getPortfolio();
        }
    }


    async getPortfolio() {

        await this.props.getPortfolio("/" + this.props.match.params.id).then(async result => {

                let newportfolio = result.value.portfolio;
                this.setState({portfolio: newportfolio, trEq: result.value.tradingEqs, followed: result.value.followStatus})

            }
        )

    }

    onDropChange = (e, {value}) => {
        this.setState({trEq: value})
    };
    onChange = (e) => {
        let val = e.target.value;
        if (e.target.name === "isPrivate") {
            val = e.target.checked;
        }
        this.setState({portfolio: {...this.state.portfolio, [e.target.name]: val}})
    };

    onSubmit = async () => {
        let {portfolio, trEq} = this.state;
        if (portfolio.title.trim() !== "" && portfolio.definition.trim() !== "") {
            let param = {
                definition: portfolio.definition,
                title: portfolio.title,
                isPrivate: portfolio.isPrivate,
                tradingEqs: trEq
            };
            this.setState({editloading: true});
            await this.props.editPortfolio("/" + portfolio._id, param).then(async () => {
                this.setState({editloading: false, dimmer: true});
                setTimeout(() => {
                    this.setState({dimmer: false});
                    history.push("/profile")
                }, 2000);
            })
        } else {
            alert("Title or definition should not be empty!");
        }
    };

    deletePortfolio = async () => {
        await this.props.deletePortfolio("/" + this.state.portfolio._id).then(() => {
            history.push("/profile");
        }).catch(e => alert("Portfolio could not be deleted!"))

    };

    follow = async () => {
        await this.props.followPortfolio("/" +
            this.state.portfolio._id + "/" +
            (this.state.followed === "TRUE" ? "unfollow" : "follow")).then(() => {

            this.getPortfolio();
        })
    };

    render() {
        const portfolio = this.state.portfolio;
        let user = this.state.user;
        let active = this.state.dimmer;
        return (

            portfolio ? (


                <div style={{display: "flex", justifyContent: "center"}}>
                    {user !== null && portfolio.userId !== user._id ?
                        <Segment style={{
                            margin: 20,
                            width: "50%",
                            background: colorBG,
                            borderColor: colorPrimary,
                            borderRadius: 20,
                            borderWidth: 1.5
                        }}>
                            <Header style={{color: "grey", marginBottom: 50, textAlign: "left"}}>{portfolio.title}<span
                                style={{fontSize: 15}}> by <u style={{cursor: "pointer"}}
                                                              onClick={() => history.push("/profile/" + portfolio.userId)}>{portfolio.username}</u></span><Button
                                style={{float: "right"}} basic color="blue"
                                onClick={this.follow}>{this.state.followed === "TRUE" ? "Unfollow" : "Follow"}</Button></Header>


                            <Segment style={{backgroundColor: "grey", color: "white", marginBottom: 50}}>
                                {portfolio.definition}
                            </Segment>
                            <Segment textAlign="left" style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                borderWidth: 0.5,
                                borderRadius: 10,
                                borderColor: "lightgrey",
                                backgroundColor: colorBG
                            }}>
                                <Header style={{color: "white", borderWidth: 1, borderColor: "lightgrey"}}>Trading
                                    Equipment</Header>
                                <Segment style={{backgroundColor: colorBG}}>
                                    <List relaxed>

                                        {
                                            this.state.trEq.map(item => {

                                                return (
                                                    <List.Item onClick={() => history.push({
                                                        pathname: "/trading-equipment",
                                                        state: {currency: item}
                                                    })} style={{color: "white", cursor: "pointer"}}>
                                                        <List.Icon
                                                            name={tradingEquipment.find(x => x.value === item).icon}/>
                                                        <List.Content>{item === "EUR" ? (item + "/USD") : (item + "/EUR")}</List.Content>
                                                    </List.Item>
                                                )

                                            })

                                        }
                                    </List>
                                </Segment>
                            </Segment>
                        </Segment> :
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <Segment style={{
                                margin: 20,
                                background: colorBG,
                                borderColor: colorPrimary,
                                borderRadius: 20,
                                borderWidth: 1.5
                            }}>

                                <Header style={{fontFamily: "timesnewroman", color: "grey", fontSize: 30}}>
                                    Update Portfolio
                                </Header>


                                <div style={{display: "flex", flexDirection: "row"}}>


                                    {user !== null && user.loggedIn ? (
                                            <Dimmer.Dimmable dimmed={active}>
                                                <Form
                                                    loading={this.state.editloading}
                                                >
                                                    <Form.Field>
                                                        <label style={{color: "white"}}>Title</label>
                                                        <input style={{width: "50%"}} name={"title"}
                                                               onChange={this.onChange} value={portfolio.title}
                                                               placeholder='Title'/>
                                                    </Form.Field>

                                                    <Form.Field>
                                                        <label style={{color: "white"}}>Definition</label>
                                                        <Form.TextArea
                                                            name={"definition"}
                                                            style={{borderWidth: 1, borderColor: "gray"}}
                                                            value={portfolio.definition}
                                                            onChange={this.onChange}
                                                        />
                                                    </Form.Field>

                                                    <div style={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        alignItems: "center",
                                                        color: "white"
                                                    }}>

                                                        Trading Equipments

                                                        <Dropdown
                                                            style={{marginLeft: 5}}
                                                            placeholder='All'
                                                            multiple
                                                            selection
                                                            search
                                                            options={tradingEquipment}
                                                            onChange={this.onDropChange}
                                                            value={this.state.trEq}

                                                        />
                                                        <div style={{marginLeft: 41, marginRight: 14, color: "white"}}> Do
                                                            you want to make your Portfolio Private?
                                                        </div>
                                                        <input name={"isPrivate"} style={{width: 20, height: 20}}
                                                               type="checkbox" defaultChecked={portfolio.isPrivate}
                                                               onChange={this.onChange}/>
                                                    </div>

                                                    <Form.Button inverted style={{borderRadius: 20, marginTop: 20}}
                                                                 onClick={this.onSubmit}>Submit</Form.Button>
                                                    <Form.Button color={"red"} style={{borderRadius: 20, marginTop: 20}}
                                                                 onClick={this.deletePortfolio}>Delete
                                                        Portfolio</Form.Button>
                                                </Form>
                                                <Dimmer
                                                    active={active}
                                                    onClickOutside={this.handleHide}
                                                >
                                                    Your portfolio has been updated!
                                                </Dimmer>
                                            </Dimmer.Dimmable>
                                        )
                                        : null
                                    }

                                </div>

                            </Segment>
                        </div>

                    }
                </div>


            ) : (<Loading/>)


        )
    }
}

const dispatchToProps = dispatch => {
    return {
        getPortfolio: params => dispatch(userActions.getPortfolioDetails(params)),
        userInformation: params => dispatch(userActions.users(params)),
        editPortfolio: (path, params) => dispatch(userActions.editPortfolio(path, params)),
        deletePortfolio: (path) => dispatch(userActions.deletePortfolio(path)),
        followPortfolio: path => dispatch(userActions.followPortfolio(path))
    };
};

export default connect(null, dispatchToProps)(Portfolio_Details);
