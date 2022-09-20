import React, { memo } from "react";
import { DataGrid, GridToolbar, viVN } from "@mui/x-data-grid";
import { columns } from "pages/ManagerUser/components/UserDataGrid/column";
import { rows } from "pages/ManagerUser/data/exampleData";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

const theme = createTheme();

const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function UserDataGrid() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    return (
        <div style={{ height: 300, width: "100%" }}>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    localeText={
                        viVN.components.MuiDataGrid.defaultProps.localeText
                    }
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{ Toolbar: GridToolbar }}
                />
            </ThemeProvider>
        </div>
    );
}

export default memo(UserDataGrid);
