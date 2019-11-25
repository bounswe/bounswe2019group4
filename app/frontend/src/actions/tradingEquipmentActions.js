import tEquipmentService from "../factories/tradingEquipmentFactory.js";

export function getTEquipment() {
    return {
        type: "GET_TRADING_EQUIPMENT",
        payload: tEquipmentService.getTEquipment()
    };
}

export function getTEquipmentDetails(params) {
    return {
        type: "GET_TRADING_EQUIPMENT_DETAILS",
        payload: tEquipmentService.getTEquipmentDetail(params)
    };
}

export function followTEq(params) {
    return {
        type: "FOLLOW_TRADING_EQUIPMENT",
        payload: tEquipmentService.followTEquipment(params)
    };
}

export function unfollowTEq(params) {
    return {
        type: "UNFOLLOW_TRADING_EQUIPMENT",
        payload: tEquipmentService.unfollowTEquipment(params)
    };
}