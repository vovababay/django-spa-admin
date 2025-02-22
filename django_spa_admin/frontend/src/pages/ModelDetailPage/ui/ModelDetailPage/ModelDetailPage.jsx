import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, message } from 'antd';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import { handle403Error } from '@/shared/api/authService';
import {getObject} from "@/pages/ModelDetailPage/api/getObject";
import {DynamicForm} from "@/features/DynamicForm";


export const ModelDetailPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [editedData, setEditedData] = useState({});
    const [sendLoading, setSendLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getObject(appLabel, modelName, pk)
            .then(responseData => {
                setFormData(responseData || {});
            })
            .catch(error =>{
                if (error.is403) {
                    handle403Error(navigate);
                } else {
                    console.error('Error fetching data:', error);
                }
            })
            .finally( () => setLoading(false))
        if (appLabel && modelName) {
            setActiveMenuItem({ "appLabel": appLabel, "modelName": modelName });
        }
    }, [appLabel, modelName, pk, setActiveMenuItem]);

    const handleSave = async ({url}) => {
        setSendLoading(true);
        try {
            const changedFields = Object.keys(editedData).reduce((acc, key) => {
            if (editedData[key] !== formData[key]?.value) {
                acc[key] = editedData[key];
            }
                return acc;
            }, {});
            const dataResult = await PATCH(API_ROUTES.FETCH_OBJECT(appLabel, modelName, pk), changedFields);
            console.log(url);
            if (url != null) {
                navigate(url);
            }
            setFormData(dataResult || {});
            setErrors({});
            message.success('Объект успешно обновлен')

        } catch (error) {
            if (error.is403) {
                handle403Error(navigate);
            } else {
                console.log(error)
                const errorData = error.response.data;
                setErrors(errorData);
                if (errorData.errors) {
                    errorData.errors.forEach(err => {
                        message.error(err);
                    })
                }
                console.error('Error fetching data:', error);
             }
        } finally {
            setSendLoading(false);
        }
    };

    return (
        <ModelTableLayout>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <Button
                    style={{marginLeft: 'auto'}}><Link
                    to={`/django_spa/admin/${appLabel}/${modelName}/${pk}/history/`}>История</Link>
                </Button>
            </div>
            <DynamicForm data={formData} setEditedData={setEditedData}/>
            <div style={{
                padding: "12px 14px 12px",
                margin: "0 0 20px",
                background: "#f8f8f8",
                border: "1px solid #e8e8e8",
                borderRadius: "4px",
                overflow: "hidden",
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                justifyContent: "space-between",
            }}>
                <div style={{display: 'flex', gap: '10px'}}>
                    <Button type="primary"
                            onClick={() => handleSave({url: `/django_spa/admin/${appLabel}/${modelName}/`})}
                            loading={sendLoading}>Сохранить</Button>
                    <Button type="primary"
                            onClick={() => handleSave({url: `/django_spa/admin/${appLabel}/${modelName}/add/`})}
                            loading={sendLoading}>Сохранить и добавить другой объект</Button>
                    <Button type="primary" onClick={() => handleSave({url: null})} loading={sendLoading}>Сохранить
                        и продолжить редактировать</Button>
                </div>
                <Button type="primary" danger onClick={() => handleSave({url: null})}
                        loading={sendLoading}>Удалить</Button>
            </div>
        </ModelTableLayout>
    )
}