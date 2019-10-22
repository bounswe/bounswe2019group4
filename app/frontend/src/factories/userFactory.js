import baseRequest from "../_core/baseRequest";

function userFactory() {
    this.signUp = params => baseRequest.post("/auth/signup", params);
    this.forgetPassword = params => baseRequest.post("/auth/forget-password", params);
    this.resetPassword = params => baseRequest.post("/auth/reset-password", params);
    this.events=path => baseRequest.get("/events"+path);
}

export default new userFactory();
