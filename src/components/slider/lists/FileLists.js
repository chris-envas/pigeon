import React, { useState,Fragment,useEffect } from 'react'
import { Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import './FileLists.less'

const FileLists = ({files,onFileClick,onSaveEditTitle,onFileDelete,activeFile_id}) => {
  /*
  * @files: original file data
  * @onFileClick: file click interaction
  * @onSaveEditTitle : file save interaction
  * @onFileDelete  : file delte interaction
 */
  // file edit status
  const [editStatus, setEditStatus] = useState('')
  // file data
  const [value, setValue] = useState('')
  useEffect(() => {
    //I going to add new feature in the futrue
    document.addEventListener('contextmenu',(e) => {
      console.log(e)
    })
  })
  useEffect(() => {
    // if the file is new , must be set to edit  
    const newFile = files.find(file => file.isNew)
    if(newFile) {
      setEditStatus(newFile.id)
      // setValue(newFile.title)
    }
  },[files])
  return (
    <ul
    className="file-lists"
    style={{color:'#fff'}}>
     {
       files.map(file => (
        <li
        className={activeFile_id === file.id ? 'active' : ''}
        onClick={(e) => {
          (editStatus !== file.id) && onFileClick(file.id)
        }}
        key={file.id}>
          {
            (editStatus === file.id) && 
            <>  
              <div className="input-modal-global"
              onClick={(e) => {
                e.stopPropagation()
                onSaveEditTitle(file.id,value,file.isNew)
                setEditStatus('')
              }}></div>
              <Input placeholder={ file.title ? file.title : '请输入文件名称'}  
                onChange={(e) => {
                  setValue(e.target.value)
                }}
                onKeyDown={(e) => {
                  if(e.keyCode === 13) {
                    e.stopPropagation()
                    onSaveEditTitle(file.id,value,file.isNew)
                    setEditStatus('')
                  }
                }}
              />
            </>
          } 
          {
            (editStatus !== file.id) &&
            <Fragment>
              <Icon type="file-markdown" theme="filled"/>
              <b
              className="file-title"
              title={file.title}>
                {file.title}
              </b>
              <Icon 
                onClick={(e) => {
                  e.stopPropagation()
                  onFileDelete(file.id)
                }}
                className="delete-icon" 
                type="delete" 
                theme="filled" 
                title='delete file'
                />
              <Icon 
                className="click-icon"
                type="edit" 
                theme="filled" 
                title='rename'
                onClick={(e) => {
                  e.stopPropagation()
                  setEditStatus(file.id)
                }}
              />
            </Fragment>
          }
         </li> 
       ))
     }
  </ul>
  )
}

FileLists.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEditTitle: PropTypes.func,
  onFileDelete: PropTypes.func
}

export default FileLists