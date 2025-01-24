import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Table, Empty, Pagination, message } from 'antd';
import { useTableData } from '@/entities/Table/model/hooks/useTableData';
// import { fetchAction, fetchData, fetchFields } from '@/entities/Table/model/api';
import { transformFieldsToColumns } from './Columns';
import { AddObjectButton } from '@/features/AddObject/ui/AddObjectButton';
import { ActionsDropdown } from '@/features/ActionsDropdown/ui/ActionsDropdown';
import {fetchData} from "@/entities/Table/api/fetchData";
import {fetchAction} from "@/entities/Table/api/fetchAction";
import {fetchFields} from "@/entities/Table/api/fetchFields";
import Search from "antd/es/input/Search";

export const DataTable = ({ appLabel, modelName }) => {
    const [listDisplayLinks, setListDisplayLinks] = useState([]);
    const [viewSearch, setViewSearch] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState([]);
    const [dropdownItems, setDropdownItems] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedRows, setSelectedRows] = useState([]);

    const {
        fields,
        setFields,
        data,
        setData,
        loading,
        setLoading,
        total,
        setTotal,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
    } = useTableData();

    const handleExecute = () => {
        if (selectedRows.length === 0) {
            message.warning('Пожалуйста, выберите элементы для действия');
            return;
        }
        if (selectedAction) {
            const objects = selectedRows.map((item) => parseInt(item.pk));
            const data = {
                action: selectedAction.key,
                objects,
                _selected_action: 200,
                post: 'yes',
            };
            fetchAction(appLabel, modelName, data).then(() => {
                message.success(`Выполнение действия: ${selectedAction.label}`);
                fetchData(appLabel, modelName, currentPage, pageSize, searchQuery, sortOrder).then((data) => {
                    setData(data.objects || []);
                    setTotal(data.meta.objects_count);
                    setLoading(false);
                });
            });
        } else {
            message.warning('Пожалуйста, выберите действие');
        }
    };

    useEffect(() => {
        // fetchData(appLabel, modelName, currentPage, pageSize, searchQuery, sortOrder).then((data) => {
        //     setData(data.objects || []);
        //     setTotal(data.meta.objects_count);
        //     setLoading(false);
        // });
        // fetchFields(appLabel, modelName).then((data) => {
            // setFields(data.list_display || []);
            // setListDisplayLinks(data.list_display_links || [data.list_display[0]]);
            // setViewSearch(data.exists_search);
            // setDropdownItems(data.actions);
        // });
        setCurrentPage(1);
        setSearchQuery('');

    }, [appLabel, modelName]);

    useEffect(() => {
        fetchData(appLabel, modelName, currentPage, pageSize, searchQuery, sortOrder).then((data) => {
            setData(data.objects || []);
            setTotal(data.meta.objects_count);
            setLoading(false);
        });
        fetchFields(appLabel, modelName).then((data) => {
            setFields(data.list_display || []);
            setListDisplayLinks(data.list_display_links || [data.list_display[0]]);
            setViewSearch(data.exists_search);
            setDropdownItems(data.actions);
        });
    }, [currentPage, pageSize, appLabel, modelName, searchQuery, sortOrder]);

    const onSearch = (value) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const onChangePage = (page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
    };

    const columns = transformFieldsToColumns(fields, listDisplayLinks, sortOrder, setSortOrder, appLabel, modelName);

    const rowSelection = {
        onChange: (_, selectedRows) => setSelectedRows(selectedRows),
    };

    return (
        <>
            {viewSearch && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Search
                            placeholder="Введите запрос"
                            onSearch={onSearch}
                            enterButton
                            style={{ width: 400 }}
                        />
                        <span style={{ marginLeft: 16 }}>Всего: {total}</span>
                    </div>
                    <AddObjectButton appLabel={appLabel} modelName={modelName} />
                </div>
            )}
            <ActionsDropdown
                actions={dropdownItems}
                onActionChange={setSelectedAction}
                onExecute={handleExecute}
                selectedCount={selectedRows.length}
            />
            <Table
                rowSelection={rowSelection}
                dataSource={data}
                loading={loading}
                columns={columns}
                rowKey="id"
                locale={{ emptyText: <Empty description="Нет данных" /> }}
                pagination={false}
            />
            <Pagination
                style={{ marginTop: 16 }}
                total={total}
                current={currentPage}
                pageSize={pageSize}
                showSizeChanger
                onChange={onChangePage}
            />
        </>
    );
};

