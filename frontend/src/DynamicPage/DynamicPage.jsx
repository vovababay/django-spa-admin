import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Table, Empty, Pagination } from 'antd';


  
const DataTable = ({ appLabel, modelName }) => {
    const [fields, setFields] = useState([]);
    const [listDisplayLinks, setListDisplayLinks] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0); // Общее количество объектов
    const [currentPage, setCurrentPage] = useState(1); // Текущая страница
    const [pageSize, setPageSize] = useState(10); // Размер страницы
    const [pagesCount, setPagesCount] = useState(0); // Количество страниц
    
    const fetchData = async (page, pageSize) => {
        setLoading(true);
        try {
            // Получаем названия колонок
            const fieldsResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/fields/`);
            const fieldsResult = await fieldsResponse.json();
            // Извлекаем только verbose_name для отображения
            setFields(fieldsResult.fields || []);
            setListDisplayLinks(fieldsResult.list_display_links || [fieldsResult.fields[0]]);

            // Получаем данные
            const dataResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/?page=${page}&page_size=${pageSize}`);
            const dataResult = await dataResponse.json();
            setData(dataResult.objects || []);
            setTotal(dataResult.meta.objects_count); // Общее количество объектов
            setPagesCount(dataResult.meta.pages_count); // Количество страниц
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchData(currentPage, pageSize);
    }, [currentPage, pageSize, appLabel, modelName]);

    const onChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const transformFieldsToColumns = (fields, listDisplayLinks) => {
        return fields.map(field => {
          const column = {
            title: field.verbose_name,
            dataIndex: field.name,
            key: field.name,
          };
      
          // Проверка наличия имени поля в listDisplayLinks с использованием some
          const isLinkField = listDisplayLinks.some(linkField => linkField === field.name);
      
          // Если поле присутствует в listDisplayLinks, добавляем кастомный render
          if (isLinkField) {
            column.render = (text, record) => (
              <Link 
                to={`/django_spa/admin/${appLabel}/${modelName}/${record.pk}/`}
                style={{color: '#417893'}}>
                {text}
              </Link>
            );
          }
      
          return column;
        });
      };
      
      
      
    const columns = transformFieldsToColumns(fields, listDisplayLinks);


    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
          disabled: record.name === 'Disabled User',
          name: record.name,
        }),
      };
    
    
    return (
        <>
            <Table 
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
                title={() => `Total ${total} items`}
                footer={()=>'Что то'}
                dataSource={data} 
                loading={loading}
                columns={columns} 
                bordered
                rowKey="id"
                locale={{
                    emptyText: <Empty description="No Data"/>,
                    }}
                pagination={false}
            />
            <Pagination 
                style={{margin: "16px 0"}}
                showQuickJumper 
                showSizeChanger 
                defaultCurrent={currentPage} 
                total={total} 
                pageSize={pageSize}
                showTotal={(total) => `Total ${total} items`} 
                onChange={onChangePage} 
                pageSizeOptions={['10', '20', '50', '100']}
            />
        </>
    );
};

export const DynamicPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();
    console.log(useParams())

    useEffect(() => {
        if (appLabel && modelName) {
            setActiveMenuItem({ "appLabel": appLabel, "modelName": modelName });
        }
    }, [appLabel, modelName, setActiveMenuItem]);

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
    }
    return (
        <div>
            <DataTable appLabel={appLabel} modelName={modelName} />
        </div>
    );
};
