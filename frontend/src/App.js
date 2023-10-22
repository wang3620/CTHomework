import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UserOutlined,
  DesktopOutlined,
} from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import AddressList from "./AddressList";
import AddressDetail from "./AddressDetail";
const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedKeyPath, setSelectedKeyPath] = useState(['dashboard']);
  const items = [
    getItem('Dashboard', 'dashboard', <DesktopOutlined />),
    getItem('Address', 'address', <UserOutlined />, addresses.map((address => getItem(address.description, address.address_id)))),
  ];
  useEffect(() => {
    axios({
      method: 'get',
      url: 'http://localhost:8080/v1/list_all_addresses',
    })
      .then(function (response) {
        if (response.data) {
          setAddresses(response.data);
        }
      });
  }, []);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const generateContent = () => {
    console.log(selectedKeyPath[selectedKeyPath.length - 1]);
    switch (selectedKeyPath[selectedKeyPath.length - 1]) {
      case 'address':
        return <AddressDetail addressID={selectedKeyPath[0]} />
      case 'dashboard':
        return <AddressList />
    }
  }

  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline" items={items} onClick={({keyPath}) => {
          setSelectedKeyPath(keyPath)
        }}/>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        />
        <Content>
          {

          }
          <div
            style={{
              margin: 24,
              padding:24,
              minHeight: 360,
              background: colorBgContainer,
            }}
          >
            {generateContent()}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Ant Design ©2023 Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;