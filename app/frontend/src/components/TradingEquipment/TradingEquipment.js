import React, {Component} from 'react';
import {Segment, Table, Grid, Dropdown, Button, Icon, Label, Popup,Form,Radio,Checkbox} from 'semantic-ui-react';
import {connect} from 'react-redux';
import CandleStickChart from "./TEqChart";
import { timeParse } from "d3-time-format";
import tradingEquipmentList from "../../utils/constants/tradingEquipment";

import Comments from "../Comments"
import authService from "../../factories/authFactory";


import * as tradingEquipmentActions from '../../actions/tradingEquipmentActions';
import {loadState} from "../../_core/localStorage";

class TradingEquipment extends Component {

    constructor(props) {
        super(props);
        this.state = {tradingEquipment: [], selectedTE: "TRY",comments:[],numUp:0,numDown:0, vote: "noVote",alerttext:"",value:"lower",alerts:[],showAll:false};
    }

    componentWillMount() {
        const promises = [];
        promises.push(this.props.getTradingEquipment());
        let currentCurrency = "TRY";
        if(this.props.location.state && this.props.location.state.currency) {
            currentCurrency = this.props.location.state.currency;
        }
        promises.push(this.props.getTradingEquipmentDetail({currency: currentCurrency}));

        Promise.all(promises).then(result => {
            this.setState({selectedTE: currentCurrency,currval:result[1].action.payload.current.rate,alerttext:result[1].action.payload.current.rate,
                numUp:result[1].action.payload.numberOfUps,numDown:result[1].action.payload.numberOfDowns,
                yourVote:result[1].action.payload.yourPrediction, tradingEquipment: result[0].action.payload.currencies,
                teDetail: this.parseData(result[1].action.payload.values.reverse()), comments: result[1].action.payload.comments,
                convertedCurrency: result[1].action.payload.current.to, following: result[1].action.payload.following});
        });
        if(loadState().user!=null&&loadState().user.loggedIn) {
            this.getAlerts();
        }
    }

    componentWillReceiveProps(nextProps,nextContext) {
        if(nextProps.location.state && nextProps.location.state.currency !== this.state.selectedTE) {
            this.onChange({},{value: nextProps.location.state.currency});
        }
    }
    getAlerts=async()=>{
        this.props.getAlerts().then(result=>{
            this.setState({alerts:result.value.alerts.reverse()});
        });
    };

    parseData(data) {
        const parseDate = timeParse("%Y-%m-%d");
        return data.map(d=> {
            return {
                ...d,
                date: parseDate(d.Date),
                open: +d.open,
                high:  +d.high,
                low: +d.low,
                close: +d.close
            }
        })
    }

    onChange(e, data) {
        this.props.getTradingEquipmentDetail({currency: data.value}).then(result => {
            this.setState({selectedTE: data.value,currval:result.action.payload.current.rate,alerttext:result.action.payload.current.rate,numUp:result.action.payload.numberOfUps,numDown:result.action.payload.numberOfDowns, comments: result.action.payload.comments, teDetail: this.parseData(result.action.payload.values.reverse()), convertedCurrency: result.action.payload.current.to, following: result.action.payload.following,yourVote:result.action.payload.yourPrediction});
        })
    }

    follow() {
        const { following, selectedTE } = this.state;
        if(!following) {
            this.props.followTEq({tEq: selectedTE}).then(result => {
                this.props.getTradingEquipmentDetail({currency: selectedTE}).then(res => {
                    this.setState({following: res.action.payload.following})
                })
            })
        } else {
            this.props.unfollowTEq({tEq: selectedTE}).then(result => {
                this.props.getTradingEquipmentDetail({currency: selectedTE}).then(res => {
                    this.setState({following: res.action.payload.following})
                })
            })
        }
    }

