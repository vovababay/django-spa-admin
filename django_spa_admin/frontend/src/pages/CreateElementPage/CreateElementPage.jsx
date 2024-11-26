import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { Button, message } from 'antd';
import { ModelTableLayout } from '../../layouts/ModelTableLayout';
import { getRequest, postRequest } from '../../api';
import { handle403Error } from '../../authService';
import getFieldComponent from "../../components/InputField/InputField"; // Используем ранее созданный DataRow


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

const DataDisplay = ({ fields, data, onChange, errors }) => {
    return (
        <div style={{ padding: '20px', fontSize: 18 }}>
            {fields
                .filter(field => !field.is_primary_key) // Исключаем поля с is_primary_key
                .map(field => (
                    <DataRow
                        key={field.name}
                        label={field.name} // Используем name для идентификации
                        value={data[field.name]}
                        type={field.type}
                        verboseName={field.verbose_name}
                        readonly={field.readonly}
                        onChange={onChange}
                        error={errors[field.name]}
                        allowNull={field.null}
                        helpText={field.help_text}
                    />
                ))}
        </div>
    );
};


export const CreateElementPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName  } = useParams();
    const [fields, setFields] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sendLoading, setSendLoading] = useState(false);
    const [data, setData] = useState({});
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const fetchMeta = async () => {
        setLoading(true);
        try {
            const meta = await getRequest(`/${appLabel}/${modelName}/meta/`);
            console.log('meta', meta)
            const metaFields = meta.fields.filter(field => !field.is_primary_key); // Убираем primary_key
            setFields(metaFields);

            // Создаем начальные данные
            const initialData = metaFields
                .filter(field => !field.is_primary_key) // Исключаем is_primary_key
                .reduce((acc, field) => {
                    acc[field.name] = field.default !== null ? field.default : (field.null ? null : '');
                    return acc;
                }, {});


            setData(initialData);
        } catch (error) {
            if (error.is403) {
                handle403Error(navigate);
            } else {
                console.error('Error fetching meta:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const createElement = async () => {
        setSendLoading(true);
        try {
            const responseCreateObject = await postRequest(`/${appLabel}/${modelName}/`, data);
            message.success('Объект успешно создан');
            console.log(responseCreateObject);
            const objectId = responseCreateObject.id.value;
            const url = `/django_spa/admin/${appLabel}/${modelName}/${objectId}/change/`
            navigate(url); // Возвращаемся назад
        } catch (error) {
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
                console.error('Error creating element:', error);
            }
        } finally {
            setSendLoading(false);
        }
    };

    const changeField = (fieldName, event) => {
        setData(prevData => ({
            ...prevData,
            [fieldName]: event?.target ? event.target.value : event,
        }));
    };

    useEffect(() => {
        fetchMeta();
    }, [appLabel, modelName]);

    if (loading) {
        return <div>Loading...</div>;
    }
    console.log(fields)
    console.log(data)
    return (
        <ModelTableLayout>
            <DataDisplay fields={fields} data={data} onChange={changeField} errors={errors} />
            <Button type="primary" onClick={createElement} loading={sendLoading}>
                Создать
            </Button>
        </ModelTableLayout>
    );
};
