import React from 'react';
import { Table } from 'antd';
import { Link } from 'react-router-dom';



export const ModelsTable = ({modelsByApp, loading, appVerboseName}) => {
    
    var title = 'Администрирование сайта';
    
    if (modelsByApp != null ){
        const appLabel = Object.keys(modelsByApp)[0];
        if (appLabel){
            title = `Администрирование приложения ${modelsByApp[appLabel].verbose_name}` 
    }
    }
    const columns = [
        {
          title: title,
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => {
            if (record.type === 'app') {
              return (
                <Link 
                    to={`/django_spa/admin/${record.appLabel}/`}
                    style={{ cursor: 'pointer' }}>
                        <strong style={{ fontSize: '16px' }}>{text}</strong>
                </Link>
              )
            }
            return (
              <Link
                to={`/django_spa/admin/${record.appLabel}/${record.modelName}/`}
                style={{ color: '#417893', cursor: 'pointer' }}
              >
                {text}
              </Link>
            );
          },
        },
      ];
    function transformData(input) {
        const data = [];
        let keyCounter = 1;
      
        for (const [appLabel, appData] of Object.entries(input)) {
          data.push({ key: keyCounter.toString(), type: 'app', name: appData.verbose_name, appLabel: appLabel });
          keyCounter++;
      
          for (const model of appData.models) {
            data.push({
              key: keyCounter.toString(),
              type: 'model',
              name: model.verbose_name_plural,
              verbose_name: model.verbose_name,
              modelName: model.model_name,
              appLabel: appLabel
            });
            keyCounter++;
          }
        }
      
        return data;
      }
    return (
        <div>
            <Table
                style={{
                    width: 500
                }}
                columns={columns}
                loading={loading}
                dataSource={transformData(modelsByApp)}
                pagination={false}
                rowClassName={(record) => (record.type === 'app' ? 'app-row' : '')} // Классы для стилизации
                rowKey="key"
            />
        </div>
    )
}