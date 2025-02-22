import dayjs from "dayjs";
import {DatePicker} from "antd";
import React, {useEffect, useState} from "react";

export const DateField = ({data, onChange, ...props}) => {
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
            value={value ? dayjs(value) : null}
            onChange={handleChange}
            {...props}
        />
    )
}