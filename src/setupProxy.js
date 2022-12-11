import * as proxy from "http-proxy-middleware";
import {options} from "axios";

module.exports = (app) => {
    app.use('/',proxy.createProxyMiddleware({
        target: 'http://localhost:5173',
        changeOrigin: true,
        headers: [
            {"Cross-Origin-Opener-Policy": "same-origin"},
            {"Cross-Origin-Embedder-Policy": "require-corp"}
        ]
    }))
}