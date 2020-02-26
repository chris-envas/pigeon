/*
 * @Author: Evans chris 
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime: 2020-02-21 22:07:54
 * @LastEditors: Please set LastEditors
 * @Description: Electron main process
 * @FilePath: \cloud-electron-docs\main.js
 */
const menuTemplate = require('./src/utils/menuTemplate')
const { app, BrowserWindow, Menu, ipcMain,dialog } = require('electron')
const isDev = require('electron-is-dev')
const {autoUpdater} = require('electron-updater')
const CreateWindow = require('./CreateWindow')
const path = require('path')
const Store = require('electron-store')
const settingsStore = new Store({name: 'Settings'})
const fileStore = new Store()
const qiniuManger = require('./src/utils/qiniuManger')
const createQiniuManger = () =>{
	const accessKey = settingsStore.get('accessKey')
	const secretKey = settingsStore.get('secretKey')
	const bucketName = settingsStore.get('bucketName')
	return new qiniuManger(accessKey,secretKey,bucketName)
}
let mainWindow, settingsWindow = null
const mainOption = {
	width: 1200,
	height: 800,
	webPreferences: {
		nodeIntegration: true
	}
}

app.on("ready",() => {
	// autoUpdater.setFeedURL('https://github.com/luojinxu520/electron-lessons/releases')
	// const log = require("electron-log")
    // log.transports.file.level = "debug"
	// autoUpdater.logger = log
	// autoUpdater.checkForUpdatesAndNotify()
	if(isDev) {
		autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml')
	}
	autoUpdater.autoDownload = false // 取消自动下载
	autoUpdater.checkForUpdates() // 检查更新
	autoUpdater.on('error', error => {
		dialog.showErrorBox('Check Update Error', error === null ? 'unknow' : error)
	})
	autoUpdater.on('update-available', () => {
		dialog.showMessageBox({
			type: 'info',
			title: '发现新版本',
			message: '是否更新到最新应用',
			buttons: ['是','否'],
		}).then(status => {
			console.log(JSON.stringify(status))
			if(status.response == '0') {
				console.log('开始下载')
				autoUpdater.downloadUpdate()
			}
		})
	})
	autoUpdater.on('update-not-available', () => {
		dialog.showMessageBox({
			title: '最新版本',
			message: '已获得最新版本',
		})
	})
	autoUpdater.on('download-progress', progressObj => {
		let log_message = `download speed: ${progressObj.bytesPerSecond}`
		log_message += `- download' ${progressObj.percent} %`
		log_message += `(${progressObj.transferred}/${progressObj.total})`
		console.log(log_message)
	})
	autoUpdater.on('update-downloaded', () => {
		dialog.showMessageBox({
			title: '安装更新',
			message: '更新下载完毕，将重启应用完成更新'
		}).then(() => {
			setImmediate(() => autoUpdater.quitAndInstall())
		})
	})
	mainWindow = new BrowserWindow(mainOption)
	mainWindow.webContents.openDevTools()
	let url = isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, './index.html')}`
	if(url) mainWindow.loadURL(url)
	let menu = Menu.buildFromTemplate(menuTemplate)
	Menu.setApplicationMenu(menu)
	// open setting html
	ipcMain.on('open-settings-window', () => {
		const settingsWindowConfig = {
			width: 800,
			height: 600,
			parent: mainWindow,
			resizable: false,
			webPreferences: {
				nodeIntegration: true
			}
		}
		const settingsFileLocation = `file://${path.join(__dirname, './settings/settings.html')}`
		settingsWindow = new CreateWindow(settingsWindowConfig, settingsFileLocation)
		// settingsWindow.webContents.openDevTools()
		settingsWindow.removeMenu()
		settingsWindow.on('closed', () => {
			settingsWindow = null
		})
	})
	ipcMain.on('config-is-saved', () => {
		let qiniuMenu = process.platform === 'darwin' ? menu.items[1] : menu.items[1]
		const switchItems = (toggle) => {
		[1, 2, 3].forEach(number => {
			qiniuMenu.submenu.items[number].enabled = toggle
		})
		}
		const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
		if (qiniuIsConfiged) {
		switchItems(true)
		} else {
		switchItems(false)
		}
	})
	ipcMain.on('upload-file',(event,msg) => {
		const { key, path } = msg
		const manger = createQiniuManger()
		manger.upLoadFile(key,path).then(data => {
			console.log(`同步成功：${data}`)
			mainWindow.webContents.send('active-file-uploaded')
		})
		.catch(err => {
			dialog.showErrorBox('同步失败',`错误原因:${JSON.stringify(err)}\n请检查七牛云配置参数是否正确！`)
		}) 
	})
	ipcMain.on('download-file',(event,msg) => {
		const mananger = createQiniuManger()
		const { key, path, id } = msg
		mananger.getState(key).then(resp => {
			const fileObj = fileStore.get('files')
			const qiniuUpdateTime = Math.round(resp.putTime / 1000)
			const localUpdateTime = fileObj[msg.id].updateAt ? fileObj[msg.id].updateAt : false
			if(localUpdateTime) {
				console.log(qiniuUpdateTime,localUpdateTime)
				if(qiniuUpdateTime > localUpdateTime) {
					mananger.downloadFile(key, path).then(() => {
						mainWindow.webContents.send('file-downloaded',{
							status: '200',
							id
						})
					})
				}else{
					mainWindow.webContents.send('file-downloaded',{
						status: '404',
						id
					})
				}
			}
		},error => {
			if(error) {
				mainWindow.webContents.send('file-downloaded',{
					status: '612',
					id
				})
			}
		})
	})
	ipcMain.on('upload-all-to-qiniu', () => {
		mainWindow.webContents.send('loading-status',true)
		setTimeout(() => {
			mainWindow.webContents.send('loading-status',false)
		},3000)
	})
})