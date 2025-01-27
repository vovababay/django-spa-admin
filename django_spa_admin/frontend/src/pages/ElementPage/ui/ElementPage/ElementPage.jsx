import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {Table, Empty, Pagination, Button, message} from 'antd';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import { handle403Error } from '@/shared/api/authService';
import {GET, PATCH} from '@/shared/api';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import getFieldComponent from "@/shared/ui/InputField/InputField";
import {InlineRenderer} from "@/shared/ui/InlineRenderer";
import DataRow from "@/shared/ui/DataRow/ui/DataRow";
import {DataDisplay} from "@/pages/ElementPage/ui/DataDisplay/DataDisplay";
import {getObject} from "@/pages/ElementPage/api/getObject";
import {API_ROUTES} from "@/shared/config";


const JSONField = 'JSONField';
const BooleanField = 'BooleanField';

const iconStyle = { fontSize: '20px' };

function getVisibilityValue(value, type) {
    switch (type) {
        case JSONField:
            return JSON.stringify(value, null, 2);
        case BooleanField:
            if (value === null) {
                return <QuestionCircleOutlined style={{ color: 'black', ...iconStyle }} />;
              }
              return value ? <CheckOutlined style={{ color: 'green', ...iconStyle }} /> : <CloseOutlined style={{ color: 'red', ...iconStyle }} />;
        default:
            return String(value);
    }
};







export const ElementPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [data, setData] = useState({});
    const [dataToSend, setDataToSend] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();


    const fetchEditedData = async ({url}) => {
        setSendLoading(true);
        try {
            const dataResult = await PATCH(API_ROUTES.FETCH_OBJECT(appLabel, modelName, pk), dataToSend);
            console.log(url);
            if (url != null) {
                navigate(url);
            }
            setData(dataResult || {});
            setErrors({});
            message.success('Объект успешно обновлен')

        } catch (error) {
            if (error.is403) {
                handle403Error(navigate);
            } else {
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


    useEffect(() => {
        getObject(appLabel, modelName, pk)
            .then(responseData => {
                setData(responseData || {});
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


    const changeField = (fieldLabel, event) => {
        setData((prevData) => {
            let newValue = event;
            if (event?.target) {
                newValue = event.target.value;
            }

            return {
                ...prevData,
                [fieldLabel]: { ...prevData[fieldLabel], value: newValue }
            };
        });
        setDataToSend((prevData) => ({
            ...prevData,
            [fieldLabel]: event
        }));
    };

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
    }

    if (loading) {
        return (
                <ModelTableLayout>
                    <div>Loading...</div>
                </ ModelTableLayout>
        );
    }

    return (
        <ModelTableLayout>
            <DataDisplay data={data} onChange={changeField} errors={errors}/>
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
                    <Button type="primary" onClick={() => fetchEditedData({url: `/django_spa/admin/${appLabel}/${modelName}/`})} loading={sendLoading}>Сохранить</Button>
                    <Button type="primary" onClick={() => fetchEditedData({url: `/django_spa/admin/${appLabel}/${modelName}/add/`})} loading={sendLoading}>Сохранить и добавить другой объект</Button>
                    <Button type="primary" onClick={() => fetchEditedData({url: null})} loading={sendLoading}>Сохранить и продолжить редактировать</Button>
                </div>
                <Button type="primary" danger onClick={() => fetchEditedData({url: null})} loading={sendLoading}>Удалить</Button>
            </div>
        </ModelTableLayout>
    );
};
