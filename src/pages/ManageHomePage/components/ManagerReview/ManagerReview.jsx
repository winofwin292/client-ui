import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridRowModes,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
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
import ImageSearchIcon from "@mui/icons-material/ImageSearch";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import ViewAvatar from "./ViewAvatar";
import AddReview from "./AddReview";
import reviewApi from "api/Review/reviewApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { handleRefresh, getData } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
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
            <GridToolbarExport />
            <AddReview open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    handleRefresh: PropTypes.func.isRequired,
};

function ManagerReview() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = useState({});

    const [viewAvatar, setViewAvatar] = useState({
        open: false,
        url: "",
        name: "",
        id: "",
        key: "",
    });

    const getData = useCallback(async () => {
        const response = await reviewApi.getAllAdmin();
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

    const handleDeleteClick = useCallback(
        (id, aws_key) => async () => {
            const response = await reviewApi.delete({
                id: id,
                aws_key: aws_key,
            });
            if (response.status === 200) {
                showNoti("Xóa thành công", "success");
                getData();
            } else {
                showNoti("Lỗi: không xóa được đánh giá", "error");
            }
        },
        [getData, showNoti]
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

        const { id, ...data } = newRow;

        const response = await reviewApi.edit({ id, data });
        if (response.status === 200) {
            showNoti("Cập nhật dữ liệu thành công", "success");
        } else {
            showNoti(response.data, "error");
        }

        getData();
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên",
                width: 200,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "info",
                headerName: "Vai trò/Chức vụ",
                width: 180,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "content",
                headerName: "Nội dung đánh giá",
                width: 550,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "is_show",
                headerName: "Hiện/ẩn",
                width: 100,
                type: "singleSelect",
                valueOptions: [
                    { value: true, label: "Hiện" },
                    { value: false, label: "Ẩn" },
                ],
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = params.value ? "Hiện" : "Ẩn";
                    return valueFormatted;
                },
                editable: true,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Công cụ",
                width: 150,
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
                            label="Chỉnh sửa"
                            className="textPrimary"
                            onClick={handleEditClick(params.id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="Xóa"
                            onClick={handleDeleteClick(
                                params.id,
                                params.row.aws_key
                            )}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<ImageSearchIcon />}
                            label="Xem ảnh"
                            onClick={(e) =>
                                setViewAvatar({
                                    open: true,
                                    url: params.row.image_url,
                                    name: params.row.name,
                                    id: params.id,
                                    key: params.row.aws_key,
                                })
                            }
                            title="Xem ảnh đại diện"
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
        <>
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
                                components={{
                                    Toolbar: EditToolbar,
                                }}
                                componentsProps={{
                                    toolbar: { handleRefresh, getData },
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
                        <ViewAvatar
                            viewAvatar={viewAvatar}
                            setViewAvatar={setViewAvatar}
                        />
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerReview);
