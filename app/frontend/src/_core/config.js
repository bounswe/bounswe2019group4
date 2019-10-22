const config = {};
let baseUrl;
config.getBasePublicUrl = () => {
    if (window.location.origin === "http://dev.arkenstone.ml") {
        baseUrl = "http://api.dev.arkenstone.ml/";
    } else if (window.location.origin === "http://arkenstone.ml" || window.location.origin === "http://www.arkenstone.ml") {
        baseUrl = "http://api.arkenstone.ml/";
    } else {
        baseUrl = "http://api.dev.arkenstone.ml/";
    }
    return baseUrl;
};

export default config;
