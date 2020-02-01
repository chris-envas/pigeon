/*
 * @Author: envas chris
 * @Date: 2020-01-30 16:41:56
 * @LastEditTime : 2020-01-31 14:02:33
 * @LastEditors  : Please set LastEditors
 * @Description: file system control function 
 * @FilePath: \cloud-electron-docs\src\utils\fileProcessing.js
 */
const fs = window.require('fs').promises

const fileProcessing =  {
    readFile: (path) => {   
       return fs.readFile(path,{encoding:'utf8'})
    },
    writeFile: (path,content) => {
        console.log(path,content)
       return fs.writeFile(path,content,{encoding: 'utf8'})
    },
    renameFile: (path,newPath) => {
        return fs.rename(path,newPath)
    },
    deleteFile: (path) => {
        return fs.unlink(path)
    }
}

export default fileProcessing