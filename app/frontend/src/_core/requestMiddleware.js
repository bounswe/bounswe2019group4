import baseRequest from "../_core/baseRequest";
import history from "../_core/history";
import * as alertActions from "../actions/alertActions";
import * as userActions from "../actions/userActions";

export default ({ dispatch }) => next => action => {
        if (action.type) {
            console.log(action.type);
            const error = /.*_REJECTED$/;
            if (action.type.match(error)) {
                alert(JSON.stringify(action))
               // const message = action.payload.response.data.errmsg;
                //dispatch(alertActions.showAlert(message));
                let message="";
                if (message === "Unauthorized") {
                    baseRequest.addHeader();
                    dispatch(userActions.resetUser());
                    history.push("/");
                }
            }
        }
        return next(action);
    };

