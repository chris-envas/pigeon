/*
 * @Author: your name
 * @Date: 2020-01-23 19:40:30
 * @LastEditTime : 2020-02-13 18:29:53
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\tabList\TabList.js
 */
import React from 'react'
import { Tag } from 'antd';
import PropTypes from 'prop-types'
import './TabList.less'
import { getParentNode } from '../../utils/domProcessing'


const TabList = ({files,unSaveFile_ids,onTabClick,onCloseTab,activeFile_id}) => {
    return (
       <div
       style={{maxHeight:30}}>
           {    
            files.map((file,index) => 
                <Tag 
                id={file.id}
                key={file.id}
                className={
                    [
                        activeFile_id === file.id ? 'click tab-list_item' : 'tab-list_item',
                        unSaveFile_ids.includes(file.id) ? ' anticon-save' : ''
                    ]
                }
                closable
                onClose={(e) => { 
                    let tabItem = getParentNode(e.target,'tab-list_item')
                    console.log('tabItem',tabItem)
                    let id = tabItem.getAttribute('id') 
                    if(id)  {
                        onCloseTab(id)
                    }
                }}
                onClick={(e) => {
                    let id = e.target.parentNode.getAttribute('id')
                    onTabClick(id)
                }}
                >
                <div
                    className="out-range"
                >
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