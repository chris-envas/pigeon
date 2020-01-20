import React, {useState, useRef} from 'react'
import {Input } from 'antd'
const { Search } = Input

const FileSearch = () => {
    // const [inputActive, setInputActive] = useState(false)
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
            <div style={{color:'red'}}>{value}</div>
        </div>
    )
}

export default FileSearch