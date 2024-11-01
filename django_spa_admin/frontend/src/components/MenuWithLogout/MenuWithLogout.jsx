import React from 'react';
import { Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '../../api'; // Функция запроса POST

export const MenuWithLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await postRequest('/logout/');
            navigate('/django_spa/admin/login/', { replace: true });
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    const items1 = [
        ...['1', '2', '3'].map((key) => ({
            key,
            label: `Test ${key}`,
        })),
        {
            key: 'logout',
            label: (
                <Button 
                    type="link" 
                    onClick={handleLogout} 
                    style={{ color: 'red', marginLeft: 'auto' }} // Прижимаем кнопку к правой стороне
                >
                    Выйти
                </Button>
            ),
        },
    ];

    return (
        <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            items={items1}
            style={{ display: 'flex', justifyContent: 'end', flex: 1, minWidth: 0 }} // Обеспечиваем равномерное распределение
        />
    );
};

