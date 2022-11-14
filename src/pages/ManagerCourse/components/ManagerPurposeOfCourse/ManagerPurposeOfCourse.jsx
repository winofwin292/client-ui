import React, { memo, useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";

import { RenderCellExpand } from "components/common/RenderCellExpand";

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

import purposeOfCourseApi from "api/PurposeOfCourse/purposeOfCourseApi";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import AddPurposeOfCourse from "./AddPurposeOfCourse";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { getData, handleRefresh } = props;
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
            <AddPurposeOfCourse
                open={open}
                setOpen={setOpen}
                getData={getData}
                courseId={props.courseId}
            />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    handleRefresh: PropTypes.func.isRequired,
    getData: PropTypes.func.isRequired,
    // courseId: PropTypes.number.isRequired,
};

function ManagerPurposeOfCourse(props) {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [rowModesModel, setRowModesModel] = useState({});

    const getData = useCallback(async () => {
        const response = await purposeOfCourseApi.getByCourseId({
            courseId: props.managerPurposeOfCourse.id,
        });
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, [props.managerPurposeOfCourse.id]);

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
        (id) => async () => {
            const response = await purposeOfCourseApi.delete({ id: id });
            if (response.status === 200) {
                showNoti("Xóa thành công", "success");
                getData();
            } else {
                showNoti("Lỗi: không xóa được tài khoản", "error");
            }
            // setData(data.filter((row) => row.id !== id));
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
        const updatedRow = {
            ...newRow,
            isNew: false,
        };

        const response = await purposeOfCourseApi.edit({
            id: newRow.id,
            content: newRow.content,
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
                field: "content",
                headerName: "Nội dung thực hành",
                width: 600,
                renderCell: RenderCellExpand,
                editable: true,
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

    const handleCloseManager = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setManagerPurposeOfCourse({
            open: false,
            id: "",
            name: "",
        });
    };

    return (
        <Dialog
            open={props.managerPurposeOfCourse.open}
            onClose={handleCloseManager}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Gán khóa học"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Đang quản trị mục tiêu của khóa học:{" "}
                    {props.managerPurposeOfCourse.name}
                </DialogContentText>
                <div style={{ height: 450, width: "100%" }}>
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
                                toolbar: {
                                    getData,
                                    handleRefresh,
                                    courseId: props.managerPurposeOfCourse.id,
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
                            editMode="row"
                            density="compact"
                        />
                    </ThemeProvider>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseManager} autoFocus>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default memo(ManagerPurposeOfCourse);
