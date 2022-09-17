import React, { memo } from "react";
import { DataGrid, GridToolbar, viVN } from "@mui/x-data-grid";
import { columns } from "pages/ManagerUser/components/UserDataGrid/column";
import { rows } from "pages/ManagerUser/data/exampleData";
import { createTheme, ThemeProvider } from "@mui/material/styles";

//i18next translate
import { useTranslation } from "react-i18next";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

const theme = createTheme(viVN);

const themeD = createTheme(
    {
        palette: {
            mode: "dark",
        },
    },
    viVN
);

function UserDataGrid() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { t } = useTranslation();

    const localeTextData = {
        toolbarColumns: t("userMana.toolbarColumns"),
    };

    return (
        <div style={{ height: 300, width: "100%" }}>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    experimentalFeatures={{ newEditingApi: true }}
                    components={{ Toolbar: GridToolbar }}
                    // localeText={localeTextData}
                    localeText={
                        viVN.components.MuiDataGrid.defaultProps.localeText
                    }
                />
            </ThemeProvider>
        </div>
    );
}

export default memo(UserDataGrid);
