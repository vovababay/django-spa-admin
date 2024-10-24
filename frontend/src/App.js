import React, { useEffect, useState } from 'react';
import './reset.css';
import './App.css';

import {
    AppstoreOutlined,
    BarChartOutlined,
    CloudOutlined,
    ShopOutlined,
    TeamOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
  } from '@ant-design/icons';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import { Link, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DynamicPage } from './DynamicPage';
import { LeftMenu } from './LeftMenu';

const { Header, Content, Footer, Sider } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const siderStyle = {
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  insetInlineStart: 0,
  top: 0,
  bottom: 0,
};

const items = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
  AppstoreOutlined,
  TeamOutlined,
  ShopOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `nav ${index + 1}`,
}));

const App = () => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [items2, setItems] = useState([]);
  const [activeMenuItem, setActiveMenuItem] = useState({"appLabel": null, "modelName": null});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/django_spa/api/side_bar/');
        const data = await response.json();
        const formattedItems = Object.entries(data).map(([key, value]) => ({
          key: key,
          label: value.verbose_name,
          children: value.models.map(model => ({
            key: model.model_name,
            appLabel: key,
            modelName: model.model_name,
            label: model.verbose_name_plural,
          })),
        }));
        setItems(formattedItems);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <Router>
      <Layout style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} style={{ flex: 1, minWidth: 0 }} />
        </Header>
        <Content style={{ padding: '0 48px', overflow: 'initial' }}>
          <Breadcrumb
            style={{ margin: "16px 0" }}
            items={[
              { title: <Link to="/django_spa/admin/">Home</Link> },
              { title: <Link to="/django_spa/admin/test_app/card/">Application List</Link> },
              { title: <Link to="/django_spa/admin/test_app/article/">Application</Link> },
            ]}
          />
          <Layout style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG, flexGrow: 1}}>
            <Sider style={{ background: colorBgContainer }} width={300}>
                <LeftMenu items2={items2} onenedAppLabel={activeMenuItem.appLabel} openedModelName={activeMenuItem.modelName}/>
            </Sider>
            <Content style={{ padding: '0 24px', flexGrow: 1 }}>
              <Routes>
                <Route 
                    path="/django_spa/admin/:appLabel/:modelName/" 
                    element={
                        <DynamicPage 
                            activeMenuItem={activeMenuItem} 
                            setActiveMenuItem={setActiveMenuItem}
                        />
                        } 
                />
                <Route 
                    path="/django_spa/admin/:appLabel/:modelName/:pk/" 
                    element={
                        <DynamicPage 
                            activeMenuItem={activeMenuItem} 
                            setActiveMenuItem={setActiveMenuItem}
                        />
                        } 
                />
              </Routes>
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {new Date().getFullYear()} Created by v.babaev
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
