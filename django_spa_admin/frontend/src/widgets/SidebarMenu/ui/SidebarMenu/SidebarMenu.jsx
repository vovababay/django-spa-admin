import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Menu, Button } from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {ROUTES} from "@/shared/config";


export const SidebarMenu = ({ items, onenedAppLabel, openedModelName }) => {
  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState([onenedAppLabel]);
  const [selectedKeys, setSelectedKeys] = useState([openedModelName]);

  useEffect(() => {
    setOpenKeys([onenedAppLabel]);
    setSelectedKeys([openedModelName]);
  }, [onenedAppLabel, openedModelName]);

  const handleMenuClick = ({ item, key, keyPath }) => {
    // Переход на страницу при клике
    const clickedItem = items
        .flatMap((menuItem) => menuItem.children || [])
        .find((child) => child.key === key);

    if (clickedItem) {
      const url = `/django_spa/admin/${clickedItem.appLabel}/${clickedItem.modelName}/`;
      navigate(url);
    }
    setSelectedKeys([key]); // Обновляем выбранный пункт меню
  };



  const renderMenuItem = (item) => (
      <Menu.Item key={item.key}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <span>{item.label}</span>
          <Button
              icon={<PlusOutlined />} // Иконка для кнопки "+"
              size="small"
              style={{ marginLeft: 'auto' }} // Прижать кнопку к правому краю
              onClick={(e) => {
                e.stopPropagation();
                navigate(ROUTES.ADD_OBJECT(item.appLabel, item.modelName));
              }}
          />
        </div>
      </Menu.Item>
  );

  const renderMenu = (menuItems) => {
    return menuItems.map((item) => {
      if (item.children) {
        return (
            <Menu.SubMenu key={item.key} title={item.label}>
              {item.children.map((childItem) => renderMenuItem(childItem))}
            </Menu.SubMenu>
        );
      } else {
        return renderMenuItem(item);
      }
    });
  };

  return (
      <Menu
          mode="inline"
          style={{ height: '100%' }}
          openKeys={openKeys}
          selectedKeys={selectedKeys}
          onOpenChange={setOpenKeys}
          onClick={handleMenuClick}
      >
        {renderMenu(items)}
      </Menu>
  );
};
