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
export function events(params) {
    return {
        type:"EVENTS",
        payload: userService.events(params)
    };
}
export function users(params) {
    return {
        type:"USER_PROFILE",
        payload: userService.userProfile(params)
    };
}

export function postComment(params) {
    return {
        type:"POST_COMMENT",
        payload: userService.postComment(params)
    };
}