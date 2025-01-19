import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {Table, Empty, Pagination, Button, message} from 'antd';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import { handle403Error } from '@/shared/api/authService';
import {getRequest, patchRequest} from '@/shared/api/api';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';
import getFieldComponent from "@/shared/ui/InputField/InputField";
import {InlineRenderer} from "@/shared/ui/InlineRenderer";


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

const DataRow = ({ label, value, type, verboseName, readonly, onChange, error, allowNull, helpText }) => {
    const fieldProps = {
        value,
        allowNull: allowNull,
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
            {/* Левая колонка с названием поля */}
            <div style={{ width: '25%', paddingRight: '20px', fontWeight: 'bold' }}>
                {verboseName || label}:
            </div>

            {/* Правая колонка с полем ввода и текстом */}
            <div style={{ width: '70%' }}>
                <div>
                    {getFieldComponent({
                        fieldType: type,
                        fieldLabel: label,
                        fieldProps,
                        readonly,
                        onChange,
                        allowNull,
                    })}
                </div>

                {/* Текст-подсказка под полем */}
                {helpText && (
                    <div style={{ color: 'gray', marginTop: '5px', fontSize: '12px' }}>
                        {helpText}
                    </div>
                )}

                {/* Ошибки */}
                {error && (
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
                        {error.map((err, index) => (
                            <div key={index}>{err}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



const DataDisplay = ({ data, onChange, errors }) => {
    return (
        <div style={{ padding: '20px', fontSize: 18 }}>
            {Object.entries(data)
                .filter(([key, details]) => details.is_primary_key === false)
                .map(([key, details]) => (
                    <DataRow
                        key={key}
                        label={key}
                        value={details.value}
                        type={details.type}
                        verboseName={details.verbose_name}
                        readonly={details.readonly}
                        onChange={onChange}
                        error={errors[key]}
                        allowNull={details.null}
                        helpText={details.help_text}
                    />
                ))}
            {data.inlines && <InlineRenderer inlines={data.inlines} />}
        </div>
    );
};



export const ElementPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [data, setData] = useState({});
    const [dataToSend, setDataToSend] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const dataResult = await getRequest(`/${appLabel}/${modelName}/${pk}/`);
            setData(dataResult || {});
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
    const fetchEditedData = async ({url}) => {
        setSendLoading(true);
        try {
            const dataResult = await patchRequest(`/${appLabel}/${modelName}/${pk}/`, dataToSend);
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
        fetchData()
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
        console.log('changeField', fieldLabel, event);
        setDataToSend((prevData) => ({
            ...prevData,
            [fieldLabel]: event
        }));
    };

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
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
