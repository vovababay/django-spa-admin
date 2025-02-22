import React, { useEffect, useState } from 'react';
import { MainMenuLayout } from '@/shared/layouts/MainMenuLayout';
import { ModelsTable } from '@/shared/ui/ModelsTable/ModelsTable';
import { RecentActivity } from '@/widgets/RecentActivity/ui/RecentActivity/RecentActivity';
import {fetchSideBarData} from "@/pages/AdminDashboardPage/models/services/fetchSideBarData";
import {message} from "antd";

import './HomePage.css';

export const AdminDashboardPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const [loading, setLoading] = useState(true);
    const [modelsByApp, setModelsByApp] = useState({});

    useEffect(() => {
        setLoading(true);

        fetchSideBarData()
            .then((data) => setModelsByApp(data || {}))
            .catch((error) => message.error('Failed to load sidebar data:', error))
            .finally(() => setLoading(false));
    }, []);


    return (
        <MainMenuLayout activeMenuItem={activeMenuItem}>
            <div
                style={{'display': 'flex'}}>
                <ModelsTable modelsByApp={modelsByApp} loading={loading}/>
                <RecentActivity/>
            </div>
        </MainMenuLayout>
    );
};
