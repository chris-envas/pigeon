/*
 * @Author: your name
 * @Date: 2020-02-16 13:53:54
 * @LastEditTime: 2020-02-16 14:09:07
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\global\Loader.js
 */
import React from 'react'
import { Spin } from 'antd'

const Loader = ({text = 'Loading...'}) => {
    return (
        <div className="loading-status">
            <Spin 
                tip={text}
                size="large">
            </Spin>
        </div>
    )
}

export default Loader