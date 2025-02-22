import React from "react";
import {Input} from "antd";

export const TextField = ({value, onChange}) => {
    return (
        <Input.TextArea value={value} onChange={(e) => onChange(e.target.value)} />
    );
};
