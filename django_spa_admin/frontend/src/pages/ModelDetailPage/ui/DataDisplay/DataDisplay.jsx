import React from "react";
import DataRow from "@/shared/ui/DataRow/ui/DataRow";
import {InlineRenderer} from "@/shared/ui/InlineRenderer";

export const DataDisplay = ({ data, onChange, errors }) => {
    return (
        <div style={{
            padding: 20,
            fontSize: 18
        }}>
            {Object.entries(data)
                .filter(([key, details]) => details.is_primary_key === false)
                .map(([key, details]) => (
                    <DataRow
                        key={key}
                        label={key}
                        value={details.value}
                        type={details.type}
                        verboseName={details.verbose_name}
                        readonly={details.readonly}
                        onChange={onChange}
                        error={errors[key]}
                        allowNull={details.null}
                        helpText={details.help_text}
                    />
                ))}
            {data.inlines && <InlineRenderer inlines={data.inlines} />}
        </div>
    );
};
