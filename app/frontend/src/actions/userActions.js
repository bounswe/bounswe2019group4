import authService from "../factories/authFactory.js";
import userService from "../factories/userFactory.js";

export function login(params) {
    return {
        type: "LOGIN",
        payload: authService.login(params)
    };
}

export function logout() {
    return {
        type: "LOGOUT",
        payload: authService.logout()
    };
}

export function verify(params) {
    return {
        type: "VERIFY",
        payload: authService.verify(params)
    }
}

export function resetUser() {
    return {
        type: "RESET_USER"
    };
}

export function signUp(params) {
    return {
        type: "SIGN_UP",
        payload: userService.signUp(params)
    };
}

export function forgetPassword(params) {
    return {
        type: "FORGET_PASSWORD",
        payload: userService.forgetPassword(params)
    };
}
export function resetPassword(params) {
    return {
        type: "RESET_PASSWORD",
        payload: userService.resetPassword(params)
    };
}