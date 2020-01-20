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