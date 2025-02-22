import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { Button, message } from 'antd';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import { POST } from '@/shared/api';
import { handle403Error } from '@/shared/api/authService';
import getFieldComponent from "@/shared/ui/InputField/InputField";
import {fetchMeta} from "@/pages/ModelCreatePage/api/fetchMeta";
import {API_ROUTES, ROUTES} from "@/shared/config";
import {createObject} from "@/pages/ModelCreatePage/api/createObject";
import {DataDisplay} from "@/pages/ModelCreatePage/ui/DataDisplay/DataDisplay";


export const ModelCreatePage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName  } = useParams();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const createElement = async () => {
        setSendLoading(true);
        createObject(appLabel, modelName, data)
            .then(data => {
            message.success('Объект успешно создан');
            const objectId = data.id.value;
            navigate(ROUTES.CHANGE_OBJECT(appLabel, modelName, objectId));
        })
            .catch( error => {
                if (error.is403) {
                    handle403Error(navigate);
                } else {
                    const errorData = error.response.data;
                    setErrors(errorData);
                    if (errorData.errors) {
                        errorData.errors.forEach(err => {
                            message.error(err);
                        });
                    }
            }
            })
            .finally( () => {
                setSendLoading(false);
            })
    };

    const changeField = (fieldName, event) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: event?.target ? event.target.value : event,
        }));
    };

    useEffect(() => {
        fetchMeta(appLabel, modelName).then((data) => {
            const metaFields = data.fields.filter(field => !field.is_primary_key);
            setFields(metaFields);

            // Создаем начальные данные
            const initialData = metaFields
                .filter(field => !field.is_primary_key) // Исключаем is_primary_key
                .reduce((acc, field) => {
                    acc[field.name] = field.default !== null ? field.default : (field.null ? null : '');
                    return acc;
                }, {});
            setData(initialData);
            setLoading(false);
        });
    }, [appLabel, modelName]);

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <ModelTableLayout>
            <DataDisplay fields={fields} data={data} onChange={changeField} errors={errors} />
            <Button type="primary" onClick={createElement} loading={sendLoading}>
                Создать
            </Button>
        </ModelTableLayout>
    );
};
