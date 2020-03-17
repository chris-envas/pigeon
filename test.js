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
var key = 'create-react-app搭建Electron开发环境.md';
// const path = require('path')
// const downloadPath = path.join(__dirname, 'shadowsocks-libev-server.md')
// console.log(downloadPath)
// var obj = {
//         key: 'Typescript牛刀小试 - 副本 (2).md',
//         hash: 'FrW7_Mfeu4XQRVp0dsmUQMv7HNsf',
//         fsize: 10890,
//         mimeType: 'text/markdown',
//         putTime: 15835821877204926,
//         type: 0,
//         status: 0,
//         md5: '901a80e4ee75c38161ca9036feecfa68'
//     }

const manger = new QiniuManger(accessKey, secretKey, 'cloud-doc-rousoruce')
// manger.upLoadFile(key,localFile).then(data => {
//   console.log(data)
//   // manger.downloadFile(key,downloadPath)
// })
// manger.downloadFile('shadowsocks-libev-server.md', downloadPath).then(() => {
//     console.log('1')
// })
// manger.move('ES6学习笔记3.md.md','ES6学习笔记2.md.md').then(res => {
//   console.log(res)
// })
// manger.deleteFile('ES6学习笔记2.md.md').then(res => {
//   console.log(res)
// })
// manger.getListPrefix().then(res => {
//     console.log(res)
// })
manger.getState(key).then(res => {
    console.log(res)
})