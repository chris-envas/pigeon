/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-23 17:30:09
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\slider\Search\FileSearch.js
 */
import React, {useState} from 'react'
import {Input } from 'antd'

const { Search } = Input

const FileSearch = () => {
    const [value, setValue] = useState('')
    return (
        <div>
            <Search
                placeholder="搜索云文档"
                loading={false}
                disabled={false}
                onSearch={_value => {
                    console.log(_value)
                    setValue(_value)
                }}
                style={{ width: 200}}
            />
            {value}
        </div>
    )
}

export default FileSearch