import React from 'react';
import { Layout } from 'antd'
import 'antd/dist/antd.css';
import './public/css/public.css'
import FileSearch from './components/FileSearch'
const { Header, Footer, Sider, Content } = Layout;

const style = {
  height: 741
}

function App() {
  return (
    <div className="App">
     <Layout>
      <Sider
      >
        <div style={style}>
            <FileSearch />
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
