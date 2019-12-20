import React,{Component} from "react";
import {Segment, Grid, List, Header, Dropdown, Input, Button, Label, Radio, Divider} from "semantic-ui-react";
import {connect} from "react-redux";
import moment from "moment";
import _ from "lodash";

import Loading from "../Loading";
import {loadState} from "../../_core/localStorage";
import * as investmentActions from "../../actions/investmentActions";

import tradingEquipment from "../../utils/constants/tradingEquipment";

class Investments extends Component {
    constructor(props) {
        super(props);
        const initialState = loadState();
        this.state = { user: initialState.user, currency: "USD", buySellType: "buy", exchangeResult: 0, buySellAmount: 0, aboveOrBelow: "HIGHER", orderRate: 0, orders: []};
    }

    componentDidMount() {
        const promises = [];
        promises.push(this.props.getInvestments());
        promises.push(this.props.getOrders());

       Promise.all(promises).then(result => {
            this.setState({
                investments: result[0].action.payload,
                orderRate: parseFloat(_.find(result[0].action.payload.currentRates, {from: "USD", to: "EUR"}).rate),
                orders: result[1].action.payload.orders
            });
        })
    }

    onChange(e, data) {
        let { exchangeResult, investments, currency, buySellAmount } = this.state;
        if(data.name === "buySellAmount") {
            const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
            exchangeResult = Math.round(rate* data.value*1000)/1000;
        }
        if(data.name === "currency") {
            const rate = parseFloat(_.find(investments.currentRates, {from: data.value, to: "EUR"}).rate);
            exchangeResult = Math.round(rate* buySellAmount*1000)/1000;
        }
        this.setState({[data.name]: data.value, exchangeResult});
    }

    onAmountChange(e, data) {
        let { exchangeResult, investments, currency } = this.state;
        console.log(data.value);
        const amount = data.value;
        const lastChar = amount.split("").reverse()[0];

        if(lastChar && lastChar >= '0' & lastChar <= "9") {
            if(data.name === "buySellAmount") {
                const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
                exchangeResult = Math.round(rate* data.value*1000)/1000;
            }
            this.setState({[data.name]: parseInt(data.value), exchangeResult});
        } else if(!lastChar) {
            if(data.name === "buySellAmount") {
                const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
                exchangeResult = Math.round(rate* data.value*1000)/1000;
            }
            this.setState({[data.name]: 0, exchangeResult});
        }

    }

    deposit() {
        const {user, amount} = this.state;
        this.props.deposit({currency: "EUR", amount: parseInt(amount), iban: user.iban}).then(result => {
            this.props.getInvestments().then(res=> {
                this.setState({investments: res.action.payload, amount: 0})
            })
        })
    }

    changeBuySell() {
        const {buySellType} = this.state;
        if(buySellType === "buy") {
            this.setState({buySellType: "sell"});
        } else {
            this.setState({buySellType: "buy"});
        }
    }

    buySell() {
        const {currency, buySellAmount, buySellType} = this.state;
        this.props[buySellType]({currency, amount: buySellAmount}).then(result => {

            this.props.getInvestments().then(res=> {
                this.setState({investments: res.action.payload, amount: 0})
            })
        })
    }

    order() {
        const {currency, buySellAmount, aboveOrBelow, orderRate, buySellType} = this.state;
        this.props.order({currency, amount: buySellAmount, type: buySellType, rate: orderRate, compare: aboveOrBelow}).then(res => {
            const promises = [];
            promises.push(this.props.getInvestments());
            promises.push(this.props.getOrders());

            Promise.all(promises).then(result => {
                this.setState({
                    investments: result[0].action.payload,
                    orders: result[1].action.payload.orders,
                    amount: 0
                });
            })
        })
    }

    deleteOrder(id) {
        this.props.deleteOrder({id}).then(res => {
            this.props.getOrders().then(result => {
                this.setState({orders: result.action.payload.orders})
            })
        })
    }

