import React from 'react';
import {Button, Table} from 'antd';
import {Link, useNavigate} from 'react-router-dom';
import {PlusOutlined} from "@ant-design/icons";


export const ModelsTable = ({modelsByApp, loading, appVerboseName}) => {
    const navigate = useNavigate();
    var title = 'Администрирование сайта';
    
    if (modelsByApp != null ){
        if (Object.keys(modelsByApp).length < 2){
          const appLabel = Object.keys(modelsByApp)[0];
          if (appLabel){
              title = `Администрирование приложения ${modelsByApp[appLabel].verbose_name}`
        }
       
    }
    }
    const addObjHandle = (appLabel, modelName) => {
        const url = `/django_spa/admin/${appLabel}/${modelName}/add/`;
        navigate(url);
    };
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
                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                  <Link
                    to={`/django_spa/admin/${record.appLabel}/${record.modelName}/`}
                    style={{ color: '#417893', cursor: 'pointer' }}
                  >
                    {text}
                  </Link>
                    <Button
                        icon={<PlusOutlined />} // Иконка для кнопки "+"
                        size="small"
                        style={{ marginLeft: 'auto' }} // Прижать кнопку к правому краю
                        onClick={(e) => {
                            e.stopPropagation(); // Чтобы клик по кнопке не вызывал handleMenuClick
                            addObjHandle(record.appLabel, record.modelName);
                        }}
                    />
                </div>
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
                rowClassName={(record) => (record.type === 'app' ? 'app-row' : '')}
                rowKey="key"
            />
        </div>
    )
}