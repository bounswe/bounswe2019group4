const config = {};
let baseUrl;
config.getBasePublicUrl = () => {
    if (window.location.origin === "http://dev.arkenstone.ml" || window.location.origin === "https://dev.arkenstone.ml") {
        baseUrl = "https://api.dev.arkenstone.ml/";
    } else if (window.location.origin === "http://arkenstone.ml" || window.location.origin === "http://www.arkenstone.ml" || window.location.origin === "https://arkenstone.ml" || window.location.origin === "https://www.arkenstone.ml") {
        baseUrl = "https://api.arkenstone.ml/";
    } else {
        baseUrl = "https://api.dev.arkenstone.ml/";
    }
    return baseUrl;
};
config.annoBaseUrl="https://anno.arkenstone.ml";

export default config;