    render() {
        const {investments, currency, amount, buySellType, buySellAmount, exchangeResult, aboveOrBelow, orderRate, orders} = this.state;
        const dropdownOptions = _.reduce(tradingEquipment, function(final, obj) {
            if(obj.value === "EUR") {
                return final;
            } else {
                return [...final,{text: obj.value, value: obj.value}];
            }
        }, []);
        return !investments ? <Loading /> :
            (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <Segment style={{display: "flex"}}>
                            <Grid.Column>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Label circular color="grey" size="massive">{ "€"+Math.round(investments.account.EUR*100)/100}</Label>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Header>Current Balance</Header>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Input
                                        name="amount"
                                        onChange={this.onAmountChange.bind(this)}
                                        value={amount}
                                        type="number"
                                        step="1"
                                        labelPosition="right"
                                        placeholder="Amount"
                                    />
                                    <Button style={{float: "right"}} onClick={this.deposit.bind(this)}  disabled={!amount}>Deposit</Button>
                                </Grid.Column>
                            </Grid.Row>
                            </Grid.Column>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <Segment raised>
                            <Header>My Assets</Header>
                            <List horizontal divided>
                                {tradingEquipment.map(key=> {
                                    if(key.value !== "EUR") {
                                        return (
                                            <List.Item icon={key.icon || "money"} content={investments.account[key.value] + " " + key.value} />
                                        )
                                    }
                                })}
                            </List>
                        </Segment>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Grid.Row>
                        <Segment>
                            <Grid>
                                <Grid.Row >
                                    <Grid.Column width={16} style={{display: "flex !important", justifyContent: "center !important", alignItems: "center !important"}}>
                                        <Label size="large" color={buySellType === "sell" ? "teal" : "grey"}>SELL</Label>
                                        <Radio slider checked={buySellType === "buy"} onChange={this.changeBuySell.bind(this)} />
                                        <Label size="large" color={buySellType === "buy" ? "teal" : "grey"}>BUY</Label>
                                        <Input
                                            label={
                                                <Dropdown
                                                    placeholder='Select Currency'
                                                    name="currency"
                                                    value={currency}
                                                    basic
                                                    options={dropdownOptions}
                                                    onChange={this.onChange.bind(this)}
                                                />
                                            }
                                            name="buySellAmount"
                                            onChange={this.onAmountChange.bind(this)}
                                            value={buySellAmount}

                                            labelPosition="right"
                                            placeholder="Amount"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={2} divided>
                                <Grid.Column width={5} >
                                    <Button onClick={this.buySell.bind(this)} basic color="teal">{buySellType.toUpperCase() + " NOW for " + exchangeResult + "€"}</Button>
                                </Grid.Column>
                                <Grid.Column width={11} >
                                    <Input
                                        label={
                                            <Dropdown
                                                name="aboveOrBelow"
                                                value={aboveOrBelow}
                                                basic
                                                options={[{text: "ABOVE", value: "HIGHER" },{text: "BELOW", value: "LOWER" }]}
                                                onChange={this.onChange.bind(this)}
                                            />
                                        }
                                        name="orderRate"
                                        onChange={this.onChange.bind(this)}
                                        value={orderRate}
                                        action={<Button onClick={this.order.bind(this)} basic color="teal">{"ORDER TO " + buySellType.toUpperCase() + " for " + Math.round(parseFloat(orderRate)*buySellAmount*1000)/1000 + "€"}</Button>}
                                        type="number"
                                        labelPosition="left"
                                        placeholder="Order Rate"
                                    />
                                    <Header>{""}</Header>
                                </Grid.Column>
                            </Grid>

                        </Segment>
                        </Grid.Row>
                        <Grid.Row>
                            <Segment>
                                {orders && orders.length > 0 ? (
                                    <List divided>
                                        {orders.map(order => {
                                                return <List.Item>
                                                    <List.Content floated='right'>
                                                        <Button color="red" onClick={this.deleteOrder.bind(this,order._id)}>Cancel Order</Button>
                                                    </List.Content>
                                                    <List.Icon name="long arrow alternate right" />
                                                    <List.Content>
                                                        <List.Header>{"Ordered to " +order.type.toLowerCase()+ " " + order.amount+order.currency + " when " + order.currency+ "/EUR is " + order.compare.toLowerCase() + " than " + order.rate}</List.Header>
                                                        <List.Description>{moment(order.date).format("DD/MM/YYYY HH:mm")}</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            }
                                        )}
                                    </List>
                                ) : (
                                    <Header>No current order.</Header>
                                )}
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={8}>
                    <Segment textAlign="left">
                        <Header>Action History</Header>
                        {investments && (
                            <List>
                                {investments.histories.map(investment => {
                                    return <List.Item>
                                        <List.Icon name="long arrow alternate right" />
                                        <List.Content>
                                        <List.Header>{investment.text}</List.Header>
                                        <List.Description>{moment(investment.date).format("DD/MM/YYYY HH:mm")}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                }
                                )}
                            </List>
                                )}
                    </Segment>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
}

const dispatchToProps = dispatch => {
    return {
        getInvestments: () => dispatch(investmentActions.getInvestments()),
        deposit: params => dispatch(investmentActions.deposit(params)),
        buy: params => dispatch(investmentActions.buy(params)),
        sell: params => dispatch(investmentActions.sell(params)),
        order: params => dispatch(investmentActions.order(params)),
        deleteOrder: params => dispatch(investmentActions.deleteOrder(params)),
        getOrders: () => dispatch(investmentActions.getOrders())
    }
};

export default connect(null, dispatchToProps)(Investments);