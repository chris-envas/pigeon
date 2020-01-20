import React from 'react';
import { Layout,Button  } from 'antd'
import FileSearch from './components/slider/FileSearch'
import FileLists from './components/slider/FileLists'
import './public/css/theme-antd.less'
const { Header, Footer, Sider, Content } = Layout;

function App() {
  return (
    <div className="App">
     <Layout>
      <Sider
      >
        <div>
            <Button type="primary">Button</Button>
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
