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
        type: "LOGOUT"
    };
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