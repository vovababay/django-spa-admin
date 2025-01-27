import DataRow from "@/shared/ui/DataRow/ui/DataRow";
import React from "react";

export const DataDisplay = ({ fields, data, onChange, errors }) => {
    return (
        <div style={{ padding: '20px', fontSize: 18 }}>
            {fields
                .filter(field => !field.is_primary_key)
                .map(field => (
                    <DataRow
                        key={field.name}
                        label={field.name}
                        value={data[field.name]}
                        type={field.type}
                        verboseName={field.verbose_name}
                        readonly={field.readonly}
                        onChange={onChange}
                        error={errors[field.name]}
                        allowNull={field.null}
                        helpText={field.help_text}
                    />
                ))}
        </div>
    );
};
