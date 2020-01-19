const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')

const mainOption = {
	width: 1024,
	height: 600,
	webPreferences: {
		nodeIntergration: true
	}
}

app.on("ready",() => {
	const mainWindow = new BrowserWindow(mainOption)
	let url = isDev ? 'http://localhost:3000/' : ''
	if(url) mainWindow.loadURL(url)
})