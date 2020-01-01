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

export function predictTE(params) {
    return {
        type: "PREDICT_TRADING_EQUIPMENT",
        payload: tEquipmentService.predict(params)
    };
}

export function unfollowTEq(params) {
    return {
        type: "UNFOLLOW_TRADING_EQUIPMENT",
        payload: tEquipmentService.unfollowTEquipment(params)
    };
}
export function setAlert(params) {
    return {
        type: "SET_ALERT",
        payload: tEquipmentService.setAlert(params)
    };
}
export function getAlerts(params) {
    return {
        type: "GET_ALERTS",
        payload: tEquipmentService.getAlerts(params)
    };
}
export function deleteAlert(params) {
    return {
        type: "DELETE_ALERT",
        payload: tEquipmentService.deleteAlert(params)
    };
}