/*
 * @Author: your name
 * @Date: 2020-02-06 14:01:54
 * @LastEditTime : 2020-02-14 15:34:08
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\utils\qiniuManger.js
 */
const qiniu = require('qiniu')
const axios = require('axios')
const fs = require('fs')

//understand more: https://developer.qiniu.com/kodo/sdk/1289/nodejs#rs-delete
class QiniuManger {
    constructor(accessKey,secretKey,bucket) {
        /*
        * accessKey - 七牛云提供的访问秘钥
        * secretKey - 七牛云提供的秘钥
        * bucket - 装载器
        */
        // Generate mac func 
        this.mac = new qiniu.auth.digest.Mac(accessKey,secretKey)
        this.bucket = bucket
        // Set upload place 
        this.config = new qiniu.conf.Config()
        // Space machine room
        this.config.zone = qiniu.zone.Zone_z0
        // Generate download link func
        this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config)
        // public domain name
        this.publicDownloadUrl = ''
    }
    getListPrefix() {
        let options = {
            limit: 1000,
            prefix: ''
        }
        return new Promise((resolve,reject) => {
            this.bucketManager.listPrefix(this.bucket,options,this._handleCallBack(resolve,reject))
        })

    }
    move(srcKey,destKey) {
        let options = {
            force: true
        }
        return new Promise((resolve,reject) => {
            this.bucketManager.move(this.bucket, srcKey, this.bucket, destKey, options,this._handleCallBack(resolve,reject))
        })
    }
    getState (key) {
        console.log('getState')
        // check file list info
        return new Promise((resolve,reject) => {
            this.bucketManager.stat(this.bucket, key, this._handleCallBack(resolve,reject))
        })
    }
    upLoadFile(key, localFile) {
        const options = {
            scope: `${this.bucket}:${key}`
        }
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(this.mac);
        const formUploader = new qiniu.form_up.FormUploader(this.config);
        const putExtra = new qiniu.form_up.PutExtra();
        return new Promise((resolve,reject) => {
            // upload file
            formUploader.putFile(uploadToken, key, localFile, putExtra, this._handleCallBack(resolve,reject));
        })
    }
    deleteFile(key) {
        return new Promise((resolve,reject) => {
            // delete file
            this.bucketManager.delete(this.bucket,key, this._handleCallBack(resolve,reject))
        })
    }
    downloadFile(key,path) {
        return this.getDownloadLink(key).then(link => {
            const timeStamep = +new Date()
            const url = `${link}?timeStamep=${timeStamep}`
            console.log(url)
            return axios({
                url,
                method: 'GET',
                responseType: 'stream',
                headers: {'Cache-Control': 'no-cache'}
            })
        })
        .then(response => {
            const writer = fs.createWriteStream(path)
            // console.log(response.data)
            response.data.pipe(writer)
            return new Promise((resolve,reject) => {
                writer.on('finish',() => {
                    console.log('读写成功')
                    resolve()
                })
                writer.on('error',() => {
                    console.log('读写失败')
                    reject()
                })
            })
        }).catch(err => {
            if(err) return Promise.reject({err:err.response})
        })
    }
    getDownloadLink (key) {
        /*
        * publicBucketDomain - set access domain name
        */ 
        const domainPromise = this.publicBucketDomain ? Promise.resolve(this.publicBucketDomain) 
        : this.getBucketDomain()
        return domainPromise.then((data) => {
            if(Array.isArray(data) && data.length > 0) {
                const pattern = /^https?/
                this.publicBucketDomain = pattern.test(data[0]) ? data[0] : `http://${data[0]}`
                return this.bucketManager.publicDownloadUrl(this.publicBucketDomain,key)
            } else if(this.publicBucketDomain) {
                return this.bucketManager.publicDownloadUrl(this.publicBucketDomain,key)
            } else{
                throw Error('域名失效')
            }
        })
    }
    _handleCallBack(resolve,reject) {
        // return promise
        return (respErr,respBody,respInfo) => {
            if (respErr) {
                throw respErr
            } else {
                if(respInfo.statusCode === 200) {
                    resolve(respBody)
                }else{
                    reject(respBody)
                }
            }
        }
    }
    getBucketDomain () {
        const url = `http://api.qiniu.com/v6/domain/list?tbl=${this.bucket}`
        const token = qiniu.util.generateAccessToken(this.mac,url)
        return new Promise((resolve,reject) => {
            qiniu.rpc.postWithoutForm(url,token,this._handleCallBack(resolve,reject))
        })
    }
}

module.exports = QiniuManger