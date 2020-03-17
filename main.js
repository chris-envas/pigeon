/*
 * @Author: Evans chris 
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime: 2020-02-21 22:07:54
 * @LastEditors: Please set LastEditors
 * @Description: Electron main process
 * @FilePath: \cloud-electron-docs\main.js
 */
const menuTemplate = require('./src/utils/menuTemplate')
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain,
	dialog
} = require('electron')
const isDev = require('electron-is-dev')
const {
	autoUpdater
} = require('electron-updater')
const CreateWindow = require('./CreateWindow')
const path = require('path')
const Store = require('electron-store')
const settingsStore = new Store({
	name: 'Settings'
})
const fileStore = new Store()
const qiniuManger = require('./src/utils/qiniuManger')
const createQiniuManger = () => {
	const accessKey = settingsStore.get('accessKey')
	const secretKey = settingsStore.get('secretKey')
	const bucketName = settingsStore.get('bucketName')
	return new qiniuManger(accessKey, secretKey, bucketName)
}
let mainWindow, settingsWindow = null
const mainOption = {
	width: 1200,
	height: 800,
	webPreferences: {
		nodeIntegration: true
	}
}

app.on("ready", () => {
	// if (isDev) {
	// 	autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml') // configuration can trigger update functionality during development
	// }
	// autoUpdater.autoDownload = false // 取消自动下载
	// autoUpdater.checkForUpdates() // 检查更新
	// autoUpdater.on('error', error => {
	// 	dialog.showErrorBox('Check Update Error', error === null ? 'unknow' : error)
	// })
	// // electron-builder found lastest release
	// autoUpdater.on('update-available', () => {
	// 	dialog.showMessageBox({
	// 		type: 'info',
	// 		title: '发现新版本',
	// 		message: '是否更新到最新应用',
	// 		buttons: ['开始下载', '暂不更新'],
	// 	}).then(status => {
	// 		console.log(JSON.stringify(status))
	// 		if (status.response == '0') {
	// 			console.log('开始下载')
	// 			autoUpdater.downloadUpdate()
	// 		}
	// 	})
	// })
	// // electron-builder check no lastest release
	// autoUpdater.on('update-not-available', () => {
	// 	dialog.showMessageBox({
	// 		title: '最新版本',
	// 		message: '已获得最新版本',
	// 	})
	// })
	// // electron-builder listen lastest release download progress
	// autoUpdater.on('download-progress', progressObj => {
	// 	let log_message = `download speed: ${progressObj.bytesPerSecond}`
	// 	log_message += `- download' ${progressObj.percent} %`
	// 	log_message += `(${progressObj.transferred}/${progressObj.total})`
	// 	console.log(log_message)
	// })
	// // electron-builder listen update download event
	// autoUpdater.on('update-downloaded', () => {
	// 	dialog.showMessageBox({
	// 		title: '安装更新',
	// 		message: '更新下载完毕，将重启应用完成更新'
	// 	}).then(() => {
	// 		setImmediate(() => autoUpdater.quitAndInstall())
	// 	})
	// })

	mainWindow = new BrowserWindow(mainOption)
	mainWindow.webContents.openDevTools()
	let url = isDev ? 'http://localhost:3000/' : `file://${path.join(__dirname, './index.html')}`
	if (url) mainWindow.loadURL(url)
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
	// setting.html emit save qiniu config and update menu template
	ipcMain.on('config-is-saved', () => {
		let qiniuMenu = process.platform === 'darwin' ? menu.items[1] : menu.items[1]
		const switchItems = (toggle) => {
			[1, 2, 3].forEach(number => {
				qiniuMenu.submenu.items[number].enabled = toggle
			})
		}
		const qiniuIsConfiged = ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
		if (qiniuIsConfiged) {
			switchItems(true)
		} else {
			switchItems(false)
		}
	})
	ipcMain.on('upload-file', (event, msg) => {
		console.log(msg)
		const {
			key,
			path
		} = msg
		const manger = createQiniuManger()
		manger.upLoadFile(key, path).then(data => {
				console.log(`同步成功：${data}`)
				if (msg.manual) {
					dialog.showMessageBox({
						type: 'info',
						title: '上传成功',
						message: `成功上传${key}文件`
					})
				}
				mainWindow.webContents.send('active-file-uploaded')
			})
			.catch(err => {
				dialog.showErrorBox('同步失败', `错误原因:${JSON.stringify(err)}\n请检查七牛云配置参数是否正确！`)
			})
	})
	// qiniu download file
	ipcMain.on('download-file', (event, msg) => {
		console.log("download-file msg: \n"+JSON.stringify(msg))
		const mananger = createQiniuManger()
		const {
			key,
			path,
			id
		} = msg
		mananger.getState(key).then(resp => {
			console.log(resp)
			const fileObj = fileStore.get('files')
			const qiniuUpdateTime = Math.round(resp.putTime / 10000)
			const localUpdateTime = fileObj[msg.id].updateAt ? fileObj[msg.id].updateAt : false
			if (localUpdateTime) {
				console.log(qiniuUpdateTime, localUpdateTime)
				if (qiniuUpdateTime > localUpdateTime) {
					mananger.downloadFile(key, path).then(() => {
						console.log('下载成功')
						mainWindow.webContents.send('file-downloaded', {
							status: '200',
							id
						})
					})
				} else {
					mainWindow.webContents.send('file-downloaded', {
						status: '303',
						id
					})
				}
			}
		}, error => {
			if (error) {
				mainWindow.webContents.send('file-downloaded', {
					status: '612',
					id
				})
			}
		})
	})
	ipcMain.on('download-all-to-qiniu', (event, msg) => { 
		const mananger = createQiniuManger()
		const savedLocation = settingsStore.get('savedFileLocation')
		const storeFiles = fileStore.get('files') || {}
		let cloudFiles = null
		mananger.getListPrefix().then(res => {
			// if it is exists local file, will be filter
			if(Object.keys(storeFiles).length > 1) {
				let localFiles = Object.keys(storeFiles).reduce((original,key) => {
					original[storeFiles[key].title] = storeFiles[key]
					return original
				},{})
				cloudFiles = res.items
				.map(file => {
					if(localFiles[file.key]){
						let localFilePath = localFiles[file.key].path ? localFiles[file.key].path * 10000 : false
						if(localFilePath == savedLocation) {
							let localUpdateTime = localFiles[file.key].updateAt ? localFiles[file.key].updateAt * 10000 : 0
							let cloudUpdateTime = file.putTime
							console.log(localUpdateTime,cloudUpdateTime)
							if(cloudUpdateTime > localUpdateTime) return file
						}else{
							return file
						}
					} else{
						return file
					}
				})
			}else{
				cloudFiles = res.items
			}
			
			console.log(cloudFiles)
		
			// cloudFiles.forEach(file => {
			// 	let key = file.key
			// 	let savePath = path.join(savedLocation, key)
			// 	mananger.downloadFile(key, savePath).then(() => {
			// 		mainWindow.webContents.send('all-fileDownload', {
			// 			status: '200',
			// 			path: savePath,
			// 			title: key
			// 		})
			// 	}).catch(err => {
			// 		mainWindow.webContents.send('all-fileDownload', {
			// 			status: '404',
			// 		})
			// 	})
			// })
			let promiseSqueue = cloudFiles.map(file => {
				let key = file.key
				let savePath = path.join(savedLocation, key)
				return mananger.downloadFile(key, savePath).then(() => {
					mainWindow.webContents.send('all-fileDownload', {
						status: '200',
						path: savePath,
						title: key
					})
					return Promise.resolve()
				}).catch(err => {
					mainWindow.webContents.send('all-fileDownload', {
						status: '404',
					})
					return Promise.reject()
				})
			})

			Promise.all(promiseSqueue).then((value) => {
				dialog.showMessageBox({
					type: 'info',
					title: '下载成功',
					message: `云端文件下载已完成`
				})
			},(err) => {
				dialog.showErrorBox('下载失败', '文件队列下载发生意外，请稍后再试')
			})
			
		})
	})
	// qiniu upload all files
	ipcMain.on('upload-all-to-qiniu', () => {
		mainWindow.webContents.send('loading-status', true)
		const files = fileStore.get('files') || {}
		const manger = createQiniuManger()
		const uploadFilePromiseArr = Object.keys(files).map(key => manger.upLoadFile(`${files[key].title}`, files[key].path))
		Promise.all(uploadFilePromiseArr).then(result => {
			if (result) {
				dialog.showMessageBox({
					type: 'info',
					title: '上传成功',
					message: `成功上传${result.length}个文件`
				})
			}
			console.log(result)
		}).catch(error => {
			dialog.showErrorBox('上传失败', `错误原因：${error}`)
		}).finally(() => {
			mainWindow.webContents.send('loading-status', false)
			// update file data structure
			mainWindow.webContents.send('upload-files-structrue')
		})
	})
	ipcMain.on('rename-to-qiniu', (event, msg) => {
		const {
			title,
			newTitle
		} = msg
		const manger = createQiniuManger()
		manger.move(title, newTitle).then(res => {
			if (!res) {
				dialog.showMessageBox({
					type: 'info',
					title: '更换名称成功',
					message: `${title}已变更为${newTitle}`
				})
				// mainWindow.webContents.send('rename-file-structrue')
			}
		}).catch(err => {
			if (err) {
				dialog.showErrorBox('失败', `云空间不存在${title}文件`)
			}
		})
	})
	ipcMain.on('delete-to-qiniu', (event, msg) => {
		const {
			key
		} = msg
		const manger = createQiniuManger()
		manger.deleteFile(key).then(res => {
			if (!res) {
				dialog.showMessageBox({
					type: 'info',
					title: '删除成功',
					message: `${key}已被删除`
				})
				// mainWindow.webContents.send('rename-file-structrue')
			}
		}).catch(err => {
			if (err) {
				console.log(err)
				dialog.showErrorBox('失败', `云空间不存在${key}文件`)
			}
		})
	})
})