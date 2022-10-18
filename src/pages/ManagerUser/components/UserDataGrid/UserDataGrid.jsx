import React, { memo } from "react";
import { DataGrid, GridToolbar, viVN } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import { columns } from "pages/ManagerUser/components/UserDataGrid/column";
import { rows } from "pages/ManagerUser/data/exampleData";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { useSnackbar } from "notistack";

const theme = createTheme();

const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function UserDataGrid() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleRefresh = () => {
        if (false) {
            enqueueSnackbar("Tải dữ liệu thành công", {
                variant: "success",
                style: {
                    borderColor: "#43a047",
                    color: "#43a047",
                },
                action: (key) => (
                    <IconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                        style={{
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ),
            });
        } else {
            enqueueSnackbar("Lỗi: không tải được dữ liệu", {
                variant: "error",
                action: (key) => (
                    <IconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                        style={{
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ),
            });
        }
    };

    return (
        <>
            <Grid item xs={12}>
                <Card m={2}>
                    <IconButton size="small" onClick={handleRefresh}>
                        <RefreshIcon />
                    </IconButton>
                </Card>
            </Grid>
            <Grid item xs={12}>
                <Card>
                    <div style={{ height: 500, width: "100%" }}>
                        <ThemeProvider theme={darkMode ? themeD : theme}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                localeText={
                                    viVN.components.MuiDataGrid.defaultProps
                                        .localeText
                                }
                                experimentalFeatures={{ newEditingApi: true }}
                                components={{ Toolbar: GridToolbar }}
                            />
                        </ThemeProvider>
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(UserDataGrid);
