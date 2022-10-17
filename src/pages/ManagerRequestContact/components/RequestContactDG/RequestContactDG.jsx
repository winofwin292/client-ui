import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import {
    DataGrid,
    GridToolbar,
    viVN,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RenderCellExpand } from "components/common/RenderCellExpand";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/Undo";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { useSnackbar } from "notistack";

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
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getData = useCallback(async () => {
        const response = await requestContactApi.getAll();
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
        }
    }, []);

    const handleCancel = useCallback(
        async (e, id) => {
            e.preventDefault();
            const data = {
                id: id,
            };
            const response = await requestContactApi.cancelChangeStatus(data);
            if (response.status === 200) {
                enqueueSnackbar(response.data, {
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
                getData();
            } else {
                enqueueSnackbar(response.data, {
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
        },
        [closeSnackbar, enqueueSnackbar, getData]
    );

    const handleChange = useCallback(
        async (e, id) => {
            e.preventDefault();
            const data = {
                id: id,
            };
            const response = await requestContactApi.changeStatus(data);
            if (response.status === 200) {
                enqueueSnackbar(response.data, {
                    variant: "success",
                    style: {
                        borderColor: "#43a047",
                        color: "#43a047",
                    },
                    action: (key) => (
                        <>
                            <IconButton
                                size="small"
                                onClick={(e) => handleCancel(e, id)}
                                title={"Hoàn tác"}
                                style={{
                                    color: "white",
                                }}
                            >
                                <UndoIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => closeSnackbar(key)}
                                style={{
                                    color: "white",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ),
                });
                getData();
            } else {
                enqueueSnackbar(response.data, {
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
        },
        [closeSnackbar, enqueueSnackbar, getData, handleCancel]
    );

    const columns = useMemo(
        () => [
            { field: "id", headerName: "ID", width: 50 },
            {
                field: "full_name",
                headerName: "Họ tên",
                width: 150,
                renderCell: RenderCellExpand,
            },
            { field: "phone", headerName: "SĐT", width: 120 },
            {
                field: "email",
                headerName: "Email",
                width: 300,
                renderCell: RenderCellExpand,
            },
            {
                field: "note",
                headerName: "Ghi chú",
                width: 150,
                renderCell: RenderCellExpand,
            },
            {
                field: "subject",
                headerName: "Chủ đề",
                width: 150,
                renderCell: RenderCellExpand,
            },
            {
                field: "createdAt",
                headerName: "Ngày gửi",
                type: "date",
                width: 100,
                valueFormatter: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    const valueFormatted = new Date(
                        params.value
                    ).toLocaleDateString("en-GB");
                    return valueFormatted;
                },
            },
            {
                field: "isContact",
                headerName: "Trạng thái",
                width: 120,
                type: "boolean",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    const valueFormatted = params.value
                        ? "Đã liên hệ"
                        : "Chưa liên hệ";
                    return valueFormatted;
                },
            },
            {
                field: "actions",
                type: "actions",
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={<CheckCircleIcon />}
                        label="Chuyển trạng thái"
                        disabled={params.row.isContact}
                        onClick={(e) => handleChange(e, params.id)}
                        title="Đánh dấu đã liên hệ"
                    />,
                ],
            },
        ],
        [handleChange]
    );

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div style={{ height: 500, width: "100%" }}>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <DataGrid
                    rows={data}
                    columns={columns}
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
