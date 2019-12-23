import baseRequest from "../_core/baseRequest";

function tEquipmentFactory() {
    this.getTEquipment = () => baseRequest.get("/trading-equipments");
    this.getTEquipmentDetail = params => baseRequest.get("/trading-equipments/" + params.currency);
    this.followTEquipment = params => baseRequest.post("/trading-equipments/follow?tEq=" + params.tEq);
    this.unfollowTEquipment = params => baseRequest.post("/trading-equipments/unfollow?tEq=" + params.tEq);
    this.predict=params=>baseRequest.post("/trading-equipments/prediction",params);
    this.setAlert=params=>baseRequest.post("/trading-equipments/alert",params);
    this.getAlerts=params=>baseRequest.get("/trading-equipments/alert");
    this.deleteAlert=params=>baseRequest.delete("/trading-equipments/alert/"+params)
}

export default new tEquipmentFactory();
