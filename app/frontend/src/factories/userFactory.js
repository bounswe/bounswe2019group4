import baseRequest from "../_core/baseRequest";

function userFactory() {
    this.signUp = params => baseRequest.post("/auth/signup", params);
    this.forgetPassword = params => baseRequest.post("/auth/forget-password", params);
    this.resetPassword = params => baseRequest.post("/auth/reset-password", params);
    this.events=path => baseRequest.get("/events"+path);
    this.userProfile=path => baseRequest.get("/profile"+path);
    this.postComment=params=> baseRequest.post("/comments",params);
    this.getArticle=path=>baseRequest.get("/articles"+path);
    this.rateArticle=(path,params)=>baseRequest.post("/articles"+path,params);
    this.deleteComment=(path)=>baseRequest.delete("/comments"+path);
}

export default new userFactory();
