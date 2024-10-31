import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, Empty, Pagination } from 'antd';
import { ModelTableLayout } from '../layouts/ModelTableLayout';

const DataRow = ({ label, value, type, verboseName }) => (
    <div style={{ display: 'flex', marginBottom: '10px'  }}>
        <strong style={{ width: '400px', textTransform: 'none' }}>{verboseName || label} ({type}):</strong>
        <span>{String(value)}</span>
    </div>
);

const DataDisplay = ({ data }) => {
    return (
        <div style={{ padding: '20px', fontSize: 18 }}>
            {Object.entries(data).map(([key, details]) => (
                <DataRow
                    key={key}
                    label={key}
                    value={details.value}
                    type={details.type}
                    verboseName={details.verbose_name}
                />
            ))}
        </div>
    );
};

export const ElementPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    const fetchData = async () => {
        setLoading(true);
        try {
            // Получаем названия колонок
            const dataResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/${pk}/`);
            const dataResult = await dataResponse.json();
            // Извлекаем только verbose_name для отображения
            // setFields(fieldsResult.fields || []);
            // setListDisplayLinks(fieldsResult.list_display_links || [fieldsResult.fields[0]]);

            // Получаем данные
            // const dataResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/?page=${page}&page_size=${pageSize}`);
            // const dataResult = await dataResponse.json();
            setData(dataResult || {});
            // setTotal(dataResult.meta.objects_count); // Общее количество объектов
            // setPagesCount(dataResult.meta.pages_count); // Количество страниц
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData()
        if (appLabel && modelName) {
            setActiveMenuItem({ "appLabel": appLabel, "modelName": modelName });
        }
    }, [appLabel, modelName, pk, setActiveMenuItem]);

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
    }
    return (
        <ModelTableLayout>
            {/* <h1>{appLabel} {modelName} с ID: {pk}</h1> */}
            <DataDisplay data={data}/>
        </ModelTableLayout>
    );
};
