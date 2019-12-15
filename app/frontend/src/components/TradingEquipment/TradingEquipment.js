import React, {Component} from 'react';
import {Segment, Table, Grid, Dropdown, Button, Icon, Label} from 'semantic-ui-react';
import {connect} from 'react-redux';
import CandleStickChart from "./TEqChart";
import { timeParse } from "d3-time-format";
import tradingEquipmentList from "../../utils/constants/tradingEquipment";

import Comments from "../Comments"
import authService from "../../factories/authFactory";


import * as tradingEquipmentActions from '../../actions/tradingEquipmentActions';

class TradingEquipment extends Component {

    constructor(props) {
        super(props);
        this.state = {tradingEquipment: [], selectedTE: "TRY",comments:[],numUp:0,numDown:0};
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
            this.setState({selectedTE: currentCurrency,currval:result[1].action.payload.current.rate,
                numUp:result[1].action.payload.numberOfUps,numDown:result[1].action.payload.numberOfDowns,
                yourVote:result[1].action.payload.yourPrediction, tradingEquipment: result[0].action.payload.currencies,
                teDetail: this.parseData(result[1].action.payload.values.reverse()), comments: result[1].action.payload.comments,
                convertedCurrency: result[1].action.payload.current.to, following: result[1].action.payload.following});
        })
    }

    componentWillReceiveProps(nextProps,nextContext) {
        if(nextProps.location.state && nextProps.location.state.currency !== this.state.selectedTE) {
            this.onChange({},{value: nextProps.location.state.currency});
        }
    }

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
            this.setState({selectedTE: data.value,currval:result.action.payload.current.rate,numUp:result.action.payload.numberOfUps,numDown:result.action.payload.numberOfDowns, comments: result.action.payload.comments, teDetail: this.parseData(result.action.payload.values.reverse()), convertedCurrency: result.action.payload.current.to, following: result.action.payload.following,yourVote:result.action.payload.yourPrediction});
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

    render() {

        const loggedin=authService.isUserLoggedIn();
        const {tradingEquipment, teDetail, selectedTE, convertedCurrency, following,yourVote} = this.state;
        return (
            <Grid columns={2} divided>
            <Grid.Row>
                <Grid.Column width={4}>
                    <Segment textAlign={"center"}>
                <Table basic="very" celled >
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
                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <div style={{display:"flex",flexDirection:"column"}}>
                    <Segment textAlign={"left"}>
                        <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                        <Dropdown
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
                            <Grid.Column width={2}>
                                {loggedin && (!following ? <Button basic color="green" onClick={this.follow.bind(this)}> + Follow</Button> : <Button basic color="red" onClick={this.follow.bind(this)}> - Unfollow</Button>)}
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>

                {teDetail && <CandleStickChart type="hybrid" data={teDetail} convertedCurrency={convertedCurrency} />}

                    </Segment>
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
        predictTE:params=>dispatch(tradingEquipmentActions.predictTE(params))
    }
};

export default connect(null, dispatchToProps)(TradingEquipment);