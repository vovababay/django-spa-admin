import React, { useState, useEffect } from "react";
import { Input } from "antd";

export const CharField = ({ data, onChange, ...props }) => {
    const [value, setValue] = useState(data.value || "");

    useEffect(() => {
        setValue(data.value || "");
    }, [data.value]);

    const handleChange = (e) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <Input
            style={{
                fontSize: 12
            }}
            value={value}
            onChange={handleChange}
            disabled={data.read_only}
            {...props}
        />
    );
};
