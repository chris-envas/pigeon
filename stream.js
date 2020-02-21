/*
 * @Author: your name
 * @Date: 2020-02-07 15:46:48
 * @LastEditTime : 2020-02-07 15:47:31
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\stream.js
 */
const fs = require('fs')
const stream = fs.createReadStream('./test.js')
stream.pipe(process.stdout)
