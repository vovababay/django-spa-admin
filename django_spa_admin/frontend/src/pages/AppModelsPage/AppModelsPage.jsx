import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, Empty, Pagination } from 'antd';
import { MainMenuLayout } from '@/shared/layouts/MainMenuLayout';
import { ModelsTable } from '@/shared/ui/ModelsTable/ModelsTable';
import { getRequest } from '@/shared/api/api';
import { handle403Error } from '@/shared/api/authService';


export const AppModelsPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();
    const [modelsByApp, SetModelsByApp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appVerboseName, SetAppVerboseName] = useState(null);
    const navigate = useNavigate();

    const fetchData = async (appLabelName) => {
        setLoading(true);
        try {
            const dataResult = await getRequest(`/${appLabelName}/app_models/`)
            console.log(dataResult)
            SetModelsByApp(dataResult || {});
            
            const appLabel = Object.keys(dataResult)[0];
            SetAppVerboseName(dataResult[appLabel]?.verbose_name || null)
            
        } catch (error) {
            if (error.is403) {
                handle403Error(navigate);
              } else {
                console.error('Error fetching data:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        if (appLabel) {
            fetchData(appLabel);
            setActiveMenuItem({ "appLabel": appLabel, "modelName": null });
        }
    }, [appLabel, modelName, setActiveMenuItem]);

    if (!appLabel) {
        return <div>Error: No appLabel provided.</div>;
    }
    return (

        <MainMenuLayout activeMenuItem={activeMenuItem} modelsByApp={modelsByApp}>
            <ModelsTable modelsByApp={modelsByApp} loading={loading} appVerboseName={appVerboseName}/>
        </MainMenuLayout>
    );
};
