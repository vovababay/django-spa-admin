import { Link, BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
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
import { MenuWithLogout } from '../../components/MenuWithLogout/MenuWithLogout';

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
  label: `Test ${index + 1}`,
}));
const { Header, Content, Footer, Sider } = Layout;

const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `Test ${key}`,
}));

export const MainMenuLayout = ({ children, activeMenuItem, modelsByApp }) => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const getBreadcrumb = () => {

    const items = [
      { title: <Link to="/django_spa/admin/" style={{ cursor: 'pointer' }}>Home</Link> },
    ];
  
    if (activeMenuItem && modelsByApp[activeMenuItem.appLabel]){
      items.push({ title: <Link to={`/django_spa/admin/${activeMenuItem.appLabel}/`} style={{ cursor: 'pointer' }}>{modelsByApp[activeMenuItem.appLabel].verbose_name}</Link> });
    }
  
    return items;
  };

    return (
      <Layout style={{ margin: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div className="demo-logo" />
          <MenuWithLogout />
        </Header>
        <Content style={{ padding: '0 48px', overflow: 'initial' }}>
        <Breadcrumb
            separator=">"
            style={{ margin: "16px 0" }}
            items={getBreadcrumb()}
          />
          <Layout style={{ padding: '24px 0', background: colorBgContainer, borderRadius: borderRadiusLG, flexGrow: 1}}>
            <Content style={{ padding: '0 24px', flexGrow: 1 }}>
            dskadhjksahjk
              {children}
            </Content>
          </Layout>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          {new Date().getFullYear()} Created by v.babaev
        </Footer>
    </Layout>
    );
};
