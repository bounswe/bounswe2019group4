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
    this.editArticle=(path,params)=>baseRequest.patch("/articles"+path,params);
    this.createArticle=(params)=>baseRequest.post("/articles",params);
    this.deleteComment=(path)=>baseRequest.delete("/comments"+path);
    this.profile = path => baseRequest.get("/profile/"+path);
    this.portfolios = path => baseRequest.get("/portfolios/"+path);
    this.follow = path => baseRequest.get("/profile/"+path+"/follow");
    this.unfollow = path => baseRequest.get("/profile/"+path+"/unfollow");
    this.acceptFollow = params => baseRequest.get("/profile/accept/"+params);
    this.rejectFollow = params => baseRequest.get("/profile/reject/"+params);
    this.cancelFollow = params => baseRequest.get("/profile/cancel/"+params);
    this.getNotification= ()=> baseRequest.get("/notifications");

}

export default new userFactory();
