import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ModelsTable } from '@/shared/ui/ModelsTable/ModelsTable';
import {fetchData} from "@/pages/AppModelsPage/api/fetchData";
import {MainMenuLayout} from "@/shared/layouts/MainMenuLayout";


export const AppModelsPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();
    const [modelsByApp, SetModelsByApp] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appVerboseName, SetAppVerboseName] = useState(null);

    useEffect(() => {
        if (appLabel) {
            fetchData(appLabel).then((data) => {
                SetModelsByApp(data || {});
                const appLabel = Object.keys(data)[0];
                SetAppVerboseName(data[appLabel]?.verbose_name || null);
                setLoading(false);
            })
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
