import baseRequest from "../_core/baseRequest";
import history from "../_core/history";
import * as alertActions from "../actions/alertActions";
import * as userActions from "../actions/userActions";

export default ({ dispatch }) => next => action => {
        if (action.type) {
            console.log(action.type);
            const error = /.*_REJECTED$/;
            if (action.type.match(error)) {
                const message = (action.payload.response&&action.payload.response.data.errmsg)?action.payload.response.data.errmsg:action.payload.message;
                dispatch(alertActions.showAlert(message));
                if (message === "Unauthorized") {
                    baseRequest.addHeader();
                    dispatch(userActions.resetUser());
                    history.push("/");
                }
            }
        }
        return next(action);
    };

