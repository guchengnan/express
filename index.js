const express = require('express')
const router = require('./router')
const process = require('child_process');
const app = express()
const port = 3000

// 解析post
app.use(express.json());
app.use(express.urlencoded());
// 路由
app.use('/api', router)
//静态
app.use(express.static('public'))
// 404响应
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})
// 错误程序处理
app.use((err, req, res, next) => {
  res.status(500).json({
    errmsg: err.message
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  process.exec('start http://localhost:3000')
})