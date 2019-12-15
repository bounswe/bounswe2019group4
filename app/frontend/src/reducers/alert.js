const alert = (state = { showAlert: false }, action) => {
    switch (action.type) {
        case "SHOW_ALERT":
            return {
                showAlert: true,
                body: action.body,
                title: action.title,
                actionFunc: action.actionFunc,
                actionTitle: action.actionTitle,
                actionFunc2: action.actionFunc2,
                actionTitle2: action.actionTitle2
            };
        case "CLOSE_ALERT":
            return { showAlert: false };
        default:
            return state;
    }
};

export default alert;
