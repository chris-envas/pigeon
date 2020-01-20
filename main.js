const { app, BrowserWindow } = require('electron')
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
})