import baseRequest from "../_core/baseRequest";

function searchFactory() {
    this.search = (params) => baseRequest.get("/search?q=" + params.value);
}

export default new searchFactory();
