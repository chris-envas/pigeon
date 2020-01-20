import React from 'react';
import { Layout } from 'antd'
import 'antd/dist/antd.css';
import FileSearch from './components/slider/FileSearch'
import FileLists from './components/slider/FileLists'
const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div className="App">
     <Layout>
      <Sider
      >
        <div>
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
