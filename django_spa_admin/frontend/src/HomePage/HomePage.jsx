import React, { useEffect, useState } from 'react';
import { MainMenuLayout } from '../layouts/MainMenuLayout';
import { Table } from 'antd';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { ModelsTable } from '../components/ModelsTable/ModelsTable';
import { AllHistory } from '../components/AllHistory/AllHistory';
import './HomePage.css';
import { getRequest } from '../api';
import { handle403Error } from '../authService';


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
            console.log(error)
            if (error.is403) {
                console.log("403")
                handle403Error(navigate);
            } else {
                console.error('Error fetching data:', error);
            }
            console.error('Error fetching data:', error);
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
                <AllHistory/>
            </div>
        </MainMenuLayout>
    );
};
