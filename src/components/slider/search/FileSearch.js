/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-30 20:48:23
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\slider\Search\FileSearch.js
 */
import React from 'react'
import {Input } from 'antd'
import PropTypes from 'prop-types'
const { Search } = Input

const FileSearch = ({onFileSearch}) => {
    return (
        <div>
            <Search
                placeholder="搜索云文档"
                loading={false}
                disabled={false}
                onSearch={keyword => {
                    onFileSearch(keyword)
                }}
                onChange={(e) => {
                    if(e.target.value === '') onFileSearch(e.target.value)
                }}
                style={{ width: 200}}
            />
        </div>
    )
}

FileSearch.propTypes = {
    onFileSearch: PropTypes.func
}

export default FileSearch