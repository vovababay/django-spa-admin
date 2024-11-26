import React, { useEffect, useState } from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router-dom';
import { Table, Empty, Pagination, Input, message, Select, Button, Space } from 'antd';
import { CheckOutlined, CloseOutlined, QuestionCircleOutlined, CaretUpOutlined, CaretDownOutlined, CloseCircleOutlined, DownOutlined } from '@ant-design/icons';
import { ModelTableLayout } from '../../layouts/ModelTableLayout';
import { postRequest } from "../../api";

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
    const [dropdownItems, setDropdownItems] = useState([]); // Array to keep track of sorting fields and their order
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    const handleSelectChange = (key) => {
        const selectedItem = dropdownItems.find((item) => item.key === key);
        setSelectedAction(selectedItem);
    };
    const handleExecute = () => {
        if (selectedRows.length === 0) {
            message.warning('Пожалуйста, выберите элементы для действия');
            return
        }
        if (selectedAction) {
            const objects = selectedRows.map(item => parseInt(item.pk));
            const data = {
                action: selectedAction.key,
                objects: objects,
                _selected_action: 200,
                post: 'yes'
            }
            fetchAction(data).then(()=>{
                message.success(`Выполнение действия: ${selectedAction.label}`);
                fetchData(currentPage, pageSize, searchQuery, sortOrder);
                fetchFields();
            })

            // Здесь добавьте логику для выполнения действия
        } else {
            message.warning('Пожалуйста, выберите действие');
        }
    };
    const addObjHandle = () => {
        const url = `/django_spa/admin/${appLabel}/${modelName}/add/`;
        navigate(url)
    };
    const fetchAction = async (data) => {
        console.log(data)
        try {
            const responseCallAction = await postRequest(`/${appLabel}/${modelName}/call_action/`, data);
            console.log(responseCallAction);
            // const fieldsResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/meta/`);
            // const fieldsResult = await fieldsResponse.json();
            // setFields(fieldsResult.fields || []);
            // setListDisplayLinks(fieldsResult.list_display_links || [fieldsResult.fields[0]]);
            // setViewSearch(fieldsResult.exists_search);
            // setDropdownItems(fieldsResult.actions);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    }


    const fetchFields = async () => {
        console.log("sjdkjhajkhdjkas")
        setLoading(true);
        try {
            const fieldsResponse = await fetch(`/django_spa/api/${appLabel}/${modelName}/meta/`);
            const fieldsResult = await fieldsResponse.json();
            setFields(fieldsResult.list_display || []);
            setListDisplayLinks(fieldsResult.list_display_links || [fieldsResult.list_display[0]]);
            setViewSearch(fieldsResult.exists_search);
            setDropdownItems(fieldsResult.actions);
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
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            setSelectedRows(selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    const columns = transformFieldsToColumns(fields, listDisplayLinks);
    return (
        <>
            {viewSearch && (
                <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0'}} >
                        <Search
                            placeholder=""
                            onSearch={onSearch}
                            enterButton
                            style={{ width: '500px' }}
                        />
                        <span style={{ marginLeft: '16px' }}>Total {total} items</span>
                    </div>
                    <Button type="primary" onClick={addObjHandle}>
                        Добавить
                    </Button>
                </div>
            )}

        <>
            <span style={{marginLeft: 16}}>Действие: </span>
            <Space
                style={{
                    marginBottom: 16,
                }}>
                <Select
                    placeholder="---------"
                    allowClear
                    onChange={handleSelectChange}
                    style={{ width: 400 }}
                >
                    {dropdownItems.map((item) => (
                        <Select.Option key={item.key} value={item.key}>
                            {item.label}
                        </Select.Option>
                    ))}
                </Select>
                <Button type="primary" onClick={handleExecute}>
                    Выполнить
                </Button>
            </Space>
            <span style={{ marginLeft: '16px' }}>Выбрано {selectedRows.length} из {data.length} </span>
            </>
            <Table
                rowSelection={{
                    type: "checkbox",
                    ...rowSelection,
                }}
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
