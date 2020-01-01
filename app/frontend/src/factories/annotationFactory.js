import axios from "axios";

import config from "../_core/config";
import baseRequest from "../_core/baseRequest";

const annotationRequest = {};

const baseUrl = config.annoBaseUrl;
annotationRequest.request = (method, path, params, header) => {


    return axios({ method, url: baseUrl+path, data: params, headers:header, withCredentials: true}).then(result => {
        if (result.data.message) {
            throw new Error(result.data.errmsg);
        } else {
            return result.data;
        }
    });
};


annotationRequest.addAnnotation = (params) => annotationRequest.request("POST", '/annotations', params,{'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'});
annotationRequest.getAnnotation = (params) => annotationRequest.request("GET", "/annotations/article/"+params,{}, {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'});
annotationRequest.getSpecificAnnotation=params=>axios.get(baseUrl+"/annotations"+params)
annotationRequest.modifyAnnotation =(params)=>annotationRequest.request("PUT","/annotations",params,  {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'});
annotationRequest.delete=(params)=> annotationRequest.request("DELETE","/annotations",{},{'If-Match': params["E-Tag"]});

export default annotationRequest;
