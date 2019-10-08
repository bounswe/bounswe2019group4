const user = (state = null, action) => {
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...action.payload.data.user,
                loggedIn: true,
                sessionToken: action.payload.data.sessionToken
            };
        case "LOGOUT_SUCCESS":
            return { loggedIn: false, sessionToken: undefined };
        case "LOGOUT_ERROR":
            return { loggedIn: false, sessionToken: undefined };
        case "RESET_USER":
            return { loggedIn: false, sessionToken: undefined };
        default:
            return state;
    }
};

export default user;
