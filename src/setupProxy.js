// const proxy = require('http-proxy-middleware')
import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function (app) {
    app.use(createProxyMiddleware("^/api", {
        target: "https://test-app-claim.x-protocol.com/",
        changeOrigin: true
    }))
}