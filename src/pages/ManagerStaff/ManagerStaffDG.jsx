import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import validator from "validator";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridRowModes,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockResetIcon from "@mui/icons-material/LockReset";
import GetAppIcon from "@mui/icons-material/GetApp";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import { ConfirmDialog } from "components/common/ConfirmDialog";

import AddStaff from "./AddStaff";
import userApi from "api/Users/useApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { getData, handleRefresh, data } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleExportXlsx = () => {
        const filename =
            "nhan-vien-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "Họ và tên": item.last_name + " " + item.first_name,
                "Tên đăng nhập": item.username,
                "Giới tính": item.sex ? "Nam" : "Nữ",
                "Ngày sinh": new Date(item.dob).toLocaleDateString("en-GB"),
                "Địa chỉ": item.address,
                Email: item.email,
                "Số điện thoại": item.phone,
                "Trạng thái": item.disabled ? "Khóa" : "Hoạt động",
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, { dateNF: "dd/MM/yyyy" });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách nhân viên");
        XLSX.writeFile(wb, filename);
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
            >
                Làm mới dữ liệu
            </Button>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Thêm mới
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <Button
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleExportXlsx}
            >
                Xuất Excel
            </Button>
            <AddStaff open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

function ManagerStaffDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = useState({});

    const [newPassword, setNewPassword] = useState("");
    const [username, setUsername] = useState("");
    const [resultDialog, setResultDialog] = useState(false);
    const [resultCopy, setResultCopy] = useState("");

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
    });

    const getData = useCallback(async () => {
        const response = await userApi.getAllStaff();
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, []);

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

    const handleRowEditStart = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleRowEditStop = (params, event) => {
        event.defaultMuiPrevented = true;
    };

    const handleEditClick = useCallback(
        (id) => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.Edit },
            });
        },
        [rowModesModel]
    );

    const handleSaveClick = useCallback(
        (id) => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View },
            });
        },
        [rowModesModel]
    );

    const handleDelete = async (data) => {
        const response = await userApi.deleteUser({ id: data.id });
        if (response.status === 200) {
            showNoti("Xóa thành công", "success");
            getData();
        } else {
            showNoti("Lỗi: không xóa được tài khoản", "error");
        }
    };

    const handleDeleteClick = useCallback(
        (id) => async () => {
            setConfirmState({
                state: true,
                data: {
                    id: id,
                },
            });
        },
        []
    );

    const handleCancelClick = useCallback(
        (id) => () => {
            setRowModesModel({
                ...rowModesModel,
                [id]: { mode: GridRowModes.View, ignoreModifications: true },
            });

            const editedRow = data.find((row) => row.id === id);
            if (editedRow.isNew) {
                setData(data.filter((row) => row.id !== id));
            }
        },
        [data, rowModesModel]
    );

    const processRowUpdate = async (newRow) => {
        const updatedRow = { ...newRow, isNew: false };

        const data = {
            ...newRow,
            dob: new Date(newRow.dob.getTime() + 7 * 3600000).toISOString(),
        };

        const response = await userApi.editUserInfo(data);
        if (response.status === 200) {
            showNoti("Cập nhật dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không cập nhật được dữ liệu", "error");
        }
        // setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        getData();
        return updatedRow;
    };

    const handleResetPass = useCallback(
        async (e, params) => {
            const response = await userApi.resetPassword({ id: params.id });
            if (response.status === 200) {
                setUsername(params.row.username);
                setNewPassword(response.data.newPassword);
                setResultDialog(true);
            } else {
                showNoti(response.data, "error");
            }
        },
        [showNoti]
    );

    const handleCloseResult = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setUsername("");
        setNewPassword("");
        setResultCopy("");
        setResultDialog(false);
    };

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(
                "username: " + username + " - password: " + newPassword
            );
            setResultCopy("Đã copy nội dung");
        } catch (err) {
            setResultCopy("Lỗi, không copy được nội dung");
        }
    }, [newPassword, username]);

    const handleChangeState = useCallback(
        async (e, params) => {
            const response = await userApi.changeState({
                id: params.id,
                state: !params.row.disabled,
            });
            if (response.status === 200) {
                showNoti("Chuyển trạng thái thành công", "success");
                getData();
            } else {
                showNoti(
                    "Lỗi: không chuyển được trạng thái của tài khoản",
                    "error"
                );
            }
        },
        [getData, showNoti]
    );

    const columns = useMemo(
        () => [
            {
                field: "last_name",
                headerName: "Họ",
                width: 100,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "first_name",
                headerName: "Tên",
                width: 100,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "sex",
                headerName: "Giới tính",
                width: 80,
                type: "boolean",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    const valueFormatted = params.value ? "Nam" : "Nữ";
                    return valueFormatted;
                },
                editable: true,
            },
            {
                field: "dob",
                headerName: "Ngày sinh",
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
                editable: true,
            },
            {
                field: "address",
                headerName: "Địa chỉ",
                width: 240,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "email",
                headerName: "Email",
                width: 200,
                renderCell: RenderCellExpand,
                editable: true,
                preProcessEditCellProps: (params) => {
                    const hasError = !validator.isEmail(params.props.value);
                    return { ...params.props, error: hasError };
                },
            },
            {
                field: "phone",
                headerName: "Số điện thoại",
                width: 120,
                renderCell: RenderCellExpand,
                editable: true,
                preProcessEditCellProps: (params) => {
                    const hasError = !validator.isMobilePhone(
                        params.props.value,
                        "vi-VN"
                    );
                    return { ...params.props, error: hasError };
                },
            },
            {
                field: "disabled",
                headerName: "Trạng thái",
                width: 120,
                type: "boolean",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = params.value ? "Khóa" : "Hoạt động";
                    return valueFormatted;
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Công cụ",
                width: 100,
                cellClassName: "actions",
                getActions: (params) => {
                    const isInEditMode =
                        rowModesModel[params.id]?.mode === GridRowModes.Edit;

                    if (isInEditMode) {
                        return [
                            <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="Lưu"
                                onClick={handleSaveClick(params.id)}
                            />,
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="Hủy"
                                className="textPrimary"
                                onClick={handleCancelClick(params.id)}
                                color="inherit"
                            />,
                        ];
                    }

                    return [
                        <GridActionsCellItem
                            icon={<EditIcon />}
                            label="Edit"
                            className="textPrimary"
                            onClick={handleEditClick(params.id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Delete"
                            onClick={handleDeleteClick(params.id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={
                                params.row.disabled ? (
                                    <LockOpenIcon />
                                ) : (
                                    <LockIcon />
                                )
                            }
                            label={params.row.disabled ? "Mở khóa" : "Khóa"}
                            onClick={(e) => handleChangeState(e, params)}
                            title={params.row.disabled ? "Mở khóa" : "Khóa"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<LockResetIcon />}
                            label="Đặt lại mật khẩu"
                            onClick={(e) => handleResetPass(e, params)}
                            title="Đặt lại mật khẩu"
                            showInMenu
                        />,
                    ];
                },
            },
        ],
        [
            handleCancelClick,
            handleChangeState,
            handleDeleteClick,
            handleEditClick,
            handleResetPass,
            handleSaveClick,
            rowModesModel,
        ]
    );

    useEffect(() => {
        getData();
    }, [getData]);

    const handleRefresh = () => {
        if (getData()) {
            showNoti("Tải dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không tải được dữ liệu", "error");
        }
    };

    return (
        <>
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
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={(newModel) =>
                                    setRowModesModel(newModel)
                                }
                                onRowEditStart={handleRowEditStart}
                                onRowEditStop={handleRowEditStop}
                                processRowUpdate={processRowUpdate}
                                experimentalFeatures={{ newEditingApi: true }}
                                components={{
                                    Toolbar: EditToolbar,
                                }}
                                componentsProps={{
                                    toolbar: { handleRefresh, data, getData },
                                }}
                                loading={loading}
                                initialState={{
                                    columns: {
                                        columnVisibilityModel: {
                                            id: false,
                                        },
                                    },
                                }}
                                editMode="row"
                                density="compact"
                            />
                        </div>
                        <Dialog
                            open={resultDialog}
                            onClose={handleCloseResult}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                        >
                            <DialogTitle id="alert-dialog-title">
                                {"Đặt lại mật khẩu thành công"}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                    Tài khoản: {username}
                                </DialogContentText>
                                <DialogContentText id="alert-dialog-description">
                                    Mật khẩu mới: {newPassword}
                                </DialogContentText>
                                <Button onClick={handleCopy} autoFocus>
                                    Sao chép
                                </Button>
                                <DialogContentText id="alert-dialog-description">
                                    {resultCopy}
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleCloseResult} autoFocus>
                                    Đóng
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </ThemeProvider>
                    <ConfirmDialog
                        open={confirmState}
                        setOpen={setConfirmState}
                        confirmFunc={handleDelete}
                        title="Xác nhận xóa?"
                        msg="Xác nhận xóa nhân viên này?"
                    />
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerStaffDG);
