const { createProxyMiddleware } = require('http-proxy-middleware');
console.log('PROXY: ', process.env.PROXY_ENV)
module.exports = function (app) {
    app.use(createProxyMiddleware("/api", {
        target: "https://test-app-claim.x-protocol.com/",
        changeOrigin: true
    }))
}