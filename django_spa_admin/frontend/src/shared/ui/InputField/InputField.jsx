import React, {useState} from 'react';
import { Input, InputNumber, Checkbox, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
// import 'jsoneditor-react/es/index.css'; // импортируем стили для редактора
import { JsonEditor } from "jsoneditor-react";
import 'jsoneditor-react/es/editor.min.css';
import {ManyToManyField} from "@/entities/fields/RelatedFields/ManyToManyField/ui/ManyToManyField";


const BooleanSelect = ({ fieldLabel, fieldProps, baseProps, onChange, allowNull }) => (
    <Select
        {...baseProps}
        value={fieldProps.value === null ? 'null' : String(fieldProps.value)}
        style={{ width: '200px' }}
        onChange={(value) => onChange(fieldLabel, value === 'null' ? null : value === 'true')}
    >
        {allowNull && (
            <Select.Option value="null">
                ---------
            </Select.Option>
        )}
        <Select.Option value="true">True</Select.Option>
        <Select.Option value="false">False</Select.Option>
    </Select>
);

const getFieldComponent = ({
                               fieldType,
                               fieldLabel,
                               fieldProps = {},
                               readonly = false,
                               onChange,
                                details
                           }) => {
    const baseProps = {
        ...fieldProps,
        details: details,
        disabled: readonly,
        onChange: (e) => {
            onChange(fieldLabel, e?.target?.value);
        }
    };
    switch (fieldType) {
        // Текстовые поля
        case 'CharField':
        case 'SlugField':
        case 'EmailField':
        case 'URLField':
        case 'UUIDField':
            return <Input {...baseProps} />;
        case 'TextField':
            return <TextArea rows={4} {...baseProps} />;

        // Числовые поля
        case 'IntegerField':
        case 'BigIntegerField':
        case 'SmallIntegerField':
        case 'PositiveIntegerField':
        case 'PositiveSmallIntegerField':
            return <InputNumber {...baseProps} />;
        case 'FloatField':
        case 'DecimalField':
            return <InputNumber {...baseProps} step={0.01} />;

        // Булевые поля
        case 'BooleanField':
            return (
                <BooleanSelect
                    fieldLabel={fieldLabel}
                    fieldProps={fieldProps}
                    baseProps={baseProps}
                    onChange={onChange}
                    allowNull={fieldProps.allowNull}
                />
            );

        // Поля даты и времени
        case 'DateField':
            return (
                <DatePicker
                    {...baseProps}
                    value={fieldProps.value ? dayjs(fieldProps.value) : null}
                />
            );
        case 'DateTimeField':
            return (
                <DatePicker
                    showTime
                    {...baseProps}
                    value={fieldProps.value ? dayjs(fieldProps.value) : null}
                />
            );
        case 'TimeField':
            return (
                <DatePicker
                    picker="time"
                    {...baseProps}
                    value={fieldProps.value ? dayjs(fieldProps.value) : null}
                />
            );
        case 'DurationField':
            return <Input {...baseProps} placeholder="Enter duration" />;

        // Поля выбора (Choices)
        case 'Choices':
            return (
                <Select {...baseProps}>
                    {fieldProps.choices?.map(choice => (
                        <Option key={choice.value} value={choice.value}>
                            {choice.label}
                        </Option>
                    ))}
                </Select>
            );

        // IP адреса
        case 'IPAddressField':
        case 'GenericIPAddressField':
            return <Input {...baseProps} placeholder="Enter IP address" />;

        case 'JSONField':
            return (
                <></>
            );

        // Поля с массивами
        case 'ArrayField':
            return (
                <TextArea
                    {...baseProps}
                    rows={4}
                    placeholder="Enter comma-separated values"
                    value={fieldProps.value ? fieldProps.value.join(', ') : ''}
                    onChange={(e) => {
                        const newValue = e.target.value.split(',').map((item) => item.trim());
                        onChange(fieldLabel, newValue);
                    }}
                />
            );
        case 'ManyToManyField':
            return <ManyToManyField {...baseProps}/>
        default:
            return <Input {...baseProps} />;
    }
};

export default getFieldComponent;
