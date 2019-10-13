const config = {};
let baseUrl;
config.getBasePublicUrl = () => {
    if (process.env.NODE_ENV === "development") {
        baseUrl = "http://api.dev.arkenstone.ml/";
    } else if (process.env.NODE_ENV === "production") {
        baseUrl = "http://api.arkenstone.ml/";
    } else {
        baseUrl = "http://dev.api.arkenstone.ml/";
    }
    return baseUrl;
};

export default config;
