/*
 * @Author: your name
 * @Date: 2020-02-05 20:09:20
 * @LastEditTime: 2020-02-14 15:29:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\test.js
 */
const QiniuManger = require('./src/utils/qiniuManger')
var accessKey = 'kwIRkNS6Y0qMSAkxXs8LoH6M70jlEh7DAGPbkdM4';
var secretKey = 'Wrbu-U2XgaF_MwloLO5XhmNcvQvKYKEXWjlQpNVW';
var localFile = "/Users/Administrator/Desktop/hexo-blog/Node线上部署-Unbutu16-04.md";
var key='Node线上部署-Unbutu16-04.md';
const path = require('path')
const downloadPath = path.join(__dirname,'test.md')


const manger = new QiniuManger(accessKey,secretKey,'cloud-doc-rousoruce')
manger.upLoadFile(key,localFile).then(data => {
  console.log(data)
  // manger.downloadFile(key,downloadPath)
})
// manger.downloadFile(key,downloadPath).then(() => {
//   console.log('1')
// })

