const {
    app,
    shell,
    ipcMain
} = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings'})
const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))

let enableAutoSync = settingsStore.get('enableAutoSync')
let menuTemplate = [{
        label: '文件',
        submenu: [{
            label: '新建文件',
            accelerator: 'CmdOrCtrl+N',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('create-new-file')
            }
        }, {
            label: '保存文件',
            accelerator: 'CmdOrCtrl+S',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('save-edit-file')
            }
        }, {
            label: '搜索文件',
            accelerator: 'CmdOrCtrl+F',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('search-file')
            }
        }, {
            label: '打开文件',
            accelerator: 'CmdOrCtrl+O',
            click: (menuItem, browserWindow, event) => {
                browserWindow.webContents.send('import-file')
            }
        }]
    },
    {
        label: '云同步',
        submenu: [{
          label: '设置',
          accelerator: 'CmdOrCtrl+d',
          click: () => {
            ipcMain.emit('open-settings-window')
          }
        }, {
          label: '自动同步',
          type: 'checkbox',
          enabled: qiniuIsConfiged,
          checked: enableAutoSync,
          click: () => {
            settingsStore.set('enableAutoSync', !settingsStore.get('enableAutoSync'))
          }
        }, {
          label: '全部同步至云端',
          enabled: qiniuIsConfiged,
          click: () => {
            ipcMain.emit('upload-all-to-qiniu')
          }
        }, {
          label: '从云端下载到本地',
          enabled: qiniuIsConfiged,
          click: () => {
            ipcMain.emit('download-all-to-qiniu')
          }
        }]
    },
    {
        label: '视图',
        submenu: [{
                label: '刷新当前页面',
                accelerator: 'CmdOrCtrl+R',
                click: (item, focusedWindow) => {
                    if (focusedWindow)
                        focusedWindow.reload();
                }
            },
            {
                label: '切换全屏幕',
                accelerator: (() => {
                    if (process.platform === 'darwin')
                        return 'Ctrl+Command+F';
                    else
                        return 'F11';
                })(),
                click: (item, focusedWindow) => {
                    if (focusedWindow)
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                }
            },
            // {
            //     label: '切换开发者工具',
            //     accelerator: (function () {
            //         if (process.platform === 'darwin')
            //             return 'Alt+Command+I';
            //         else
            //             return 'Ctrl+Shift+I';
            //     })(),
            //     click: (item, focusedWindow) => {
            //         if (focusedWindow)
            //             focusedWindow.toggleDevTools();
            //     }
            // },
        ]
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [{
            label: '关于我',
            click: () => {
                shell.openExternal('https://github.com/luojinxu520/pigeon')
            }
        }]
    }
]

module.exports = menuTemplate