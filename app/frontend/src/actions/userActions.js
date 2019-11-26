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

export function profile(params) {
    return {
        type:"PROFILE",
        payload: userService.profile(params)
    };
}
export function portfolios(params) {
    return {
        type:"PORTFOLIOS",
        payload: userService.portfolios(params)
    };
}

export function follow(path) {
    return {
        type:"FOLLOW_USER",
        payload: userService.follow(path)
    };
}
export function unfollow(path) {
    return {
        type:"UNFOLLOW_USER",
        payload: userService.unfollow(path)
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


export function deleteComment(path) {
    return {
        type:"DELETE_COMMENT",
        payload: userService.deleteComment(path)
    };
}

export function getArticleDetails(params) {
    return {
        type:"ARTICLE_DETAIL",
        payload: userService.getArticle(params)
    };
}

export function rateArticle(path,params) {
    return {
        type:"ARTICLE_RATE",
        payload: userService.rateArticle(path,params)
    };
}
export function editArticle(path,params) {
    return {
        type:"ARTICLE_EDIT",
        payload: userService.editArticle(path,params)
    };
};

export function createArticle(params) {
    return {
        type:"ARTICLE_CREATE",
        payload: userService.createArticle(params)
    };
}
export function acceptFollow(path) {
    return {
        type:"ACCEPT_FOLLOW_REQUEST",
        payload: userService.acceptFollow(path)
    };
}export function rejectFollow(path) {
    return {
        type:"REJECT_FOLLOW_REQUEST",
        payload: userService.rejectFollow(path)
    };
}
