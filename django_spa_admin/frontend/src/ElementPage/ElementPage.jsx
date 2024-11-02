import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Table, Empty, Pagination } from 'antd';
import { ModelTableLayout } from '../layouts/ModelTableLayout';
import { handle403Error } from '../authService';
import { getRequest } from '../api';
import { Typography } from 'antd';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined, QuestionOutlined } from '@ant-design/icons';


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

const DataRow = ({ label, value, type, verboseName }) => {
    return (
        <div style={{ display: 'flex', marginBottom: '10px'  }}>
            <strong style={{ width: '400px', textTransform: 'none' }}>{verboseName || label} ({type}):</strong>
            <span>{getVisibilityValue(value, type)}</span>
        </div>
    )
};

const DataDisplay = ({ data }) => {
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
                    />
                ))}
        </div>
    );
};


export const ElementPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});
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
