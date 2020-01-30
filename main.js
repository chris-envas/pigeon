/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-30 17:09:24
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\main.js
 */
const { app, BrowserWindow, Menu  } = require('electron')
const isDev = require('electron-is-dev')

const mainOption = {
	width: 1200,
	height: 800,
	webPreferences: {
		nodeIntegration: true
	}
}

app.on("ready",() => {
	const mainWindow = new BrowserWindow(mainOption)
	mainWindow.webContents.openDevTools()
	let url = isDev ? 'http://localhost:3000/' : ''
	if(url) mainWindow.loadURL(url)
	// Menu.setApplicationMenu(null)
})