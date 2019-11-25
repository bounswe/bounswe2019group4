import React, {Component} from 'react';
import {Segment, Table, Grid, Dropdown, Button} from 'semantic-ui-react';
import {connect} from 'react-redux';
import CandleStickChart from "./TEqChart";
import { timeParse } from "d3-time-format";
import tradingEquipmentList from "../../utils/constants/tradingEquipment";

import authService from "../../factories/authFactory";


import * as tradingEquipmentActions from '../../actions/tradingEquipmentActions';

class TradingEquipment extends Component {

    constructor(props) {
        super(props);
        this.state = {tradingEquipment: [], selectedTE: "TRY"};
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
            this.setState({selectedTE: currentCurrency, tradingEquipment: result[0].action.payload.currencies, teDetail: this.parseData(result[1].action.payload.values.reverse()), convertedCurrency: result[1].action.payload.current.to, following: result[1].action.payload.following});
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
            this.setState({selectedTE: data.value, teDetail: this.parseData(result.action.payload.values.reverse()), convertedCurrency: result.action.payload.current.to, following: result.action.payload.following});
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

    render() {
        const {tradingEquipment, teDetail, selectedTE, convertedCurrency, following} = this.state;
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
                                    <Table.Cell>{tEq.rate}</Table.Cell>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
                    </Segment>
                </Grid.Column>
                <Grid.Column width={12}>
                    <Segment textAlign={"left"}>
                        <Grid>
                        <Grid.Row>
                            <Grid.Column width={14}>
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
                                {authService.isUserLoggedIn() && (!following ? <Button basic color="green" onClick={this.follow.bind(this)}> + Follow</Button> : <Button basic color="red" onClick={this.follow.bind(this)}> - Unfollow</Button>)}
                            </Grid.Column>
                        </Grid.Row>
                        </Grid>
                {teDetail && <CandleStickChart type="hybrid" data={teDetail} convertedCurrency={convertedCurrency} />}
                    </Segment>
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
        unfollowTEq: params => dispatch(tradingEquipmentActions.unfollowTEq(params))
    }
};

export default connect(null, dispatchToProps)(TradingEquipment);