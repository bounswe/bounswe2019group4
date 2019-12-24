import axios from "axios";

import config from "../_core/config";

const annotationRequest = {};

annotationRequest.request = (method, path, params, responseType) => {
    const baseUrl = "https://anno.arkenstone.ml";

    return axios({ method, url: baseUrl+path, data: params, responseType, withCredentials: true,headers: {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'}}).then(result => {
        if (result.data.message) {
            throw new Error(result.data.errmsg);
        } else {
            return result.data;
        }
    });
};

annotationRequest.addAnnotation = (params) => annotationRequest.request("POST", '/annotations', params,{});
annotationRequest.getArticleAnnotation = (params) => annotationRequest.request("GET", "/annotations/article/"+params.id,{},{headers: {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'}});
annotationRequest.getAnnotation = (params) => annotationRequest.request("GET", "/annotations"+params.id,{},{headers: {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'}});
annotationRequest.modifyAnnotation =(params)=>annotationRequest.request("PUT","/annotations",params, {headers: {'Content-Type': 'application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"'}});
annotationRequest.delete=(params)=> annotationRequest.request("DELETE","annotations",{},{headers: {'If-Match': params["E-Tag"]}});

export default annotationRequest;
