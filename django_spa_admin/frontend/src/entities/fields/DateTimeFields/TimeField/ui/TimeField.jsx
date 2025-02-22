import dayjs from "dayjs";
import {DatePicker} from "antd";
import React from "react";

export const TimeField = ({data, onChange, ...props}) => {
    return (
        <DatePicker
            picker="time"
            value={data.value ? dayjs(data.value) : null}
            {...props}
        />
    )
}