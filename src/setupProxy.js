const proxy = require('http-proxy-middleware')

module.exports = function (app) {
    app.use(proxy.createProxyMiddleware("^/api", {
        target: "https://test-app-claim.x-protocol.com/",
        changeOrigin: true
    }))
}