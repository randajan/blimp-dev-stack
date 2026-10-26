import React from "react";
import "./DataViewSettings.scss";
import { Button } from "@mui/material";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import { Block } from "@randajan/jet-react/dom/block";

import { DataViewColumnControl } from "../DataViewColumnControl/DataViewColumnControl";
import { sayDataView } from "../dataViewSayTools";
import { hasColumnControl } from "../dataViewViewTools";


export const DataViewSettings = (props)=>{
    const { controlProps, onReset, resetLabel, say, table } = props;
    const columns = table.getAllLeafColumns().filter(hasColumnControl);

    return (
        <Block level={0} className="DataViewSettings" caption={sayDataView(say, "FilterLabel")}>
            <div className="DataViewSettings-controls">
                {columns.map(column=>(
                    <DataViewColumnControl
                        key={column.id}
                        {...controlProps}
                        column={column}
                        inline
                        say={say}
                    />
                ))}
            </div>
            <footer className="DataViewSettings-actions">
                <Button
                    className="BlimpMuiPanel-action"
                    onClick={onReset}
                    startIcon={<RestartAltOutlinedIcon fontSize="small" />}
                    type="button"
                    variant="outlined"
                >
                    {resetLabel}
                </Button>
            </footer>
        </Block>
    );
};
