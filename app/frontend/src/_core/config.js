const config = {};
let baseUrl;
config.getBasePublicUrl = () => {
    if (process.env.NODE_ENV === "development") {
        baseUrl = "dev.api.arkenstone.ml";
    } else if (process.env.NODE_ENV === "production") {
        baseUrl = "api.arkenstone.ml";
    } else {
        baseUrl = "dev.api.arkenstone.ml";
    }
    return baseUrl;
};

export default config;
