/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-23 20:59:10
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\slider\lists\FileLists.js
 */
import React, { useState } from 'react'
import { Icon, Input } from 'antd'
import PropTypes from 'prop-types'
import './FileLists.less'

const FileLists = ({files,onFileClick,onSaveEdit,onFileDelete}) => {
  /*
 * @files: 文件列表
 * @onFileClick: 文件重命名
 * @onSaveEdit : 文件保存
 * @onFileDelete  : 文件删除
 */
  const [editStatus, setEditStatus] = useState('')
  const [value, setValue] = useState('')
  return (
    <ul
    className="file-lists"
    style={{color:'#fff'}}>
     {
       files.map(file => (
        <li
        key={file.id}>
          {
            (editStatus === file.id) && 
            <>  
              <div className="input-modal-global"
              onClick={() => {
                onSaveEdit(file.id,value)
                setEditStatus('')
              }}></div>
              <Input placeholder={file.title}  
                onChange={(e) => {
                  setValue(e.target.value)
                }}
              />
            </>
          } 
          {
            (editStatus !== file.id) &&
            <>
              <Icon type="file-markdown" theme="filled"/>
              <b
              className="file-title"
              title={file.title}>
                {file.title}
              </b>
              <Icon 
                onClick={() => {
                  onFileDelete(file.id)
                }}
                className="delete-icon" 
                type="delete" 
                theme="filled" 
                title='delete file'
                />
              <Icon 
                onClick={() => {
                  onFileClick(file.id)
                  setEditStatus(file.id)
                }}
                className="click-icon"
                type="edit" 
                theme="filled" 
                title='rename'
              />
            </>
          }
         </li> 
       ))
     }
  </ul>
  )
}

// FileLists.propTypes = {
//   files: PropTypes.array,
//   onFileClick: PropTypes.func,
//   onSaveEdit: PropTypes.func,
//   onFileDelete: PropTypes.func
// }

export default FileLists