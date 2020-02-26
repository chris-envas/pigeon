/*
 * @Author: Envas chris
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime: 2020-02-21 21:03:31
 * @LastEditors: Please set LastEditors
 * @Description: every component interaction
 * @FilePath: \cloud-electron-docs\src\App.js
 */
import React, {Fragment,useState} from 'react';
import { Layout } from 'antd'
// get universally unique identifier
import uuidv4 from 'uuid/v4'
// All  components
import FileSearch from './components/slider/search/FileSearch'
import FileLists from './components/slider/lists/FileLists'
import TabList from './components/tabList/TabList'
import Loader from './components/global/Loader'
// All css
import './public/css/normalize.css'
import './public/css/common.css'
import './public/css/theme-antd.less'
import './App.css'
// from util about function or data
import {flattenArr,enumToArr} from './utils/dataProcessing'
import fileProcessing from './utils/fileProcessing'
// edit
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
// import Editor from './components/edit/Editor'
// hook
import useIpcRenderer from './components/hooks/useIpcRenderer'
import useDrag from './components/hooks/useDrag'

const { Sider, Content } = Layout;
// require node module 
const {join,basename,extname,dirname} = window.require('path')
const {remote,ipcRenderer} = window.require('electron')
const {dialog,app} = remote
// electron store 
const Store = window.require('electron-store')
const fileStore = new Store()
// judge config is presence 
const settingsStore = new Store({ name: 'Settings'})
const dealWithSaveFileStore = (file) => {
  // dealWith cache file in electron-store
  const saveElectronStoreFile = file.reduce((result, file) => {
    const {id, path, title, create, isSynced, updateAt} = file
    result[id] = {
      id,
      path,
      title,
      create,
      isSynced,
      updateAt
    }
    // console.log('dealWithSaveFileStore',result)
    return result
  },{})
  // console.log('saveElectronStoreFile',saveElectronStoreFile)
  fileStore.set('files',saveElectronStoreFile)
}

