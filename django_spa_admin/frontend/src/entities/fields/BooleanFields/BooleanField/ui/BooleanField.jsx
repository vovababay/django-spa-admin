import {Select} from "antd";
import React, {useEffect, useState} from "react";

export const BooleanField = ({data, onChange, ...props}) => {
    const [value, setValue] = useState(data.value || data.default);

    useEffect(() => {
        const currentValueString = data.value === null ? data.default : data.value
        const currentValue = currentValueString === null ? 'null' : String(currentValueString)
        setValue(currentValue);
    }, [data.value]);

    const handleChange = (e) => {
        setValue(e);
        onChange(e);
    };
    return (
        <Select
        value={value}
        style={{ width: '200px' }}
        onChange={handleChange}
    >
        <Select.Option value="true">True</Select.Option>
        <Select.Option value="false">False</Select.Option>
    </Select>
    )
}