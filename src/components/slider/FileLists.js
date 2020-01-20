import React from 'react'
import { List, Typography } from 'antd'
import example from './example.less'

const data = [
  'Racing car sprays burning fuel into crowd.',
  'Japanese princess to wed commoner.',
  'Australian walks 100km after outback crash.',
  'Man charged over missing wedding girl.',
  'Los Angeles battles huge wildfires.',
];



const FileLists = () => {
  return (
    <div>
      <List
        className='example.c'
        size="small"
        header={<div>Header</div>}
        footer={<div>Footer</div>}
        bordered
        dataSource={data}
        renderItem={item => <List.Item>{item}</List.Item>}
      />
    </div>
  )
}

export default FileLists