function App() {
  //get data from electron store 
  const [files,setFiles] = useState(enumToArr(fileStore.get('files')) || [])
  // Arrys to enumerate to help munipulate file faster
  const enumfile = flattenArr(files) || {}
  console.log('enumfile',enumfile)
  console.log('enumfile', enumToArr(enumfile))
  // active file id
  const [activeFile_id,setActiveFile_id] = useState('')
  // open files id
  const [openedFile_ids,setOpenedFile_ids] = useState([])
  // no saved files of id 
  const [unSaveFile_ids,setUnSaveFile_ids] = useState([])
  // search list data
  const [searchedFiles, setSearchedFiles] = useState([])
  // loading staus
  const [loading, setLoading] = useState(false)
  // List of opened tab 
  const openedFile = openedFile_ids.map(open_id => {
    return enumfile[open_id]
  })
  const savedLocationPath = app.getPath('documents')
  // currently file 
  const activFile = enumfile[activeFile_id]
  const onFileClick = (file_id) => {
    // fileList click event
    const currentFile = enumfile[file_id]
    const {isLoading } = currentFile 
    if(!isLoading) {
      if(enumfile[file_id].path) {
        fileProcessing.readFile(enumfile[file_id].path).then(value => {
          const newFile = {...enumfile[file_id],body:value,isLoading: true}
          setFiles(enumToArr({...enumfile,[file_id]: newFile}))
        })
      }
    }
    // set current file 
    setActiveFile_id(file_id)
    if(!openedFile_ids.includes(file_id)) {
      // set currently open file
      setOpenedFile_ids([...openedFile_ids,file_id])
    }
  }
  // tab click event
  const onTabClick = (file_id) => {
    setActiveFile_id(file_id)
  }
  // tab close event
  const onCloseTab = (file_id) => {
    const isSave = unSaveFile_ids.includes(file_id)
    console.log('isSave',isSave)
    if(isSave) {
      const option = {
        type: 'info',
        title: '信息',
        message: '是否保存文件',
        buttons: ['yes','no']
      }
      dialog.showMessageBox(option)
      .then(result => {
        console.log(result)
        const newUnSaveFile_ids = unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !==  file_id)
        setUnSaveFile_ids(newUnSaveFile_ids)
        // remove curent id from openFile_ids
        const newTabList = openedFile_ids.filter(open_id => open_id !== file_id)
        setOpenedFile_ids([...newTabList])
        // if still tab-list , set the active to the last opened tab
        if(openedFile_ids.length) {
          setActiveFile_id(openedFile_ids[0])
        }
        if(!result.response) {
          // new file save
          saveCurrentFile()
        }
        else{
          // if new file no save we need update files
          const { [file_id]: value, ...leftOver} = enumfile
          console.log(leftOver)
          delete enumfile[file_id]
          dealWithSaveFileStore(enumToArr(enumfile))
          setFiles(enumToArr(enumfile))
        }
      })
    } else {
      const newUnSaveFile_ids = unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !==  file_id)
      setUnSaveFile_ids(newUnSaveFile_ids)
      // remove curent id from openFile_ids
      const newTabList = openedFile_ids.filter(open_id => open_id !== file_id)
      console.log('newTabList',newTabList)
      setOpenedFile_ids(newTabList)
      // if still tab-list , set the active to the last opened tab
      if(newTabList.length) {
        setActiveFile_id(newTabList[0])
      }
    }
  }
  const fileChange = (activeFile_id,value) => {
    // if the value changes
    if(value !== enumfile[activeFile_id].body) {
       // loop through original file to update new file array
      enumfile[activeFile_id].body = value
      setFiles(enumToArr(enumfile))
      if(!unSaveFile_ids.includes(activeFile_id)) {
        // check unsaved file to add new unsaved file
        setUnSaveFile_ids([...unSaveFile_ids,activeFile_id])
      }
    }
  }
  const onFileDelete = (id) => {
    //delete file data and update electron store
    const getFile = files.find(file => file.id === id)
    console.log(getFile,files,id)
    if(getFile) {
      delete enumfile[id]
      // delete opened tab 
      onCloseTab(id)
      // update electron store
      dealWithSaveFileStore(enumToArr(enumfile))
      // update files
      setFiles(enumToArr(enumfile))
      return
      // it is dangererous to delete directly
      fileProcessing.deleteFile(getFile.path)
      .then(() => {
      })
    }
  }
  const onSaveEditTitle = (id,title,isNew) => {
    console.log('onSaveEditTitle')
    // loop through original file to update the title
    const {path} = files.find(file => file.id === id)
    if(title) {
      const newPath = join(dirname(path),`${title}.md`)
      if(isNew) {
        // if new file we should update files and save electron store 
        enumfile[id].title = title
        enumfile[id].isNew = false
        dealWithSaveFileStore(enumToArr(enumfile))
        setFiles(enumToArr(enumfile))
      }else{
        // if old file we directly change file name 
        fileProcessing.renameFile(path,newPath)
        .then(() => {
          enumfile[id].title = title
          enumfile[id].isNew = false
          enumfile[id].path = newPath
          dealWithSaveFileStore(enumToArr(enumfile))
          setFiles(enumToArr(enumfile))
        })
      }
    }else{
      const {isNew} = files.find(file =>  file.id === id)
      if(isNew) {
        dialog.showErrorBox('错误提示','文件名称不能为空')
        // amazingly extended
        const { [id]: value, ...afterDelete} = enumfile
        // delete enumfile[id]
        setFiles(enumToArr(afterDelete))
      }
    }
  }
  const onFileSearch = keyword => {
    if(keyword) {
      const newFiles = files.filter(file => file.title.includes(keyword))
      setSearchedFiles(newFiles)
    }else{
      setSearchedFiles([])
    }
  }
  const createNewFile = () => {
    // create file and merge new file array
    const newFiles = [
      ...files,
      {
        id: uuidv4(),
        title: 'Untitled.md',
        body: '',
        create: +new Date(),
        isNew: true,
        path: ''
      }
    ]
    setFiles(newFiles)
  }
  const saveCurrentFile = () => {
    console.log('activFile',activFile)
    const {path,title} = activFile
    if(path === '') {
      dialog.showSaveDialog({
        title: 'create file',
        defaultPath: join(savedLocationPath,title),
      })
      .then(result => {
        if(result.filePath) {
          fileProcessing.writeFile(result.filePath,activFile.body)
          .then(() => {
            const newFiles = files.map(file => {
              if(file.id === activFile.id) {
                file.path = result.filePath
              }
              return file
            })
            setFiles(newFiles)
            setUnSaveFile_ids(unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !== activFile.id))
          })
        }
      })
    }else{
      fileProcessing.writeFile(path,activFile.body)
      .then(() => {
        const uploadCloudDoc = ['accessKey', 'secretKey', 'bucketName','enableAutoSync'].every(key => !!settingsStore.get(key))
        if(uploadCloudDoc) {
          // send to main process upload-file event
          ipcRenderer.send('upload-file',{key:`${title}md`,path})
        }
        setUnSaveFile_ids(unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !== activFile.id))
      })
    }
  }
  const importFiles = () => {
    const options = {
      title: 'Choose import Markdown file',
      properties: ['openFile','multiSelections'],
      filters: [
        {
          name: 'Markdown files', extensions: ['md']
        }
      ]
    }
    dialog.showOpenDialog(options)
    .then(result => {
      if(Array.isArray(result.filePaths)) {
        // determine if the file already exists
        const filterReadPaths = result.filePaths.filter(path => {
          const jugementFile = files.find(file => file.path === path)
          return !jugementFile
        })
        const importFiles = filterReadPaths.map(path => {
          return {
            id: uuidv4(),
            title: basename(path,extname(path)),
            path
          }
        })
        dealWithSaveFileStore([...files,...importFiles])
        setFiles([...files,...importFiles])
        if(importFiles.length > 0) {
          dialog.showMessageBox({
            type:'info',
            title: '提示',
            message: `成功导入${importFiles.length}个文件`
          })
        }
      }
    })
  }
  // current file upload to the qiniu
  const activeUploaded = () => {
    const { id } = activFile
    const modifiedFile = {...enumfile[id], isSynced: true, updateAt: (+new Date())}
    const newFiles = { ...enumfile, [id]: modifiedFile}
    dealWithSaveFileStore(enumToArr(newFiles))
    setFiles(enumToArr(newFiles))
  }
  // main process send info ,this file should download 
  const fileDownloaded = (event, msg) => {
    console.log('fileDownloaded',msg)
    const currentFile = enumfile[msg.id]
    const {id, path} = currentFile
    fileProcessing.readFile(path).then(value => {
      let newFile 
      if(msg.status === 200) {
        newFile = { ...enumfile[id], body: value, isLoading: true, isSynced: true, updateAt: (+new Date())}
      } else{
        newFile = { ...enumfile[id], body: value, isLoading: true}
      }
      const newFiles = { ...enumfile, [id]: newFile}
      dealWithSaveFileStore(enumToArr(newFiles))
      setFiles(enumToArr(newFiles))
    })
  }
  const pullCloudFile = (file_id) => {
    // get sync auto
    const getAutoSync = () => ['accessKey', 'secretKey', 'bucketName', 'enableAutoSync'].every(key => !!settingsStore.get(key))
    console.log('getAutoSync',getAutoSync())
    if(getAutoSync()) {
      const currentFile = enumfile[file_id]
      const { id, title, path } = currentFile 
      ipcRenderer.send('download-file',{
        key: `${title}md`,
        path,
        id
      })
    }
  } 
  const loadingStatus = (event,status) => {
    setLoading(status)
  }
  // use useIpcRenderer hook, receive information from the main process
  const formMainInformation = {
    'create-new-file': createNewFile,
    'save-edit-file': saveCurrentFile,
    'import-file': importFiles,
    'active-file-uploaded': activeUploaded,
    'file-downloaded': fileDownloaded,
    'loading-status': loadingStatus
  }
  // ipcRender listen main process send info for the hook
  useIpcRenderer(formMainInformation)
  // web drag event
  const dragFileSave = (params) => {
    const draptFile = {...params, id: uuidv4()}
    console.log(draptFile)
    dealWithSaveFileStore([...files,draptFile])
    setFiles([...files,draptFile])
  }
  useDrag(dragFileSave)

  return (
    <div className="App">
      {
        loading &&
        <Loader />
      }
     <Layout>
      <Sider
      >
        <div className="left-panel">
            <FileSearch 
            onFileSearch={onFileSearch}/> 
            <FileLists 
            files={searchedFiles.length > 0 ?  searchedFiles : files.length > 0 ? files : []}
            onFileClick = {onFileClick}
            onFileDelete = {onFileDelete}
            onSaveEditTitle = {onSaveEditTitle}  
            pullCloudFile = {pullCloudFile}
            activeFile_id={activeFile_id}
            />
            {/* <div className="left-panel_ground">
              <SliderButton 
              text='新建'
              type='primary'
              onclick={createNewFile}/>
              <SliderButton 
              text='导入'
              onclick={importFiles}/>
              <SliderButton 
              text='保存'
              onclick={saveCurrentFile}
              />
            </div> */}
        </div>
      </Sider>
      <Layout>
        <Content>
          { !openedFile.length &&
            <div 
            className="tab-none">
              选择或者创建新的 Markdown 文档
            </div>
          }
          {
            openedFile.length > 0 && 
            <Fragment>
               <TabList 
                files={openedFile}
                unSaveFile_ids={unSaveFile_ids}
                onTabClick={onTabClick}
                onCloseTab={onCloseTab}
                activeFile_id={activeFile_id}
              /> 
              <SimpleMDE
              key={activFile && activFile.id} 
              value={activFile && activFile.body}
              onChange={value => {
                fileChange(activFile.id,value)
              }}            
              />
              {/* <Editor 
              value={activFile && activFile.body}
              onChange={value => {
                fileChange(activFile.id,value)
              }}/> */}
            </Fragment>
          }
        </Content>
      </Layout>
    </Layout>
    </div>
  );
}

export default App;
