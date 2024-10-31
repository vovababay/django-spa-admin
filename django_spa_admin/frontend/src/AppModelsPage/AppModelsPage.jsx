import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, Empty, Pagination } from 'antd';
import { MainMenuLayout } from '../layouts/MainMenuLayout';
import { ModelsTable } from '../components/ModelsTable/ModelsTable';


export const AppModelsPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();
    const [modelsByApp, SetModelsByApp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appVerboseName, SetAppVerboseName] = useState(null);
    
    const fetchData = async (appLabelName) => {
        setLoading(true);
        try {
            const dataResponse = await fetch(`/django_spa/api/${appLabelName}/app_models/`);
            const dataResult = await dataResponse.json();
            SetModelsByApp(dataResult || {});
            
            const appLabel = Object.keys(dataResult)[0];
            SetAppVerboseName(dataResult[appLabel].verbose_name || null)
        } catch (error) {
            console.error('Error fetching data:', error);
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
