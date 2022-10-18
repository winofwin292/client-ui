import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridRowModes,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
} from "@mui/x-data-grid";

import { randomId } from "@mui/x-data-grid-generator";

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

import { createTheme, ThemeProvider } from "@mui/material/styles";
import userApi from "api/Users/useApi";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";

import { useSnackbar } from "notistack";

const theme = createTheme();

const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { setData, setRowModesModel } = props;

    const handleClick = () => {
        const id = randomId();
        setData((oldRows) => [
            ...oldRows,
            {
                id: id,
                username: "",
                first_name: "",
                last_name: "",
                sex: true,
                dob: "",
                address: "",
                email: "",
                phone: "",
                disabled: false,
            },
        ]);
        setRowModesModel((oldModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "first_name" },
        }));
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Thêm mới
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    setRowModesModel: PropTypes.func.isRequired,
    setData: PropTypes.func.isRequired,
};

function ManagerStaffDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = React.useState({});

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

    const handleDeleteClick = useCallback(
        (id) => () => {
            setData(data.filter((row) => row.id !== id));
        },
        [data]
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

    const processRowUpdate = (newRow) => {
        const updatedRow = { ...newRow, isNew: false };
        setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "first_name",
                headerName: "Họ",
                width: 100,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "last_name",
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
            },
            {
                field: "phone",
                headerName: "Số điện thoại",
                width: 120,
                renderCell: RenderCellExpand,
                editable: true,
                preProcessEditCellProps: (params) => {
                    const hasError = params.props.value.length > 10;
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
                headerName: "Actions",
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
                                params.disabled ? (
                                    <LockOpenIcon />
                                ) : (
                                    <LockIcon />
                                )
                            }
                            label={params.disabled ? "Mở khóa" : "Khóa"}
                            // onClick={(e) => handleChange(e, params)}
                            title={params.disabled ? "Mở khóa" : "Khóa"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<LockResetIcon />}
                            label="Đặt lại mật khẩu"
                            // onClick={(e) => handleChange(e, params.id)}
                            title="Đặt lại mật khẩu"
                            showInMenu
                        />,
                    ];
                },
            },
        ],
        [
            handleCancelClick,
            handleDeleteClick,
            handleEditClick,
            handleSaveClick,
            rowModesModel,
        ]
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
                                // components={{ Toolbar: GridToolbar }}
                                components={{
                                    Toolbar: EditToolbar,
                                }}
                                componentsProps={{
                                    toolbar: { setData, setRowModesModel },
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
                            />
                        </ThemeProvider>
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerStaffDG);
