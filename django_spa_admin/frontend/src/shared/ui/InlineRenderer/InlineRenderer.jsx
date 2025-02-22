import React from 'react';
import { Card, Table, Collapse } from 'antd';

// StackedInline Component
const StackedInline = ({ data }) => {
    return (
        <div>
            {data.map(item => (
                <Card key={item.id} title={data.verbose_name_plural} style={{ marginBottom: '16px' }}>
                    {Object.entries(item).map(([key, value]) => (
                        <p key={key}><strong>{key}:</strong> {value.toString()}</p>
                    ))}
                </Card>
            ))}
        </div>
    );
};

// TabularInline Component
const TabularInline = ({ data }) => {
    const columns = Object.keys(data[0]).map(key => ({
        title: key,
        dataIndex: key,
        key: key,
    }));

    return (
        <Table
            dataSource={data.map(item => ({ ...item, key: item.id }))}
            columns={columns}
            pagination={false}
        />
    );
};

// Main InlineRenderer Component
export const InlineRenderer = ({ items }) => {
    if (items.length === 0){
        return <></>
    }
    return (
        <Collapse defaultActiveKey={['0']}>
            {items.map((inline, index) => (
                <Collapse.Panel header={inline.verbose_name_plural} key={index}>
                    {inline.type === 'StackedInline' ? (
                        <StackedInline data={inline.objects} />
                    ) : (
                        <TabularInline data={inline.objects} />
                    )}
                </Collapse.Panel>
            ))}
        </Collapse>
    );
};
