import React from 'react';
import { Menu, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { POST } from '@/shared/api/api';
import {API_ROUTES, ROUTES} from "@/shared/config";


export const MenuWithLogout = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await POST(API_ROUTES.LOGOUT, {});
            navigate(ROUTES.LOGOUT, { replace: true });
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
                    style={{ color: 'red', marginLeft: 'auto' }}
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
            style={{ display: 'flex', justifyContent: 'end', flex: 1, minWidth: 0 }}
        />
    );
};

