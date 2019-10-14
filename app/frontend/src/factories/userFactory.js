import baseRequest from "../_core/baseRequest";

function userFactory() {
    this.signUp = params => baseRequest.post("/auth/signup", params);
}

export default new userFactory();
