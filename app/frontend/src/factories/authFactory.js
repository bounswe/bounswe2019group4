import baseRequest from "../_core/baseRequest";
import { loadState } from "../_core/localStorage";
const btoa = require("btoa");

function authFactory() {
    this.isUserLoggedIn = () => !!(loadState().user && loadState().user.loggedIn);
    this.isAdmin = () => !!(loadState().user && loadState().user.admin);
    this.login = params => {
        const token = btoa(params.email + ":" + params.password);
        baseRequest.addHeader("Basic " + token);
        return baseRequest.post("/auth/login", params).then(result => {
            return result;
        });
    };
    this.logout = () => baseRequest.post("/logout");
    this.verify = params => baseRequest.get("/auth/verify?token=" + params.token);
}

export default new authFactory();
