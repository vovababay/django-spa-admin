import { Link, BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
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
import { LeftMenu } from '../../LeftMenu';
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



export const ModelTableLayout = ({ children }) => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const { appLabel, modelName, pk } = useParams();
    const [items2, setItems] = useState([]);
    const [activeMenuItem, setActiveMenuItem] = useState({"appLabel": null, "modelName": null});
  const getBreadcrumb = () => {
    // Находим элемент по ключу appLabel
    const appItem = items2.find(item => item.key === activeMenuItem.appLabel);
  
    // Проверяем, нашли ли appItem и, если да, находим его child по ключу modelName
    const modelItem = appItem?.children?.find(child => child.key === activeMenuItem.modelName);
  
    // Формируем динамические элементы
    const items = [
      { title: <Link to="/django_spa/admin/" style={{ cursor: 'pointer' }}>Home</Link> },
    ];
  
    if (appItem) {
      items.push({ title: <Link to={`/django_spa/admin/${appItem.key}/`} style={{ cursor: 'pointer' }}>{appItem.label}</Link> });
    }
  
    if (modelItem) {
      items.push({ title: <Link to={`/django_spa/admin/${appItem.key}/${modelItem.key}/`} style={{ cursor: 'pointer' }}>{modelItem.label}</Link> });
    }
  
    return items;
  };
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
        setActiveMenuItem({
          ...activeMenuItem,
          "appLabel": appLabel, 
          "modelName": modelName
        })
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  function RedirectToChange() {
    return <Navigate to={`/django_spa/admin/${appLabel}/${modelName}/${pk}/change/`} replace />;
  }
  
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
            <Sider style={{ background: colorBgContainer }} width={300}>
                <LeftMenu items2={items2} onenedAppLabel={activeMenuItem.appLabel} openedModelName={activeMenuItem.modelName}/>
            </Sider>
            <Content style={{ padding: '0 24px', flexGrow: 1 }}>
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
