import React, { memo, useState, useEffect } from "react";
import { DataGrid, GridToolbar, viVN } from "@mui/x-data-grid";
import { rCDGcolumns } from "pages/ManagerRequestContact/components/RequestContactDG/column";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import requestContactApi from "api/RequestContact/requestContactApi";

const theme = createTheme();

const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function RequestContactDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getData() {
            const response = await requestContactApi.getAll();
            if (response.status === 200) {
                setData(response.data);
                setLoading(false);
            }
            console.log(response);
        }
        getData();
    }, []);

    return (
        <div style={{ height: 300, width: "100%" }}>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <DataGrid
                    rows={data}
                    columns={rCDGcolumns}
                    localeText={
                        viVN.components.MuiDataGrid.defaultProps.localeText
                    }
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{ Toolbar: GridToolbar }}
                    loading={loading}
                />
            </ThemeProvider>
        </div>
    );
}

export default memo(RequestContactDG);
