import baseRequest from "../_core/baseRequest";

function tEquipmentFactory() {
    this.getTEquipment = () => baseRequest.get("/trading-equipments");
    this.getTEquipmentDetail = params => baseRequest.get("/trading-equipments/" + params.currency);
    this.followTEquipment = params => baseRequest.post("/trading-equipments/follow?tEq=" + params.tEq);
    this.unfollowTEquipment = params => baseRequest.post("/trading-equipments/unfollow?tEq=" + params.tEq);
    this.predict=params=>baseRequest.post("/trading-equipments/prediction",params)
}

export default new tEquipmentFactory();
