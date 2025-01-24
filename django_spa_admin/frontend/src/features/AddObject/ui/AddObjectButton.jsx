import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import {ROUTES} from "@/shared/config/routes";

export const AddObjectButton = ({ appLabel, modelName }) => {
    const navigate = useNavigate();

    const handleAdd = () => {
        const url = ROUTES.ADD_OBJECT(appLabel, modelName);
        navigate(url);
    };

    return <Button type="primary" onClick={handleAdd}>Добавить</Button>;
};
