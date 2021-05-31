const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getFile, saveFile, saveLog } = require('../utils/fs');

// 接口日志
router.use(async (req, res, next) => {
  await saveLog(`${Date.now()}：${req.method}-${req.url}-${req.socket.remoteAddress}\n`)
  next();
});

// 获取user列表
router.get('/getUserList',  async (req, res, next) => {
  try {
    const data = await getFile()
    res.status(200).json(data);  
  } catch (error) {
    next(error)
  }  
});
// 获取user详情
router.get('/getUserById/:id',  async (req, res, next) => {
  try {
    const data = await getFile()
    const { id } = req.params
    const result =  (data.user).find(item => {
      return item.id === id
    })
    result ? res.status(200).json(result) : res.status(404).json({
      errmsg: '记录不存在'
    });  
  } catch (error) {
    next(error)
  }  
});
// 新增&保存user人员
router.post('/saveUser', async (req, res, next) => {
  const { id, name } = req.body
  if(name){
    try {
      const data = await getFile()
      let userItem = {}
      if(id){ // 修改
        const index = data.user.findIndex(item => {
          return item.id === id
        })
        if(index !== -1){
          userItem = {
            ...data.user[index],
            name
          }
          data.user.splice(index, 1, userItem)
        }else{
          res.status(404).json({
            msg: '记录不存在'
          })
          return
        }
      }else{ // 新增
        userItem = {
          id: uuidv4(),
          name
        }
        data.user.push(userItem)
      }
      const result = JSON.stringify(data, null, 4)
      await saveFile(result)
      res.status(200).json(userItem)
    } catch (error) {
      next(error)
    }
  } else {
    res.status(400).json({
      errmsg: 'The name field is required'
    })
  }
});
// 删除user详情
router.post('/delUserById',  async (req, res, next) => {
  try {
    const data = await getFile()
    const { id } = req.body
    const index =  (data.user).findIndex(item => {
      return item.id === id
    })
    if(index !== -1){
      data.user.splice(index, 1)
      await saveFile(JSON.stringify(data, null, 4))
      res.status(200).json(data.user)
    }else{
      res.status(404).json({
        errmsg: '记录不存在'
      })
    }  
  } catch (error) {
    next(error)
  }  
});

module.exports = router;