    predict=async(up)=>{

       // alert(this.state.numDown)
        let c;
        if(up===1){
            c={
                value: this.state.currval,
                prediction: "up",
                tEq: this.state.selectedTE
            }
        }else{
            c={
                value: this.state.currval,
                prediction: "down",
                tEq: this.state.selectedTE
            }
        }
        await this.props.predictTE(c).then(()=>{
            this.onChange({},{value:this.state.selectedTE});

        });

    };
    handleChange = (e, { value }) => this.setState({ value })
handleAlertChange=(value)=>{

    this.setState({alerttext:value.target.value});
}

setAlert=async()=>{
        if(this.state.alerttext.trim()!=="") {
            let params = {
                currency: this.state.selectedTE,
                rate: parseFloat(this.state.alerttext),
                compare: this.state.value
            };
            this.props.setAlert(params).then(() => {
                this.getAlerts();
                alert("New alert is set!")
            });
        }else{
            alert("Please set a limit for the alert.")
        }
};
    deleteAlert=async(id)=>{
        this.props.deleteAlert(id).then(()=>{
            this.getAlerts();
        });
    };
    showAllAlerts=()=>{
        this.setState({showAll:!this.state.showAll})
    }

    render() {

        const loggedin=authService.isUserLoggedIn();
        const {tradingEquipment, teDetail, selectedTE, convertedCurrency, following,yourVote,currval} = this.state;
        return (
            <Grid columns={2} divided>
            <Grid.Row>
                <Grid.Column width={3} style={{margin: 20}}>
                <Table basic="very" celled inverted style={{background: "#161C1D"}} >
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Parity</Table.HeaderCell>
                            <Table.HeaderCell>Rate</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {tradingEquipment.map(tEq => {
                            return (
                                <Table.Row>
                                    <Table.Cell>{tEq.from + "/" + tEq.to}</Table.Cell>

                                    <Table.Cell>{tEq.rate}
                                        <div style={{fontSize:12}}>
                                        {
                                            tEq.status==="up"?<Icon  color={"green"} name={"arrow up"}/>:
                                                tEq.status==="down"?<Icon color={"red"} name={"arrow down"}/>:
                                                    <Icon name={"arrows alternate horizontal"}/>
                                        }
                                           {tEq.change?("%"+parseFloat(tEq.change).toFixed(2)):"No info"}
                                        </div>

                                    </Table.Cell>

                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                </Grid.Column>
                <Grid.Column width={12} style={{margin: 20}}>
                    <div style={{display:"flex",flexDirection:"column"}}>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={5}>
                                    <Dropdown
                                        style={{background: "rgba(255,255,255,0.2)", color: "#FFFFFF"}}
                                        placeholder='Select Currency'
                                        fluid
                                        search
                                        selection
                                        value={selectedTE}
                                        options={tradingEquipmentList}
                                        onChange={this.onChange.bind(this)}
                                        renderLabel={item =>  item.value + "/" + item.text}
                                    />
                                </Grid.Column>
                                {loadState().user !== null && loadState().user.loggedIn &&
                                <Grid.Column width={1}>

                                    <Popup trigger={
                                        <Button>
                                            <Icon name={"bell"}/>
                                        </Button>
                                    } on={"click"}
                                           position='bottom center'
                                    >
                                        <Form>

                                            <Form.Field>
                                                Alert me
                                                when <b>{this.state.selectedTE + "/" + (this.state.selectedTE === "EUR" ? "USD" : "EUR")}</b> has
                                                rate
                                            </Form.Field>
                                            <Form.Field>
                                                <Radio
                                                    label='Lower'
                                                    name='radioGroup'
                                                    value="lower"
                                                    checked={this.state.value === "lower"}
                                                    onChange={this.handleChange}
                                                />
                                            </Form.Field>
                                            <Form.Field>
                                                <Radio
                                                    label='Higher'
                                                    name='radioGroup'
                                                    value="higher"
                                                    checked={this.state.value === "higher"}
                                                    onChange={this.handleChange}
                                                />
                                            </Form.Field>
                                            <Form.Field label='than' control='input' type='number' step={0.01}
                                                        value={this.state.alerttext} onChange={this.handleAlertChange}/>
                                            <Form.Button onClick={this.setAlert}>Set Alert</Form.Button>
                                        </Form>

                                    </Popup>

                                </Grid.Column>
                                }
                                {loadState().user !== null && loadState().user.loggedIn &&
                                <Grid.Column width={2}>
                                    <Popup trigger={
                                        <Button>My Alerts</Button>
                                    } on={"click"}
                                           position='bottom center'

                                    >
                                        <Checkbox label={"Show All"} checked={this.state.showAll}
                                                  onChange={this.showAllAlerts}/>
                                        <div style={{overflowY: "auto", maxHeight: 300}}>
                                            {
                                                this.state.alerts.map(item => {
                                                        if (this.state.showAll || item.currency === this.state.selectedTE) {
                                                            return (
                                                                <Segment style={{
                                                                    display: "flex",
                                                                    flexDirection: "row",
                                                                    margin: 10,
                                                                    borderWidth: 1,
                                                                    borderRadius: 10,
                                                                    borderColor: "black"
                                                                }}>
                                                                    <div style={{width: 300, marginRight: 20}}>
                                                                        <h5>Alert
                                                                            when {item.currency}/{item.currency === "EUR" ? "USD" : "EUR"} is {item.compare} than {item.rate}</h5>
                                                                    </div>
                                                                    <Button size={"mini"} color={"red"}
                                                                            onClick={() => this.deleteAlert(item._id)}>X</Button>
                                                                </Segment>)
                                                        } else {
                                                            return null
                                                        }
                                                    }
                                                )

                                            }
                                        </div>

                                    </Popup>

                                </Grid.Column>
                                }
                                <Grid.Column width={2}>
                                    <Button as='div' labelPosition='right'>
                                        <Button disabled={!loggedin} color='red' onClick={()=>this.predict(0)}>
                                            <div style={{display:"flex",flexDirection:"row"}}>
                                                <Icon name={"arrow down"}/>
                                                {loggedin&&yourVote==="down"&&<Icon name={"check circle outline"} />}
                                            </div>
                                        </Button>
                                        <Label as='a' basic color='#396D7C' pointing='left'>
                                            <Icon color={"grey"} size={"large"}
                                                  style={{marginRight: 3}} name={"users"}/>
                                            {this.state.numDown}
                                        </Label>
                                    </Button>
                                </Grid.Column>
                                <Grid.Column width={2}>

                                    <Button as='div' labelPosition='left'>

                                        <Label as='a' basic color='#396D7C' pointing='right'>
                                            <Icon color={"grey"} size={"large"}
                                                  style={{marginRight: 3}} name={"users"}/>
                                            {this.state.numUp}
                                        </Label>
                                        <Button disabled={!loggedin} color='green' onClick={()=>this.predict(1)}>
                                            <div style={{display:"flex",flexDirection:"row"}}>
                                                <Icon name={"arrow up"}/>
                                                {loggedin&&yourVote==="up"&&<Icon name={"check circle outline"} />}
                                            </div>
                                        </Button>
                                    </Button>
                                </Grid.Column>
                                <Grid.Column width={3} style={{display:"flex",flexDirection:"row",justifyContent:"center"}}>
                                    {loggedin && (!following ? <Button basic color="green" onClick={this.follow.bind(this)}> + Follow</Button> : <Button basic color="red" onClick={this.follow.bind(this)}> - Unfollow</Button>)}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        {teDetail && <div style={{textAlign: "left"}}><CandleStickChart type="hybrid" data={teDetail} convertedCurrency={convertedCurrency} /></div>}
                        <Comments type={"trading-equipment"} _id={this.state.selectedTE} resendComments={this.onChange.bind(this,{},{value:this.state.selectedTE})} data={this.state.comments}/>
                    </div>
                </Grid.Column>
            </Grid.Row>
            </Grid>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        getTradingEquipment: () => dispatch(tradingEquipmentActions.getTEquipment()),
        getTradingEquipmentDetail: params => dispatch(tradingEquipmentActions.getTEquipmentDetails(params)),
        followTEq: params => dispatch(tradingEquipmentActions.followTEq(params)),
        unfollowTEq: params => dispatch(tradingEquipmentActions.unfollowTEq(params)),
        predictTE:params=>dispatch(tradingEquipmentActions.predictTE(params)),
        setAlert:params=>dispatch(tradingEquipmentActions.setAlert(params)),
        getAlerts:params=>dispatch(tradingEquipmentActions.getAlerts(params)),
        deleteAlert:params=>dispatch(tradingEquipmentActions.deleteAlert(params))
    }
};

export default connect(null, dispatchToProps)(TradingEquipment);