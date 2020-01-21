import React from 'react'

const FileLists = ({files,onFileClick,onSaveEdit,onFileDelete}) => {
  console.log(files)
  return (
    <ul
    style={{color:'#fff'}}>
     {
       files.map(file => (
        <li
        key={file.id}>{file.title}</li> 
       ))
     }
  </ul>
  )
}

export default FileLists