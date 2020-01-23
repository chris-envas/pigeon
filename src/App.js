/*
 * @Author: your name
 * @Date: 2020-01-22 19:20:00
 * @LastEditTime : 2020-01-23 23:49:00
 * @LastEditors  : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cloud-electron-docs\src\App.js
 */
import React from 'react';
import { Layout } from 'antd'
import FileSearch from './components/slider/search/FileSearch'
import FileLists from './components/slider/lists/FileLists'
import SliderButton from './components/slider/button/SliderButton'
import TabList from './components/tabList/TabList'
import './public/css/reset.css'
import './public/css/theme-antd.less'
import defaultFiles from './utils/defaultFiles'
import defaultTab from './utils/defaultTab'
const { Footer, Sider, Content } = Layout;

function App() {
  return (
    <div className="App">
     <Layout>
      <Sider
      >
        <div>
            <FileSearch /> 
            <FileLists 
            files={defaultFiles}
            onFileClick = {(id) => {
              console.log(id)
            }}
            onFileDelete = {(id) => {
              console.log('deleting',id)
            }}
            onSaveEdit = {(id,title) => {
              console.log(title,id)

            }}  
            />
            <SliderButton 
            text='新建'
            type='primary'
            onclick={() => {
              console.log('新建')
            }}/>
            <SliderButton 
            text='导入'
            onclick={() => {
              console.log('导入')
            }}/>
        </div>
      </Sider>
      <Layout>
        {/* <Header>
        </Header> */}
        <Content>
          <TabList 
            files={defaultTab}
          />
        </Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
    </div>
  );
}

export default App;
