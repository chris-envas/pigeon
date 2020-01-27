/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime: 2020-01-25 21:01:47
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\main.js
 */
const { app, BrowserWindow, Menu  } = require('electron')
const isDev = require('electron-is-dev')

const mainOption = {
	width: 1200,
	height: 800,
	webPreferences: {
		nodeIntergration: true
	}
}

app.on("ready",() => {
	const mainWindow = new BrowserWindow(mainOption)
	mainWindow.webContents.openDevTools()
	let url = isDev ? 'http://localhost:3000/' : ''
	if(url) mainWindow.loadURL(url)
	Menu.setApplicationMenu(null)
})