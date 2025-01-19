import React from 'react';
import { Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { postRequest } from '@/shared/api/api'; // Функция запроса POST

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

    const headerMenu = [
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
            items={headerMenu}
            style={{ display: 'flex', justifyContent: 'end', flex: 1, minWidth: 0 }} // Обеспечиваем равномерное распределение
        />
    );
};

