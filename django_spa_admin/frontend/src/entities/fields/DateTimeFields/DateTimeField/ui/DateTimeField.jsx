import React, {useEffect, useState} from 'react';
import dayjs from "dayjs";
import {DatePicker} from "antd";

export const DateTimeField = ({data, onChange, ...props}) => {
    const [value, setValue] = useState(data.value);

    useEffect(() => {
        setValue(data.value || "");
    }, [data.value]);

    const handleChange = (e) => {
        setValue(e);
        onChange(e);
    }

    return (
        <DatePicker
            showTime
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            {...props}
        />
    )
}