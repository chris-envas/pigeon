import React from 'react';
import { Layout } from 'antd'
import 'antd/dist/antd.css';
import './public/css/public.css'
import FileSearch from './components/slider/FileSearch'
import FileLists from './components/slider/FileLists'
const { Header, Footer, Sider, Content } = Layout;

const style = {
  height: 741
}

function App() {
  return (
    <div className="App">
     <Layout>
      <Sider
      style="color:red;background:red"
      >
        <div style={style}>
            <FileSearch />
            <FileLists />
        </div>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content>Content</Content>
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
    </div>
  );
}

export default App;
