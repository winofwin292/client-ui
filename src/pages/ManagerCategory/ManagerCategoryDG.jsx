import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
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
import GetAppIcon from "@mui/icons-material/GetApp";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import { ConfirmDialog } from "components/common/ConfirmDialog";

import { getObjectFromCookieValue } from "utils";

import AddCategory from "./AddCategory";
import categoryApi from "api/Category/categoryApi";

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
        const filename = "loai-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "Tên loại": item.name,
                "Mã loại": item.code,
                "Mô tả": item.description,
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, { dateNF: "dd/MM/yyyy" });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách loại");
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
            <AddCategory open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

function ManagerCategoryDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = useState({});

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
    });

    const getData = useCallback(async () => {
        const response = await categoryApi.getAllAdmin();
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
        const response = await categoryApi.delete({ id: data.id });
        if (response.status === 200) {
            showNoti("Xóa thành công", "success");
            getData();
        } else {
            showNoti("Lỗi: không xóa được loại hàng", "error");
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

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Không lấy được thông tin người dùng", "error");
            return;
        }

        const { id, User, ...data } = newRow;

        const response = await categoryApi.edit({
            id,
            data,
            username: userData.username,
        });
        if (response.status === 200) {
            showNoti("Cập nhật dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không cập nhật được dữ liệu", "error");
        }
        // setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        getData();
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên loại",
                width: 250,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "code",
                headerName: "Mã loại",
                width: 250,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "description",
                headerName: "Mô tả",
                width: 500,
                renderCell: RenderCellExpand,
                editable: true,
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
            showNoti("Tải dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không tải được dữ liệu", "error");
        }
    };

    return (
        <Grid item xs={12}>
            <Card>
                <div style={{ height: 550, width: "100%" }}>
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
                            components={{
                                Toolbar: EditToolbar,
                            }}
                            componentsProps={{
                                toolbar: { handleRefresh, getData, data },
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
                    </ThemeProvider>
                    <ConfirmDialog
                        open={confirmState}
                        setOpen={setConfirmState}
                        confirmFunc={handleDelete}
                        title="Xác nhận xóa?"
                        msg="Xác nhận xóa loại hàng này?"
                    />
                </div>
            </Card>
        </Grid>
    );
}

export default memo(ManagerCategoryDG);
