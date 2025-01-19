import React, { useEffect, useState } from 'react';
import { MainMenuLayout } from '@/shared/layouts/MainMenuLayout';
import { Table } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ModelsTable } from '@/shared/ui/ModelsTable/ModelsTable';
import { LastUserActions } from '@/shared/ui/LastUserActions/LastUserActions';
import './HomePage.css';
import { getRequest } from '@/shared/api/api';
import { handle403Error } from '@/shared/api/authService';


export const HomePage = ({ activeMenuItem, setActiveMenuItem }) => {
    const [loading, setLoading] = useState(true);
    const [modelsByApp, setModelByApp] = useState({});
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const navigate = useNavigate();

    
    const fetchModels = async () => {
        setLoading(true);
        try {
            // Получаем названия колонок
            const fieldsResult = await getRequest('/side_bar/');
            setModelByApp(fieldsResult || {});

        } catch (error) {
            if (error.is403) {
                handle403Error(navigate);
            } else {
                console.error('Error fetching data:', error);
            }
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchModels();
    }, []);
    
    
    return (
        <MainMenuLayout>
            <div 
                style={{'display': 'flex'}}>
                <ModelsTable modelsByApp={modelsByApp} loading={loading}/>
                <LastUserActions/>
            </div>
        </MainMenuLayout>
    );
};
