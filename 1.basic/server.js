// 同构步骤1: 实例化 Vue 对象
global.Vue = require('vue')
const createApp = require('./src/app');

// 同构步骤2: 实例化服务端同构 renderer
const renderer = require('vue-server-renderer').createRenderer()

// integrate server 
const express = require('express');
const server = express()
var fs = require('fs')
var path = require('path')
// 获取HTML布局   String类型
var layout = fs.readFileSync('./src/index.tmpl.html', 'utf8')
// 部署静态文件夹为 "src"文件夹，静态资源就不需要路由配置了。
server.use('/', express.static(
  path.resolve(__dirname, 'src')
))
// 处理所有的Get请求
server.get('*', (req, res) => {
    const app = createApp();
    // 同构步骤3: 渲染Vue实例为html模板
    renderer.renderToString(app, (err, html) => {
        // 如果渲染时发生了错误
        if (err) {
            // 打印错误到控制台
            console.error(err)
            // 告诉客户端错误
            return response
                .status(500)
                .send('Server Error')
        }
        // 发送布局和HTML文件给客户端，此时已经拼接好 HTML 模板
        res.send(layout.replace('<!--vue-ssr-outlet-->', html))
    })
})

server.listen(8010)