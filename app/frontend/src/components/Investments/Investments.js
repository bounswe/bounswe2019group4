import React,{Component} from "react";
import {
    Segment,
    Grid,
    List,
    Header,
    Dropdown,
    Input,
    Button,
    Label,
    Radio,
    Icon,
    Pagination,
    Divider
} from "semantic-ui-react";
import {connect} from "react-redux";
import moment from "moment";
import _ from "lodash";

import Loading from "../Loading";
import {loadState} from "../../_core/localStorage";
import * as investmentActions from "../../actions/investmentActions";

import tradingEquipment from "../../utils/constants/tradingEquipment";
import {colorBG, colorPrimary} from "../../utils/constants/Colors";

class Investments extends Component {
    constructor(props) {
        super(props);
        const initialState = loadState();
        this.state = { user: initialState.user, currency: "USD", buySellType: "buy", exchangeResult: 0, buySellAmount: "", aboveOrBelow: "HIGHER", orderRate: 0, orders: [], shownPage: 1};
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

    updatePage= (e,data)=>{
        this.setState({shownPage:data.activePage},this.setShownEvents);
    };

    onChange(e, data) {
        let { exchangeResult, investments, currency, buySellAmount } = this.state;
        if(data.name === "buySellAmount") {
            const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
            exchangeResult = Math.round(rate* data.value*1000)/1000;
        }
        if(data.name === "currency") {
            const rate = parseFloat(_.find(investments.currentRates, {from: data.value, to: "EUR"}).rate);
            exchangeResult = Math.round(rate* parseFloat(buySellAmount)*1000)/1000;
            const currentRate = investments && Math.round(parseFloat(_.find(investments.currentRates, {from: data.value, to: "EUR"}).rate)*10000)/10000;
            this.setState({orderRate:currentRate})
        }

        this.setState({[data.name]: data.value, exchangeResult});
    }

    onAmountChange(e, data) {
        let { exchangeResult, investments, currency } = this.state;
        console.log(data.value);
        const amount = data.value;
        const lastChar = amount.split("").reverse()[0];

        if(lastChar &&( (lastChar >= '0' & lastChar <= "9")||lastChar===".")) {

            if(data.name === "buySellAmount") {
                const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
                exchangeResult = Math.round(rate* data.value*1000)/1000;
            }
            this.setState({[data.name]: data.value, exchangeResult});
        } else if(!lastChar) {
            if(data.name === "buySellAmount") {
                const rate = parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate);
                exchangeResult = Math.round(rate* data.value*1000)/1000;
            }
            this.setState({[data.name]: "", exchangeResult});
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

    changeBuySell(buySellType) {

        this.setState({buySellType });

    }

    buySell() {
        const {currency, buySellAmount, buySellType} = this.state;
        this.props[buySellType]({currency, amount: parseFloat(buySellAmount)}).then(result => {

            this.props.getInvestments().then(res=> {
                this.setState({investments: res.action.payload, amount: 0})
            })
        })
    }

    order() {
        const {currency, buySellAmount, aboveOrBelow, orderRate, buySellType} = this.state;
        this.props.order({currency, amount: parseFloat(buySellAmount), type: buySellType, rate: orderRate, compare: aboveOrBelow}).then(res => {
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
        const currentRate = investments && Math.round(parseFloat(_.find(investments.currentRates, {from: currency, to: "EUR"}).rate)*10000)/10000;
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
                    <Grid.Column stretched width={4}>
                        <Segment style={{margin: 20, display:"flex",justifyContent:"center",alignItems:"center",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                            <Grid.Column stretched>
                                <Grid.Row>
                                    <Grid.Column width={16}>
                                        <Header style={{color: "#c9c9c9",margin:5}}>Current Balance</Header>
                                    </Grid.Column>
                                </Grid.Row>
                            <Grid.Row>
                                <Grid.Column width={16}>
                                    <Label circular color="grey" size="massive">{ "€"+Math.round(investments.account.EUR*100)/100}</Label>
                                </Grid.Column>
                            </Grid.Row>
                                <Grid.Row  style={{margin:5}}>
                                    <Grid.Column  width={16}>

                                        {investments.totalProfit>0?

                                            <Label circular color="green" size="medium">{ "Total Profit: €"+Math.round(investments.totalProfit*100)/100}</Label>:
                                            <Label circular color="red" size="medium">{ "Total Profit: €"+Math.round(investments.totalProfit*100)/100}</Label>
                                        }

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
                                        action={<Button style={{float: "right"}} onClick={this.deposit.bind(this)}  disabled={!amount}>Deposit</Button>}

                                    />
                                </Grid.Column>
                            </Grid.Row>
                            </Grid.Column>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <Segment raised style={{margin: 20, width: "100%",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                            <Header style={{color: "#c9c9c9"}}>My Assets</Header>
                            <div style={{display:"flex",justifyContent:"center"}}>

                            <List style={{margin: 20, width: "84%",  background: colorBG}} horizontal divided>
                                {tradingEquipment.map(key=> {
                                    if(key.value !== "EUR") {
                                        return (
                                            <List.Item style={{color: "#c9c9c9",margin:5}} icon={key.icon ? key.icon+ " inverted" : "money inverted"} content={investments.account[key.value] + " " + key.value} />
                                        )
                                    }
                                })}
                            </List>
                            </div>
                        </Segment>
                    </Grid.Column>

                </Grid.Row>
                <Grid.Row>
                    <Grid.Column width={8}>
                        <Grid.Row>
                        <Segment style={{margin: 20, width: "100%",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                            <Header style={{color: "#c9c9c9",textAlign:"left"}}>Invest</Header>
                            <Grid>
                                <Grid.Row >
                                    <Grid.Column width={16} style={{display: "flex !important", justifyContent: "center !important", alignItems: "center !important"}}>
                                        <Button size="small" style={{float: "left"}} color={buySellType === "sell" ? "teal" : "grey"} basic={buySellType === "buy"} onClick={this.changeBuySell.bind(this, "sell")}>SELL</Button>
                                        <Button size="small" style={{float: "left"}} color={buySellType === "buy" ? "teal" : "grey"} basic={buySellType === "sell"} onClick={this.changeBuySell.bind(this, "buy")}>BUY</Button>
                                        <span style={{color: "#c9c9c9", fontWeight: "bold", fontSize: 17}}>Enter Amount</span>
                                        <Icon name="arrow right inverted" />
                                        <Input
                                            label={
                                                <Dropdown
                                                    scrolling
                                                    search
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
                                        <span style={{marginLeft:10, color: "#c9c9c9", fontWeight: "bold", fontSize: 13}}>{currency+"/EUR"}</span>
                                        <Icon size={13} name="arrow right inverted" />
                                        <span style={{color: "#c9c9c9", fontWeight: "bold", fontSize: 13}}>{currentRate}</span>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                            <Grid columns={2} divided>

                                <Grid.Column width={4} >
                                    <Button onClick={this.buySell.bind(this)} disabled={!buySellAmount} style={{backgroundColor: colorPrimary, color: "white"}}>{buySellType.toUpperCase() + " NOW for " + exchangeResult + "€"}</Button>

                                </Grid.Column>
                                <Grid.Column width={12} >
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
                                        action={<Button disabled={!buySellAmount} onClick={this.order.bind(this)} style={{backgroundColor: colorPrimary, color: "white"}}>{"ORDER TO " + buySellType.toUpperCase() + " for " + Math.round(parseFloat(orderRate)*parseFloat(buySellAmount)*1000)/1000 + "€"}</Button>}
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
                            <Segment textAlign="left"  style={{margin: 20, width: "100%",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                                <Header style={{color: "#c9c9c9"}}>Orders</Header>
                                {orders && orders.length > 0 ? (
                                    <List divided>
                                        {orders.map(order => {
                                                return <List.Item>
                                                    <List.Content floated='right'>
                                                        <Button color="red" onClick={this.deleteOrder.bind(this,order._id)}>Cancel Order</Button>
                                                    </List.Content>
                                                    <List.Icon name="arrows alternate horizontal inverted" />
                                                    <List.Content>
                                                        <List.Header style={{color: "#c9c9c9"}}>{"Ordered to " +order.type.toLowerCase()+ " " + order.amount+order.currency + " when " + order.currency+ "/EUR is " + order.compare.toLowerCase() + " than " + order.rate}</List.Header>
                                                        <List.Description style={{color: "#c9c9c9"}}>{moment(order.date).format("DD/MM/YYYY HH:mm")}</List.Description>
                                                    </List.Content>
                                                </List.Item>
                                            }
                                        )}
                                    </List>
                                ) : (
                                    <Header style={{color: "#c9c9c9"}}>No current order.</Header>
                                )}
                            </Segment>
                        </Grid.Row>
                    </Grid.Column>
                    <Grid.Column width={7}>
                    <Segment textAlign="left" style={{margin: 20, width: "100%",  background: colorBG,borderColor:colorPrimary,borderRadius:20,borderWidth:1.5}}>
                        <Header style={{color: "#c9c9c9"}}>Action History</Header>
                        {investments && (
                            <List>
                                {investments.histories.slice((this.state.shownPage-1)*7,this.state.shownPage*7).map(investment => {
                                    let profit=Math.round(investment.profit);
                                    return <List.Item>
                                        {
                                            profit>0?<List.Icon color={"green"} name={"money"} ><span style={{marginLeft:3}}>{"€"+profit}</span></List.Icon>:profit<0?<List.Icon color={"red"} name={"money"} ><span style={{marginLeft:3}}>{"€"+profit}</span></List.Icon>:<List.Icon color={"grey"} name={"money"} />
                                        }

                                        <List.Content>
                                        <List.Header style={{color: "#c9c9c9"}}>{investment.text}</List.Header>
                                        <List.Description style={{color: "#c9c9c9"}}>{moment(investment.date).format("DD/MM/YYYY HH:mm")}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                }
                                )}
                            </List>
                                )}
                        {investments && investments.histories && investments.histories.length > 0 && (
                            <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
                                <Pagination  defaultActivePage={1}
                                             siblingRange={5}
                                             totalPages={Math.ceil(investments.histories.length/7.0)}
                                             activePage={this.state.shownPage}
                                             onPageChange={this.updatePage}
                                             style={{background: "rgba(0,0,0,0)", color: "#ffffff !important", fontWeight: "bold"}}
                                />
                            </div>
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