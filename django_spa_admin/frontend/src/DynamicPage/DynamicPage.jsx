import React, { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Table, Empty, Pagination, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined, CaretUpOutlined, CaretDownOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { ModelTableLayout } from '../layouts/ModelTableLayout';
const { Search } = Input;

const DataTable = ({ appLabel, modelName }) => {
    const [fields, setFields] = useState([]);
    const [listDisplayLinks, setListDisplayLinks] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState( 1);
    const [pageSize, setPageSize] = useState(10);
    const [viewSearch, setViewSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [needSearch, setNeedSearch] = useState(false);
    const [sortOrder, setSortOrder] = useState([]); // Array to keep track of sorting fields and their order
    

    const fetchFields = async () => {
        setLoading(true);
        try {
            const fieldsResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/meta/`);
            const fieldsResult = await fieldsResponse.json();
            setFields(fieldsResult.fields || []);
            setListDisplayLinks(fieldsResult.list_display_links || [fieldsResult.fields[0]]);
            setViewSearch(fieldsResult.exists_search);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchData = async (page, pageSize, query = '', sort = []) => {
        setLoading(true);
        try {
            const sortParam = sort
                .map(({ columnIndex, order }) => `${order === 'asc' ? '' : '-'}${columnIndex}`)
                .join('.');
            const dataResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/?page=${page}&page_size=${pageSize}&q=${query}&o=${sortParam}`);
            const dataResult = await dataResponse.json();
            
            if (dataResponse.status === 400) {
                dataResult.errors.forEach(error => message.error(error));
                return;
            }

            setData(dataResult.objects || []);
            setTotal(dataResult.meta.objects_count);
            setNeedSearch(false);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(currentPage, pageSize, searchQuery, sortOrder);
        fetchFields();
    }, [currentPage, pageSize, appLabel, modelName, needSearch, sortOrder]);

    const onSearch = (value) => {
        setSearchQuery(value);
        setNeedSearch(true);
        setCurrentPage(1);
    };

    const onChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const handleSort = (columnIndex) => {
        setSortOrder((prevSortOrder) => {
            const existingSort = prevSortOrder.find(item => item.columnIndex === columnIndex);
            const newOrder = [...prevSortOrder];
            
            if (existingSort) {
                if (existingSort.order === 'asc') {
                    existingSort.order = 'desc';
                } else {
                    // Remove the field from sorting if already in descending order
                    return newOrder.filter(item => item.columnIndex !== columnIndex);
                }
            } else {
                // Add new field to sort in ascending order
                newOrder.push({ columnIndex, order: 'asc' });
            }
            return newOrder;
        });
    };

    const transformFieldsToColumns = (fields, listDisplayLinks) => {
        return fields.map((field, index) => {
            const columnIndex = index + 1; // Индексы колонок начинаются с 1
            const sortInfo = sortOrder.find(item => item.columnIndex === columnIndex);
            const sortIcon = sortInfo
                ? sortInfo.order === 'asc'
                    ? <CaretUpOutlined />
                    : <CaretDownOutlined />
                : null;

            const sortPriority = sortOrder.findIndex(item => item.columnIndex === columnIndex);
            const priorityLabel = sortPriority !== -1 ? <span style={{ marginLeft: '4px' }}>{sortPriority + 1}</span> : null;

            const removeSortIcon = sortInfo ? (
                <CloseCircleOutlined
                    onClick={(e) => {
                        e.stopPropagation();
                        setSortOrder((prevSortOrder) =>
                            prevSortOrder.filter(item => item.columnIndex !== columnIndex)
                        );
                    }}
                />
            ) : null;

            const column = {
                title: (
                    <div
                        style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', maxHeight: 20 }}
                        onClick={() => handleSort(columnIndex)}
                    >
                        <span>{field.verbose_name}</span>
                        <span style={{ marginLeft: '4px' }}>{priorityLabel}</span>
                        <span style={{ marginLeft: '4px' }}>{sortIcon}</span>
                        {sortInfo && (
                            <span style={{ marginLeft: '4px', visibility: 'hidden' }} onMouseEnter={(e) => e.currentTarget.style.visibility = 'visible'} onMouseLeave={(e) => e.currentTarget.style.visibility = 'hidden'}>
                                {removeSortIcon}
                            </span>
                        )}
                    </div>
                ),
                dataIndex: field.name,
                key: field.name,
            };

            if (listDisplayLinks.includes(field.name)) {
                column.render = (text, record) => (
                    <Link to={`/django_spa/admin/${appLabel}/${modelName}/${record.pk}/change/`}
                      style={{color: '#417893', cursor: 'pointer'}}
                      >
                        {text}
                    </Link>
                );
            }

            if (field.type === "BooleanField") {
                column.render = (status) => {
                    return status === null ? <QuestionCircleOutlined /> : (
                        status ? <CheckOutlined style={{ color: 'green' }} /> : <CloseOutlined style={{ color: 'red' }} />
                    );
                };
            }

            return column;
        });
    };

    const columns = transformFieldsToColumns(fields, listDisplayLinks);

    return (
        <>
            {viewSearch && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
                    <Search
                        placeholder="Enter search text"
                        onSearch={onSearch}
                        enterButton
                        style={{ width: '500px' }}
                    />
                    <span style={{ marginLeft: '16px' }}>Total {total} items</span>
                </div>
            )}
            <Table
                dataSource={data}
                loading={loading}
                columns={columns}
                bordered
                rowKey="id"
                locale={{ emptyText: <Empty description="No Data" /> }}
                pagination={false}
            />
            <Pagination
                style={{ margin: '16px 0' }}
                showQuickJumper
                showSizeChanger
                defaultCurrent={currentPage}
                total={total}
                pageSize={pageSize}
                onChange={onChangePage}
                pageSizeOptions={[10, 20, 50, 100]}
            />
        </>
    );
};

export const DynamicPage = ({ activeMenuItem, setActiveMenuItem }) => {
    const { appLabel, modelName } = useParams();

    useEffect(() => {
        if (appLabel && modelName) {
            setActiveMenuItem({ appLabel, modelName });
        }
    }, [appLabel, modelName, setActiveMenuItem]);

    if (!appLabel || !modelName) {
        return <div>Error: No appLabel or modelName provided.</div>;
    }
    return (
        <ModelTableLayout appLabel={appLabel} modelName={modelName}>
            <DataTable appLabel={appLabel} modelName={modelName} />
        </ModelTableLayout>
    );
};
