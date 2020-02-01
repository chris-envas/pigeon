/*
 * @Author: Envas chris
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-02-01 17:24:29
 * @LastEditors  : Please set LastEditors
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
import SliderButton from './components/slider/button/SliderButton'
import TabList from './components/tabList/TabList'
// All css
import './public/css/reset.css'
import './public/css/common.css'
import './public/css/theme-antd.less'
import './App.css'
// from util about function or data
import {flattenArr,enumToArr} from './utils/dataProcessing'
import fileProcessing from './utils/fileProcessing'
// edit
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
const { Sider, Content } = Layout;
// require node module 
const {join,basename,extname,dirname} = window.require('path')
const {remote} = window.require('electron')
const {dialog,app} = remote
// electron store 
const Store = window.require('electron-store')
const fileStore = new Store()
const dealWithSaveFileStore = (file) => {
  // dealWith cache file in electron-store
  const saveElectronStoreFile = file.reduce((result, file) => {
    const {id, path, title, create} = file
    result[id] = {
      id,
      path,
      title,
      create
    }
    return result
  },{})
  fileStore.set('files',saveElectronStoreFile)
}
function App() {
  //original file of data
  const [files,setFiles] = useState(enumToArr(fileStore.get('files')) || [])
  // Arrys to enumerate to help munipulate file faster
  const enumfile = flattenArr(files) || {}
  // active file id
  const [activeFile_id,setActiveFile_id] = useState('')
  // open files id
  const [openedFile_ids,setOpenedFile_ids] = useState([])
  // no saved files of id 
  const [unSaveFile_ids,setUnSaveFile_ids] = useState([])
  // search list data
  const [searchedFiles, setSearchedFiles] = useState([])
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
    if(!currentFile.idLoading) {
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
    if(isSave) {
      const option = {
        type: 'info',
        title: '信息',
        message: '是否保存文件',
        buttons: ['yes','no']
      }
      dialog.showMessageBox(option)
      .then(result => {
        if(!result.response) {
          saveCurrentFile()
        }
        const newUnSaveFile_ids = unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !==  file_id)
        setUnSaveFile_ids(newUnSaveFile_ids)
        // remove curent id from openFile_ids
        const newTabList = openedFile_ids.filter(open_id => open_id !== file_id)
        setOpenedFile_ids([...newTabList])
        // if still tab-list , set the active to the last opened tab
        if(openedFile_ids.length) {
          setActiveFile_id(openedFile_ids[0])
        }
      })
    }else{
      const newUnSaveFile_ids = unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !==  file_id)
        setUnSaveFile_ids(newUnSaveFile_ids)
        // remove curent id from openFile_ids
        const newTabList = openedFile_ids.filter(open_id => open_id !== file_id)
        setOpenedFile_ids([...newTabList])
        // if still tab-list , set the active to the last opened tab
        if(openedFile_ids.length) {
          setActiveFile_id(openedFile_ids[0])
        }
    }
  }
  const fileChange = (activeFile_id,value) => {
    // loop through original file to update new file array
    enumfile[activeFile_id].body = value
    setFiles(enumToArr(enumfile))
    if(!unSaveFile_ids.includes(activeFile_id)) {
      // check unsaved file to add new unsaved file
      setUnSaveFile_ids([...unSaveFile_ids,activeFile_id])
    }
  }
  const onFileDelete = (id) => {
    //delete file data and update electron store
    const getFile = files.find(file => file.id === id)
    if(getFile) {
      delete enumfile[id]
      // delete opened tab 
      onCloseTab(id)
      dealWithSaveFileStore(enumToArr(enumfile))
      setFiles(enumToArr(enumfile))
      return
      fileProcessing.deleteFile(getFile.path)
      .then(() => {
      })
    }
  }
  const onSaveEditTitle = (id,title,isNew) => {
    // loop through original file to update the title
    const {path} = files.find(file => file.id === id)
    const checkFileRepeatTitle = files.filter(file => file.title === title)
    if(title && !checkFileRepeatTitle.length) {
      const newPath = join(dirname(path),`${title}.md`)
      if(isNew) {
        // if new file we should update files and save electron store 
        enumfile[id].title = title
        enumfile[id].isNew = false
        dealWithSaveFileStore(enumToArr(enumfile))
        setFiles(enumToArr(enumfile))
        return
        // fileProcessing.writeFile(newPath,enumfile[id].body)
        // .then(() => {
        //   enumfile[id].title = title
        //   enumfile[id].isNew = false
        //   enumfile[id].path = newPath
        //   dealWithSaveFileStore(enumToArr(enumfile))
        //   setFiles(enumToArr(enumfile))
        // })
      }else{
        const oldPath = join(dirname(path),`${enumfile[id].title}.md`)
        fileProcessing.renameFile(oldPath,newPath)
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
        dialog.showErrorBox('错误提示','文件名称不能为空或已经有相同文件')
        // alert('文件名称不能为空或已经有相同文件')
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
    const newFile_id = uuidv4()
    const newFiles = [
      ...files,
      {
        id: newFile_id,
        title: 'Untitled.md',
        body: '',
        create: +new Date(),
        isNew: true,
        path: ''
      }
    ]
    console.log('newFiles',newFiles)
    setFiles(newFiles)
  }
  const saveCurrentFile = () => {
    const {path,title} = files.find(file => file.id === activFile.id)
    console.log(path)
    if(path === '') {
      dialog.showSaveDialog({
        title: 'create file',
        defaultPath: join(savedLocationPath,title),
      })
      .then(result => {
        console.log(result)
        if(result.filePath) {
          const alradyFile = files.find(file => file.path === result.filePath)
          fileProcessing.writeFile(result.filePath,activFile.body)
          .then(() => {
            const newFiles = files.map(file => {
              if(file.id === activFile.id) {
                file.path = result.filePath
              }
              return file
            })
            console.log(newFiles)
            setFiles(newFiles)
            setUnSaveFile_ids(unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !== activFile.id))
          })
        }
      })
      return 
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

  return (
    <div className="App">
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
            activeFile_id={activeFile_id}
            />
            <div className="left-panel_ground">
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
            </div>
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
              key={activFile&&activFile.id} 
              value={activFile && activFile.body}
              onChange={value => {
                fileChange(activFile.id,value)
              }}
              />
            </Fragment>
          }
        </Content>
      </Layout>
    </Layout>
    </div>
  );
}

export default App;
