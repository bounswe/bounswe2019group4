import investmentService from "../factories/investmentFactory.js";

export function getInvestments() {
    return {
        type: "GET_INVESTMENTS",
        payload: investmentService.getInvestments()
    };
}

export function deposit(params) {
    return {
        type: "DEPOSIT",
        payload: investmentService.deposit(params)
    };
}

export function buy(params) {
    return {
        type: "BUY",
        payload: investmentService.buy(params)
    };
}

export function sell(params) {
    return {
        type: "SELL",
        payload: investmentService.sell(params)
    };
}

export function order(params) {
    return {
        type: "ORDER",
        payload: investmentService.order(params)
    };
}

export function deleteOrder(params) {
    return {
        type: "DELETE_ORDER",
        payload: investmentService.deleteOrder(params)
    };
}

export function getOrders() {
    return {
        type: "GET_ORDERS",
        payload: investmentService.getOrders()
    };
}