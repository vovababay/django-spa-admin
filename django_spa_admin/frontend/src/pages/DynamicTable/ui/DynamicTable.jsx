import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import { DataTable } from "@/entities/Table/ui/DataTable";

export const DynamicTable = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();

    useEffect(() => {
        if (appLabel && modelName) {
            setActiveMenuItem({ appLabel, modelName });
        }
    }, [appLabel, modelName, setActiveMenuItem]);

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
    }
    return (
        <ModelTableLayout>
            <DataTable appLabel={appLabel} modelName={modelName} />
        </ModelTableLayout>
    );
};