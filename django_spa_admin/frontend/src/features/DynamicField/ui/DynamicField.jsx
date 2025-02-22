import React from "react";
import {
    CharField, SlugField, TextField, BooleanField, EmailField, URLField, UUIDField, FilePathField,
    IntegerField, BigIntegerField, SmallIntegerField, PositiveSmallIntegerField, PositiveIntegerField,
    FloatField, DecimalField, NullBooleanField, DateField, DateTimeField, TimeField, DurationField, BinaryField,
    ForeignKey, OneToOneField, ManyToManyField, JSONField, ArrayField, AutoField, BigAutoField, CITextField,
    GenericIPAddressField, HStoreField, IPAddressField
} from "@/entities/fields";

const TEXT_FIELD_TYPES = {
    "CharField": CharField,
    "TextField": TextField,
    "SlugField": SlugField,
    "EmailField": EmailField,
    "URLField": URLField,
    "UUIDField": UUIDField,
    "FilePathField": FilePathField
}
const INTEGER_FIELD_TYPES = {
    "IntegerField": IntegerField,
    "BigIntegerField": BigIntegerField,
    "SmallIntegerField": SmallIntegerField,
    "PositiveIntegerField": PositiveIntegerField,
    "PositiveSmallIntegerField": PositiveSmallIntegerField,
    "FloatField": FloatField,
    "DecimalField": DecimalField
}
const BOOLEAN_FIELD_TYPES = {
    "BooleanField": BooleanField,
    "NullBooleanField": NullBooleanField
}
const DATE_TIME_FIELD_TYPES = {
    "DateField": DateField,
    "DateTimeField": DateTimeField,
    "TimeField": TimeField,
    "DurationField": DurationField
}
const RELATED_FIELD_TYPES = {
    "ForeignKey": ForeignKey,
    "OneToOneField": OneToOneField,
    "ManyToManyField": ManyToManyField
}
const FIELD_TYPES = {
    ...TEXT_FIELD_TYPES,
    ...INTEGER_FIELD_TYPES,
    ...BOOLEAN_FIELD_TYPES,
    ...DATE_TIME_FIELD_TYPES,
    ...RELATED_FIELD_TYPES,
    "BinaryField": BinaryField,
    "JSONField": JSONField,
    "ArrayField": ArrayField,
    "HStoreField": HStoreField,
    "CITextField": CITextField,
    "BigAutoField": BigAutoField,
    "AutoField": AutoField,
    "IPAddressField": IPAddressField,
    "GenericIPAddressField": GenericIPAddressField
}



export const DynamicField = ({data, onChange, ...props}) => {
    const FieldComponent = FIELD_TYPES[data.type];
    if (!FieldComponent) {
        return null;
    }
    return (
        <FieldComponent
            data={data}
            onChange={onChange}
            {...props}
        />
    );
};
