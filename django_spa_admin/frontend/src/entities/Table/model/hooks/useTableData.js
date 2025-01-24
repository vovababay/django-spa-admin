import { useState } from 'react';

export const useTableData = () => {
    const [fields, setFields] = useState([]);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    return {
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
    };
};
