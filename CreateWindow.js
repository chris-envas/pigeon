/*
 * @Author: your name
 * @Date: 2020-02-08 18:10:39
 * @LastEditTime : 2020-02-09 22:13:11
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\CreateWindow.js
 */
const { BrowserWindow } = require('electron')

class CreateWindow extends BrowserWindow {
    constructor(config,urlLocation) {
        const baseConfig = {
            width: 800,
            height: 600,
            show: false,
        }
        const finalConfig = {...baseConfig, ...config}
        super(finalConfig)
        this.loadURL(urlLocation)
        this.once('ready-to-show',() => {
            this.show()
        })
    }
}

module.exports = CreateWindow