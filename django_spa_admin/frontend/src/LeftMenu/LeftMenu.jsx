import { Link, BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';

const getLevelKeys = (items1) => {
  const key = {};
  const func = (items2, level = 1) => {
    items2.forEach((item) => {
      if (item.key) {
        key[item.key] = level;
      }
      if (item.children) {
        func(item.children, level + 1);
      }
    });
  };
  func(items1);
  return key;
};

export const LeftMenu = ({ items2, onenedAppLabel, openedModelName }) => {
  const navigate = useNavigate();
  const levelKeys = getLevelKeys(items2);
  
  const [openKeys, setOpenKeys] = useState([onenedAppLabel]);
  const [selectedKeys, setSelectedKeys] = useState([openedModelName]);

  useEffect(() => {
    setOpenKeys([onenedAppLabel]);
    setSelectedKeys([openedModelName]);
  }, [onenedAppLabel, openedModelName]);

  const handleMenuClick = ({ item, key, keyPath }) => {
    // Переход на страницу при клике
    const clickedItem = items2
      .flatMap((menuItem) => menuItem.children || [])
      .find((child) => child.key === key);
    
    if (clickedItem) {
      const url = `/django_spa/admin/${clickedItem.appLabel}/${clickedItem.modelName}/`;
      navigate(url);
    }
    
    setSelectedKeys([key]); // Обновляем выбранный пункт меню
  };

  return (
    <Menu 
      mode="inline"
      style={{ height: '100%' }}
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={setOpenKeys}
      onClick={handleMenuClick}
      items={items2}
    />
  );
};
