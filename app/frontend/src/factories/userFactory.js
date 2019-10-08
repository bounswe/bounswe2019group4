import baseRequest from "../_core/baseRequest";

function userFactory() {
    this.signUp = params => baseRequest.post("/user/new", params);
}

export default new userFactory();
