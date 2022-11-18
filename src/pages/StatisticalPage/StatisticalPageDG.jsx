import React, { memo, useMemo, useState } from "react";
import { DataGrid, viVN } from "@mui/x-data-grid";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import AssignmentLateIcon from "@mui/icons-material/AssignmentLate";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";

import StatisticalToolbar from "./components/StatisticalToolbar/StatisticalToolbar";

import { formatterVND } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function NoRows() {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center">
            <AssignmentLateIcon fontSize="large" />
            <Box sx={{ mt: 1 }}>Không có đơn hàng trong thời gian đã chọn</Box>
            <Box sx={{ mt: 1 }}>
                Vui lòng chọn ngày khác và nhấn vào thống kê để xem thống kê
            </Box>
        </Stack>
    );
}

function StatisticalPageDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên sản phẩm",
                width: 800,
                renderCell: RenderCellExpand,
            },
            {
                field: "total_quantity",
                headerName: "Số lượng bán ra",
                width: 150,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return parseInt(params.value);
                },
            },
            {
                field: "total",
                headerName: "Doanh thu",
                width: 150,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return formatterVND.format(params.value);
                },
            },
        ],
        []
    );

    return (
        <Grid item xs={12}>
            <Card>
                <ThemeProvider theme={darkMode ? themeD : theme}>
                    <div style={{ height: 550, width: "100%" }}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            localeText={
                                viVN.components.MuiDataGrid.defaultProps
                                    .localeText
                            }
                            components={{
                                Toolbar: StatisticalToolbar,
                                NoRowsOverlay: NoRows,
                            }}
                            componentsProps={{
                                toolbar: {
                                    data,
                                    setData,
                                    darkMode,
                                    setLoading,
                                },
                            }}
                            loading={loading}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
                            }}
                            density="compact"
                        />
                    </div>
                </ThemeProvider>
            </Card>
        </Grid>
    );
}

export default memo(StatisticalPageDG);
