import React from 'react';
import { Select, Button, Space } from 'antd';

export const ActionsDropdown = ({ actions, selectedAction, onActionChange, onExecute }) => {
    return (
        <Space>
            <Select
                placeholder="---------"
                allowClear
                onChange={onActionChange}
                value={selectedAction}
                style={{ width: 400 }}
            >
                {actions.map((action) => (
                    <Select.Option key={action.key} value={action.key}>
                        {action.label}
                    </Select.Option>
                ))}
            </Select>
            <Button type="primary" onClick={onExecute}>Выполнить</Button>
        </Space>
    );
};
