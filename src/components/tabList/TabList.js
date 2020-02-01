import React from 'react'
import { Tag } from 'antd';
import PropTypes from 'prop-types'
import './TabList.less'

const style = {
    minHeight: 30
}
const TabList = ({files,unSaveFile_ids,onTabClick,onCloseTab,activeFile_id}) => {
    return (
       <div
        style={style}>
           {    
            files.map((file,index) => 
                <Tag 
                className={
                    [
                        activeFile_id === file.id ? 'click tab-list_item' : '',
                        unSaveFile_ids.includes(file.id) ? ' anticon-save' : ''
                    ]
                }
                closable
                onClose={(e) => { 
                    let tabItem = document.querySelector('.tab-list_item')
                    let id = tabItem.getAttribute('id')
                    if(id)  onCloseTab(id)
                }}
                onClick={(e) => {
                    let id = e.target.parentNode.getAttribute('id')
                    onTabClick(id)
                }}
                id={file.id}
                key={index}
                >
                <div
                className="out-range">
                    {file.title}
                </div>
                </Tag>
              ) 
           }
       </div>
    )
}

TabList.propTypes = {
    files: PropTypes.array,
    unSaveFile_id: PropTypes.array,
    onCloseTab: PropTypes.func,
    activeFile_id: PropTypes.string,
    onTabClick: PropTypes.func
}

export default TabList