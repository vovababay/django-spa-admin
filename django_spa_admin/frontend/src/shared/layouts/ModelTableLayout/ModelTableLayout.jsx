import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, theme } from 'antd';
import { LeftMenu } from '@/widgets/LeftMenu/ui';
import { MenuWithLogout } from '@/widgets/MenuWithLogout/MenuWithLogout';
// import { handle403Error } from '../authService';
import { GET } from '@/shared/api/api';
import { handle403Error } from '@/shared/api/authService';
import {API_ROUTES} from "@/shared/config";


const { Header, Content, Footer, Sider } = Layout;



export const ModelTableLayout = ({ children }) => {
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const { appLabel, modelName, pk } = useParams();
    const [items2, setItems] = useState([]);
    const [activeMenuItem, setActiveMenuItem] = useState({"appLabel": null, "modelName": null});
    const navigate = useNavigate();
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
        const data = await GET(API_ROUTES.SIDE_BAR);
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
        if (error.is403) {
          handle403Error(navigate);
        } else {
          console.error('Error fetching data:', error);
      }
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
