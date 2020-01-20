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
                onSearch={value => {
                    console.log(value)
                    setValue(value)
                }}
                style={{ width: 200}}
            />
        </div>
    )
}

export default FileSearch