import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { getRequest } from '../../api';
import { PlusOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
const { Text } = Typography;


const ADDITION = 1
const CHANGE = 2
const DELETION = 3

const columns = [
    {
      title: 'Последние действия',
      dataIndex: 'action',
      key: 'action',
      render: (text, record) => (
        <>
          {record.action_flag === CHANGE && <Text type="warning"><EditOutlined /></Text>}
          {record.action_flag === DELETION && <Text type="danger"><CloseOutlined /></Text>}
          {record.action_flag === ADDITION && <Text type="success"><PlusOutlined/></Text>}
          

          {
            record.action_flag != DELETION ? <Link
            to={`${record.app_label}/${record.model_name}/${record.id}/change/` || '#'}
            style={{ marginLeft: 8, color: '#417893', cursor: record.action_flag != DELETION ? 'pointer' : 'default' }}
          >
            {record.object}
          </Link> : <Text style={{ marginLeft: 8 }}>{record.object}</Text>
          }
        </>
      ),
    }
  ];
  
const LastUserActionsTable = ({data, loading}) => {
    return (
        <Table
          columns={columns}
          loading={loading}
          dataSource={data.map((item, index) => ({ ...item, key: index }))}
          pagination={false}
          showHeader={true}
          style={{ borderRadius: 8 }}
        />
      );
}

export const LastUserActions = () => {
    const[ data, setData ] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        setLoading(true);
        try {
            const data = await getRequest('/last_actions/')
            // const dataResponse = await fetch(`/django_spa/api/last_actions/`);
            setData(data || []);
            


        } catch (error) {
          if (error.is403) {
            console.log("403")
            handle403Error(navigate);
          } else {
            console.error('Error fetching data:', error);
          }
            
        } finally {
            setLoading(false);
        }
    };

    
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div style={{marginLeft: 50}}>
            <LastUserActionsTable data={data} loading={loading}/>
        </div>
    )
}