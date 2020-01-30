/*
 * @Author: your name
 * @Date: 2020-01-23 17:11:23
 * @LastEditTime : 2020-01-30 20:46:54
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\components\slider\bottomBtn\bottomBtn.js
 */
import React from 'react'
import {Button} from 'antd'
import PropTypes from 'prop-types'

const SliderButton = ({text,type,onclick}) => {
    const style = {
        width: '50%'
    }
    return (
        <Button 
            style={style} 
            type={type}
            onClick={() => {
                onclick()
            }}>
            {text}
        </Button>
    )
}

SliderButton.propTypes = {
    text: PropTypes.string,
    type: PropTypes.string,
    onClick: PropTypes.func
}

export default SliderButton
