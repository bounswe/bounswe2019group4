import axios from "axios";

import config from "./config";
import { loadState } from "./localStorage";

const isUserLoggedIn = () => !!(loadState().user && loadState().user.loggedIn);

const baseRequest = {};

const baseUrl = config.getBasePublicUrl() + "api";

axios.defaults.baseURL = baseUrl;
baseRequest.addHeader = token => {
    let sessionToken = null;
    if (isUserLoggedIn()) {
        sessionToken = loadState().user.sessionToken;
    }
    axios.defaults.headers.common["Authorization"] = sessionToken || token;
};


baseRequest.request = (method, path, params, responseType) => {
    return axios({ method, url: path, data: params, responseType }).then(result => {
        if (result.data.message) {
            throw new Error(result.data.errmsg);
        } else {
            return result.data;
        }
    });
};

baseRequest.get = path => baseRequest.request("GET", path);
baseRequest.post = (path, params) => baseRequest.request("POST", path, params);
baseRequest.download = (path, params) => baseRequest.request("POST", path, params, "blob");

baseRequest.addHeader();
export default baseRequest;
