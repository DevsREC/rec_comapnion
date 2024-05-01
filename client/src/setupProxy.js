const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://nginx:8080/api",
      pathRewrite: { "^/api": "" },
    }),
  );
};
