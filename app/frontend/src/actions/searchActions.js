import searchService from "../factories/searchFactory.js";

export function search(params) {
    return {
        type: "SEARCH",
        payload: searchService.search(params)
    };
}