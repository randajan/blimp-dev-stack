import React from "react";
import "./DataViewFilterInput.scss";

import { sayDataView } from "../dataViewSayTools";


const toggleValue = (values=[], value, checked)=>{
    if (!checked) { return values.filter(item=>item !== value); }
    if (values.includes(value)) { return values; }
    return [...values, value];
};

const textInput = ({ value, onChange })=>(
    <input
        type="search"
        value={value || ""}
        onChange={event=>onChange(event.target.value)}
    />
);

const booleanInput = ({ value, onChange, say })=>(
    <select
        value={value === true || value === false ? `${value}` : ""}
        onChange={event=>onChange(event.target.value)}
    >
        <option value="">{sayDataView(say, "AllOption")}</option>
        <option value="true">{sayDataView(say, "YesOption")}</option>
        <option value="false">{sayDataView(say, "NoOption")}</option>
    </select>
);

const numberInput = ({ value={}, onChange, say })=>(
    <div className="DataViewFilterInput range">
        <input
            type="number"
            placeholder={sayDataView(say, "MinPlaceholder")}
            value={value.min ?? ""}
            onChange={event=>onChange({ ...value, min:event.target.value })}
        />
        <input
            type="number"
            placeholder={sayDataView(say, "MaxPlaceholder")}
            value={value.max ?? ""}
            onChange={event=>onChange({ ...value, max:event.target.value })}
        />
    </div>
);

const selectInput = ({ value, onChange, options=[], say })=>(
    <select value={value || ""} onChange={event=>onChange(event.target.value)}>
        <option value="">{sayDataView(say, "AllOption")}</option>
        {options.map(option=>(
            <option key={option.value} value={option.value}>{option.label}</option>
        ))}
    </select>
);

const multiSelectInput = ({ value=[], onChange, options=[], say })=>(
    <div className="DataViewFilterInput checks">
        {options.length ? options.map(option=>(
            <label key={option.value}>
                <input
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={event=>onChange(toggleValue(value, option.value, event.target.checked))}
                />
                <span>{option.label}</span>
            </label>
        )) : <small>{sayDataView(say, "NoOptionsLabel")}</small>}
    </div>
);

const inputs = {
    boolean:booleanInput,
    multiSelect:multiSelectInput,
    number:numberInput,
    select:selectInput,
    text:textInput
};

export const DataViewFilterInput = (props)=>{
    const Input = inputs[props.type] || inputs.text;

    return <Input {...props} />;
};
