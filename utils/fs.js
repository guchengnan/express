
const fs  = require('fs');
const { promisify } = require('util')
const path = require('path');

const mockPath = path.resolve(__dirname, '../mock/db.json');
const logPath = path.resolve(__dirname, '../log.txt')
// node提供的promise
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)
const appendFile = promisify(fs.appendFile)

// 读取文件
exports.getFile = async () => {
    const result  = await readFile(mockPath)
    return JSON.parse(result)
}
// 写入文件
exports.saveFile = async (data) => {
    return await writeFile(mockPath, data)
}

// 写入日志
exports.saveLog = async (data) => {
    return await appendFile(logPath, data)
}