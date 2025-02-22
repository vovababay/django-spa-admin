import getFieldComponent from "@/shared/ui/InputField/InputField";
import React from "react";


const DataRow = ({ label, value, type, verboseName, readonly, onChange, error, allowNull, helpText, details }) => {
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
                        details,
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

export default DataRow;