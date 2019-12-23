import baseRequest from "../_core/baseRequest";

function investmentFactory() {
    this.getInvestments = () => baseRequest.get("/investments");
    this.deposit = params => baseRequest.post("/investments/deposit", params);
    this.buy = params => baseRequest.post("/investments/buy", params);
    this.sell = params => baseRequest.post("/investments/sell", params);
    this.order = params => baseRequest.post("/investments/order", params);
    this.deleteOrder = params => baseRequest.delete("/investments/order/" + params.id);
    this.getOrders = () => baseRequest.get("/investments/order");

}

export default new investmentFactory();
