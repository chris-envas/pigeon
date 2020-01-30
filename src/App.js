/*
 * @Author: Envas chris
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-30 20:36:47
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
import defaultFiles from './utils/defaultFiles'
import {flattenArr,enumToArr} from './utils/dataProcessing'
import fileProcessing from './utils/fileProcessing'
// edit
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
const { Sider, Content } = Layout;
// require node module 
const {join} = window.require('path')
const {remote} = window.require('electron')

function App() {
  //original file of data
  const [files,setFiles] = useState(defaultFiles)
  // arr original file data to enum
  const enumfile = flattenArr(files)
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
  const savedLocationPath = remote.app.getPath('documents')
  // files in use
  const activFile = enumfile[activeFile_id]
  // left click event
  const onFileClick = (file_id) => {
    if(!openedFile_ids.includes(file_id)) {
      setActiveFile_id(file_id)
      setOpenedFile_ids([...openedFile_ids,file_id])
    }else{
      setActiveFile_id(file_id)
    }
  }
  // tab click event
  const onTabClick = (file_id) => {
    setActiveFile_id(file_id)
  }
  // tab close event
  const onCloseTab = (file_id) => {
    const isSave = openedFile_ids.includes(file_id)
    if(isSave) {
      alert('文件已修好是否保存！')
    }
    // remove curent id from openFile_ids
    const newTabList = openedFile_ids.filter(open_id => open_id !== file_id)
    setOpenedFile_ids([...newTabList])
    // if still tab-list , set the active to the last opened tab
    if(openedFile_ids.length) {
      setActiveFile_id(openedFile_ids[0])
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
    //delete enumfile data 
    fileProcessing.deleteFile(join(savedLocationPath,`${enumfile[id].title}.md`))
    .then(() => {
      delete enumfile[id]
      setFiles(enumToArr(enumfile))
      // delete opened tab 
      onCloseTab(id)
    })
  }
  const onSaveEdit = (id,title,isNew) => {
    // loop through original file to update the title
    if(isNew) {
      fileProcessing.writeFile(join(savedLocationPath,`${title}.md`),enumfile[id].body)
      .then(() => {
        enumfile[id].title = title
        enumfile[id].isNew = false
        setFiles(enumToArr(enumfile))
      })
    }else{
      fileProcessing.renameFile(join(savedLocationPath,`${enumfile[id].title}.md`),join(savedLocationPath,`${title}.md`))
      .then(() => {
        enumfile[id].title = title
        enumfile[id].isNew = false
        setFiles(enumToArr(enumfile))
      })
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
        isNew: true
      }
    ]
    setFiles(newFiles)
  }
  const saveCurrentFile = () => {
    fileProcessing.writeFile(join(savedLocationPath, `${activFile.title}.md`),
      activFile.body
    )
    .then(() => {
      setUnSaveFile_ids(unSaveFile_ids.filter(unSaveFile_id => unSaveFile_id !== activFile.id))
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
            files={searchedFiles.length > 0 ?  searchedFiles : files}
            onFileClick = {onFileClick}
            onFileDelete = {onFileDelete}
            onSaveEdit = {onSaveEdit}  
            activeFile_id={activeFile_id}
            />
            <div className="left-panel_ground">
              <SliderButton 
              text='新建'
              type='primary'
              onclick={createNewFile}/>
              <SliderButton 
              text='导入'
              onclick={() => {
                console.log('导入')
              }}/>
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
