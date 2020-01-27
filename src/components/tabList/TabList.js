import React from 'react'
import { Tag } from 'antd';
import './TabList.less'

function log(e) {
  console.log(e);
}

// function preventDefault(e) {
//   e.preventDefault();
//   console.log('Clicked! But prevent default.');
// }
const style = {
    minHeight: 30
}

const TabList = ({files}) => {
    console.log(files)
    return (
       <div
       style={style}>
           {
              files.map((file,index) => 
                <Tag 
                className="anticon-save"
                closable
                onClose={log}
                key={index}
                >{file.title}</Tag>
              ) 
           }
       </div>
    )
}

export default TabList