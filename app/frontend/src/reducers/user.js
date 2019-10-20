const user = (state = null, action) => {
    switch (action.type) {
        case "LOGIN_FULFILLED":
            return {
                ...action.payload,
                loggedIn: true
            };
        case "LOGOUT_FULFILLED":
            return { loggedIn: false } ;
        case "LOGOUT_REJECTED":
            return  { loggedIn: false } ;
        case "RESET_USER":
            return  { loggedIn: false } ;
        default:
            return state;
    }
};

export default user;
