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
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import AddCourse from "./AddCourse";
import ManagerPracticalContent from "./components/ManagerPracticalContent/ManagerPracticalContent";
import ManagerPurposeOfCourse from "./components/ManagerPurposeOfCourse/ManagerPurposeOfCourse";
import ManagerCourseFormat from "./components/ManagerCourseFormat/ManagerCourseFormat";
import courseApi from "api/Course/courseApi";

import { formatterVND } from "utils";

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
            <GridToolbarExport />
            <AddCourse open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
};

function ManagerTeacherDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = useState({});

    const [managerPracticalContent, setManagerPracticalContent] = useState({
        open: false,
        id: null,
        name: "",
    });

    const [managerPurposeOfCourse, setManagerPurposeOfCourse] = useState({
        open: false,
        id: null,
        name: "",
    });

    const [managerCourseFormat, setManagerCourseFormat] = useState({
        open: false,
        id: null,
        name: "",
    });

    const getData = useCallback(async () => {
        const response = await courseApi.getAllAdmin();
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
        (id) => async () => {
            const response = await courseApi.deleteCourse({ id: id });
            if (response.status === 200) {
                showNoti("Xóa thành công", "success");
                getData();
            } else {
                showNoti("Lỗi: không xóa được khóa học", "error");
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
        const { id, ...data } = newRow;

        const response = await courseApi.editCourse({ id, data });
        if (response.status === 200) {
            showNoti("Cập nhật dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không cập nhật được dữ liệu", "error");
        }
        getData();
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên khóa học",
                width: 180,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "price",
                headerName: "Giá",
                width: 100,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return formatterVND.format(params.value);
                },
                editable: true,
            },
            {
                field: "student_number",
                headerName: "Số lượng học viên",
                width: 140,
                type: "number",
                editable: true,
            },
            {
                field: "content",
                headerName: "Nội dung",
                type: "number",
                width: 100,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.row.typeOfContentId === 1
                            ? "buổi"
                            : params.row.typeOfContentId === 2
                            ? "chuyên đề"
                            : "";
                    return params.value + " " + valueFormatted;
                },
                editable: true,
            },
            {
                field: "time",
                headerName: "Thời lượng",
                type: "number",
                width: 140,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.row.typeOfContentId === 1
                            ? "giờ/buổi"
                            : params.row.typeOfContentId === 2
                            ? "giờ/chuyên đề"
                            : "";
                    return params.value + " " + valueFormatted;
                },
                editable: true,
            },
            {
                field: "typeOfContentId",
                headerName: "Loại",
                width: 100,
                type: "singleSelect",
                valueOptions: [
                    { value: 1, label: "Khóa học" },
                    { value: 2, label: "Chuyên đề" },
                ],
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.value === 1
                            ? "Khóa học"
                            : params.value === 2
                            ? "Chuyên đề"
                            : "";
                    return valueFormatted;
                },
                editable: true,
            },
            {
                field: "other_info",
                headerName: "Thông tin khác",
                width: 200,
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
                            icon={<HistoryEduIcon />}
                            label={"Nội dung thực hành"}
                            onClick={(e) =>
                                setManagerPracticalContent({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"Quản lý nội dung thực hành"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<AssignmentTurnedInIcon />}
                            label={"Mục tiêu khóa học"}
                            onClick={(e) =>
                                setManagerPurposeOfCourse({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"QUản lý mục tiêu khóa học"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<TypeSpecimenIcon />}
                            label="Hình thức"
                            onClick={(e) =>
                                setManagerCourseFormat({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title="Quản lý hình thức khóa học"
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
            showNoti("Tải dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không tải được dữ liệu", "error");
        }
    };

    return (
        <>
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
                                    toolbar: { getData, handleRefresh },
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
                        <ManagerPracticalContent
                            managerPracticalContent={managerPracticalContent}
                            setManagerPracticalContent={
                                setManagerPracticalContent
                            }
                        />
                        <ManagerPurposeOfCourse
                            managerPurposeOfCourse={managerPurposeOfCourse}
                            setManagerPurposeOfCourse={
                                setManagerPurposeOfCourse
                            }
                        />
                        <ManagerCourseFormat
                            managerCourseFormat={managerCourseFormat}
                            setManagerCourseFormat={setManagerCourseFormat}
                        />
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerTeacherDG);
