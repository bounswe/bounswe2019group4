const user = (state = null, action) => {
    switch (action.type) {
        case "LOGIN_FULFILLED":
            return {
                ...action.payload,
                loggedIn: true
            };
        case "LOGOUT":
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
