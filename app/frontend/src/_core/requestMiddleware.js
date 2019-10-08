import baseRequest from "../_core/baseRequest";
import history from "../_core/history";
import * as alertActions from "../actions/alertActions";
import * as userActions from "../actions/userActions";

export default function requestMiddleware() {
    return ({ dispatch }) => next => action => {
        if (action.type) {
            const error = /.*_ERROR$/;
            if (action.type.match(error)) {
                const message = action.payload.response.data.message;
                dispatch(alertActions.showAlert(message));
                if (message === "Unauthorized") {
                    baseRequest.addHeader();
                    dispatch(userActions.resetUser());
                    history.push("/login");
                }
            }
        }
        return next(action);
    };
}
