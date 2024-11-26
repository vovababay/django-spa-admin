import React from 'react';
import { Card, Table, Collapse } from 'antd';
import getFieldComponent from "../InputField/InputField";

const DataRow = ({ label, value, type, verboseName, readonly, onChange, error, allowNull, helpText }) => {
    const fieldProps = {
        value,
        allowNull: allowNull,
    };

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
            {/* Левая колонка с названием поля */}
            <div style={{ width: '25%', paddingRight: '20px', fontWeight: 'bold' }}>
                {verboseName || label}:
            </div>

            {/* Правая колонка с полем ввода и текстом */}
            <div style={{ width: '70%' }}>
                <div>
                    {getFieldComponent({
                        fieldType: type,
                        fieldLabel: label,
                        fieldProps,
                        readonly,
                        onChange,
                        allowNull,
                    })}
                </div>

                {/* Текст-подсказка под полем */}
                {helpText && (
                    <div style={{ color: 'gray', marginTop: '5px', fontSize: '12px' }}>
                        {helpText}
                    </div>
                )}

                {/* Ошибки */}
                {error && (
                    <div style={{ color: 'red', marginTop: '5px', fontSize: '14px' }}>
                        {error.map((err, index) => (
                            <div key={index}>{err}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

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
export const InlineRenderer = ({ inlines }) => {
    console.log(inlines);
    // const data = Object.entries(inlines.objects)
    //     .filter(([key, details]) => details.is_primary_key === false)
    //     .map(([key, details]) => (
    //         <DataRow
    //             key={key}
    //             label={key}
    //             value={details.value}
    //             type={details.type}
    //             verboseName={details.verbose_name}
    //             readonly={details.readonly}
    //             onChange={onChange}
    //             error={errors[key]}
    //             allowNull={details.null}
    //             helpText={details.help_text}
    //         />
    //     ))
    return (
        <Collapse defaultActiveKey={['0']}>
            {inlines.map((inline, index) => (
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
