import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Table} from 'antd';
import { ModelTableLayout } from '@/shared/layouts/ModelTableLayout';
import {getHistory} from "@/pages/HistoryPage/api/getHistory";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/ru';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localeData);
dayjs.locale('ru');


const columns = [
  {
    title: 'Дата/Время',
    dataIndex: 'datetime',
    key: 'datetime',
  },
  {
    title: 'Пользователь',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: 'Действие',
    dataIndex: 'action',
    key: 'action',
  }
];

export const HistoryTable = ({ actions }) => {
  const data = actions.map((action, index) => ({
    key: index,
    datetime: dayjs.utc(action.action_time).local().format('D MMMM YYYY г. HH:mm'),
    user: action.user,
    action: action.change_message
  }));

  return <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowClassName={(_, index) => (index % 2 !== 0 ? "red-row" : "")}
  />;
};




export const HistoryPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName, pk } = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    useEffect(() => {
        if (appLabel) {
                getHistory(appLabel, modelName, pk )
                    .then(responseData=>{
                        setData(responseData);
                    })
                    .catch(error => {

                    }).finally(()=>{
                        setLoading(false);
                    })

            setActiveMenuItem({ "appLabel": appLabel, "modelName": null });
        }
    }, [appLabel, modelName, setActiveMenuItem]);
    console.log(data)
    if (loading) {
        return <div>loading</div>
    }
    return (
        <ModelTableLayout>
            <h1 style={{fontSize: 18, marginBottom: 24}}>История изменений: {data.object.__str__}</h1>
            <HistoryTable actions={data.actions}/>
        </ModelTableLayout>
    );
};
