import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { PlusOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons';
const { Text } = Typography;
import {USER_ACTIONS} from '@/shared/config'
import {getLastActions} from "@/widgets/LastUserActions/api/getLastActions";
import {handle403Error} from "@/shared/api/authService";


const renderActionFlagIcon = (actionFlag) => {
  switch (actionFlag) {
    case USER_ACTIONS.CHANGE:
      return <Text type="warning"><EditOutlined /></Text>;
    case USER_ACTIONS.DELETION:
      return <Text type="danger"><CloseOutlined /></Text>;
    case USER_ACTIONS.ADDITION:
      return <Text type="success"><PlusOutlined /></Text>;
    default:
      return null;
  }
};

const renderObjectLink = (record) => {
  const linkStyle = { marginLeft: 8, color: '#417893', cursor: 'pointer' };
  const textStyle = { marginLeft: 8 };

  if (record.action_flag === USER_ACTIONS.DELETION) {
    return <Text style={textStyle}>{record.object}</Text>;
  }

  return (
    <Link
      to={`${record.app_label}/${record.model_name}/${record.id}/change/` || '#'}
      style={linkStyle}
    >
      {record.object}
    </Link>
  );
};

const columns = [
  {
    title: 'Последние действия',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <>
        {renderActionFlagIcon(record.action_flag)}
        {renderObjectLink(record)}
      </>
    ),
  },
];

export const LastUserActions = () => {
    const[ data, setData ] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    
    useEffect(() => {
        getLastActions()
            .then((data) => setData(data || []))
            .catch(error => {
                if (error.is403) handle403Error(navigate)
                else console.error('Error fetching data:', error);
            })
            .finally(()=> setLoading(false))
    }, []);
    return (
        <div style={{marginLeft: 50}}>
            <Table
                columns={columns}
                loading={loading}
                dataSource={data.map((item, index) => ({ ...item, key: index }))}
                pagination={false}
                showHeader={true}
                style={{ borderRadius: 8 }}
            />
        </div>
    )
}