import React, {useEffect, useState} from "react";
import {DynamicField} from "@/features/DynamicField";
import {InlineRenderer} from "@/shared/ui/InlineRenderer";

export const DynamicForm = ({data, setEditedData}) => {
    useEffect(() => {
        // Инициализация начальных значений
        const initialData = {};
        Object.keys(data).forEach(key => {
            initialData[key] = data[key].value;
        });
        setEditedData(initialData);
    }, [data]);

    const handleChange = (field, value) => {
        console.log(field, value)
        setEditedData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    return (
        <div
            key={'dynamic_form'}
            style={{
            padding: 20,
            fontSize: "12"

        }}>
            {Object.keys(data)
                .filter((field) => data[field].is_primary_key === false)
                .map((field) => (
                    <div style={{display: 'flex', alignItems: 'flex-start', padding: 10, borderBottom: "1px solid #e8e8e8"}}>
                            <div style={{width: '20em', paddingRight: '20px', fontWeight: 'bold'}}>
                                {data[field].verbose_name || data[field].label}:
                            </div>
                            <div style={{width: '70%'}}>
                                <DynamicField
                                    key={field}
                                    data={data[field]}
                                    onChange={(value) => handleChange(field, value)}
                                />
                                {data[field].help_text && (
                                    <div style={{ color: 'gray', marginTop: '5px'}}>
                                        {data[field].help_text}
                                    </div>
                                )}
                            </div>
                        </div>
                        ))}
                {data.inlines && <InlineRenderer items={data.inlines}/>}

            </div>
                );
            };
