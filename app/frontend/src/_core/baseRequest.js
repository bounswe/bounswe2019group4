import axios from "axios";

import config from "./config";
import { loadState } from "./localStorage";

const isUserLoggedIn = () => !!(loadState().user && loadState().user.loggedIn);

const baseRequest = {};

const baseUrl = config.getBasePublicUrl();

axios.defaults.baseURL = baseUrl;
baseRequest.addHeader = token => {
    let sessionToken = null;
    if (isUserLoggedIn()) {
        sessionToken = loadState().user.sessionToken;
    }

   //
    //
    // axios.defaults.headers.common["authorization"] = sessionToken || token;
  //  axios.defaults.headers.common["Connection"] = "keep-alive";
  //  axios.defaults.headers.common["Pragma"] = "no-cache";
  //  axios.defaults.headers.common["Cache-Control"] = "no-cache";
  //  axios.defaults.headers.common["Host"] = "api.dev.arkenstone.ml";


    //axios.defaults.headers.common['Access-Control-Allow-Origin'] =  'http://localhost:3000';
    //axios.defaults.headers.common['Access-Control-Allow-Credentials'] = 'true';
   axios.defaults.withCredentials = true;
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

function getCookie(name) {
    console.log(document.cookie);
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
}

baseRequest.get = path => baseRequest.request("GET", path);
baseRequest.post = (path, params) => baseRequest.request("POST", path, params);
baseRequest.download = (path, params) => baseRequest.request("POST", path, params, "blob");

baseRequest.addHeader();
export default baseRequest;
