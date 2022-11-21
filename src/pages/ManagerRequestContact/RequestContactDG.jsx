import React, { memo, useState, useEffect, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/Undo";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { RenderCellExpand } from "components/common/RenderCellExpand";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { getObjectFromCookieValue } from "utils";

import requestContactApi from "api/RequestContact/requestContactApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { handleRefresh } = props;

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
            >
                Làm mới dữ liệu
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    handleRefresh: PropTypes.func.isRequired,
};

function RequestContactDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const showNoti = useCallback(
        (msg, type) => {
            enqueueSnackbar(msg, {
                variant: type,
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
        },
        [closeSnackbar, enqueueSnackbar]
    );

    const getData = useCallback(async () => {
        const response = await requestContactApi.getAll();
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
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
                showNoti(response.data, "success");
                getData();
            } else {
                showNoti(response.data, "error");
            }
        },
        [getData, showNoti]
    );

    const handleChange = useCallback(
        async (e, id) => {
            e.preventDefault();

            const userData = getObjectFromCookieValue("userData");
            if (!userData) {
                showNoti("Không lấy được thông tin người dùng", "error");
                return;
            }

            const data = {
                id: id,
                username: userData.username,
            };

            const response = await requestContactApi.changeStatus(data);
            if (response.status === 200) {
                enqueueSnackbar(response.data, {
                    variant: "success",
                    style: {
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
                showNoti(response.data, "error");
            }
        },
        [closeSnackbar, enqueueSnackbar, getData, handleCancel, showNoti]
    );

    const columns = useMemo(
        () => [
            {
                field: "full_name",
                headerName: "Họ tên",
                width: 150,
                renderCell: RenderCellExpand,
            },
            { field: "phone", headerName: "SĐT", width: 110 },
            {
                field: "email",
                headerName: "Email",
                width: 300,
                renderCell: RenderCellExpand,
            },
            {
                field: "note",
                headerName: "Ghi chú",
                width: 140,
                renderCell: RenderCellExpand,
            },
            {
                field: "subject",
                headerName: "Chủ đề",
                width: 140,
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
                field: "User",
                headerName: "Cập nhật bởi",
                width: 120,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    return params.value.username;
                },
                editable: false,
            },
            {
                field: "actions",
                type: "actions",
                width: 40,
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

    const handleRefresh = () => {
        if (getData()) {
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
                            experimentalFeatures={{ newEditingApi: true }}
                            components={{
                                Toolbar: EditToolbar,
                            }}
                            componentsProps={{
                                toolbar: { handleRefresh },
                            }}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
                            }}
                            loading={loading}
                            density="compact"
                        />
                    </div>
                </ThemeProvider>
            </Card>
        </Grid>
    );
}

export default memo(RequestContactDG);
