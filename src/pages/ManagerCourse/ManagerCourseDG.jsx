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
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import TypeSpecimenIcon from "@mui/icons-material/TypeSpecimen";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import GetAppIcon from "@mui/icons-material/GetApp";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import { ConfirmDialog } from "components/common/ConfirmDialog";

import AddCourse from "./AddCourse";
import ManagerPracticalContent from "./components/ManagerPracticalContent/ManagerPracticalContent";
import ManagerPurposeOfCourse from "./components/ManagerPurposeOfCourse/ManagerPurposeOfCourse";
import ManagerCourseFormat from "./components/ManagerCourseFormat/ManagerCourseFormat";
import ManagerCourseImage from "./components/ManagerCourseImage/ManagerCourseImage";

import courseApi from "api/Course/courseApi";

import { formatterVND } from "utils";

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
            "khoa-hoc-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "T??n kh??a h???c": item.name,
                "Gi?? kh??a h???c": item.price,
                "S??? l?????ng h???c vi??n": item.student_number,
                "N???i dung":
                    item.content +
                    " " +
                    (item.typeOfContentId === 1
                        ? "bu???i"
                        : item.typeOfContentId === 2
                        ? "chuy??n ?????"
                        : ""),
                "Th???i l?????ng":
                    item.time +
                    " gi???/" +
                    (item.typeOfContentId === 1
                        ? "bu???i"
                        : item.typeOfContentId === 2
                        ? "chuy??n ?????"
                        : ""),
                Lo???i:
                    item.typeOfContentId === 1
                        ? "Kh??a h???c"
                        : item.typeOfContentId === 2
                        ? "Chuy??n ?????"
                        : "",
                "Th??ng tin kh??c": item.other_info,
                "Hi???n/???n": item.is_show ? "Hi???n" : "???n",
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, { dateNF: "dd/MM/yyyy" });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh s??ch kh??a h???c");
        XLSX.writeFile(wb, filename);
    };

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
            >
                L??m m???i d??? li???u
            </Button>
            <Button
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleClick}
            >
                Th??m m???i
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <Button
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleExportXlsx}
            >
                Xu???t Excel
            </Button>
            <AddCourse open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
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

    const [managerCourseImage, setManagerCourseImage] = useState({
        open: false,
        id: null,
        name: "",
    });

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
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

    const handleDelete = async (data) => {
        const response = await courseApi.deleteCourse({ id: data.id });
        if (response.status === 200) {
            showNoti("X??a th??nh c??ng", "success");
            getData();
        } else {
            showNoti("L???i: kh??ng x??a ???????c kh??a h???c", "error");
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
        const updatedRow = {
            ...newRow,
            isNew: false,
        };
        const { id, ...data } = newRow;

        const response = await courseApi.editCourse({ id, data });
        if (response.status === 200) {
            showNoti("C???p nh???t d??? li???u th??nh c??ng", "success");
        } else {
            showNoti("L???i: kh??ng c???p nh???t ???????c d??? li???u", "error");
        }
        getData();
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "T??n kh??a h???c",
                width: 180,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "price",
                headerName: "Gi??",
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
                headerName: "S??? l?????ng h???c vi??n",
                width: 140,
                type: "number",
                editable: true,
            },
            {
                field: "content",
                headerName: "N???i dung",
                type: "number",
                width: 100,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.row.typeOfContentId === 1
                            ? "bu???i"
                            : params.row.typeOfContentId === 2
                            ? "chuy??n ?????"
                            : "";
                    return params.value + " " + valueFormatted;
                },
                editable: true,
            },
            {
                field: "time",
                headerName: "Th???i l?????ng",
                type: "number",
                width: 140,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.row.typeOfContentId === 1
                            ? "gi???/bu???i"
                            : params.row.typeOfContentId === 2
                            ? "gi???/chuy??n ?????"
                            : "";
                    return params.value + " " + valueFormatted;
                },
                editable: true,
            },
            {
                field: "typeOfContentId",
                headerName: "Lo???i",
                width: 100,
                type: "singleSelect",
                valueOptions: [
                    { value: 1, label: "Kh??a h???c" },
                    { value: 2, label: "Chuy??n ?????" },
                ],
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted =
                        params.value === 1
                            ? "Kh??a h???c"
                            : params.value === 2
                            ? "Chuy??n ?????"
                            : "";
                    return valueFormatted;
                },
                editable: true,
            },
            {
                field: "other_info",
                headerName: "Th??ng tin kh??c",
                width: 200,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "is_show",
                headerName: "Hi???n/???n",
                width: 100,
                type: "singleSelect",
                valueOptions: [
                    { value: true, label: "Hi???n" },
                    { value: false, label: "???n" },
                ],
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = params.value ? "Hi???n" : "???n";
                    return valueFormatted;
                },
                editable: true,
            },
            {
                field: "actions",
                type: "actions",
                headerName: "C??ng c???",
                width: 100,
                cellClassName: "actions",
                getActions: (params) => {
                    const isInEditMode =
                        rowModesModel[params.id]?.mode === GridRowModes.Edit;

                    if (isInEditMode) {
                        return [
                            <GridActionsCellItem
                                icon={<SaveIcon />}
                                label="L??u"
                                onClick={handleSaveClick(params.id)}
                            />,
                            <GridActionsCellItem
                                icon={<CancelIcon />}
                                label="H???y"
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
                            label={"N???i dung th???c h??nh"}
                            onClick={(e) =>
                                setManagerPracticalContent({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"Qu???n l?? n???i dung th???c h??nh"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<AssignmentTurnedInIcon />}
                            label={"M???c ti??u kh??a h???c"}
                            onClick={(e) =>
                                setManagerPurposeOfCourse({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"QU???n l?? m???c ti??u kh??a h???c"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<TypeSpecimenIcon />}
                            label="H??nh th???c"
                            onClick={(e) =>
                                setManagerCourseFormat({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title="Qu???n l?? h??nh th???c kh??a h???c"
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<HistoryEduIcon />}
                            label={"H??nh ???nh kh??a h???c"}
                            onClick={(e) =>
                                setManagerCourseImage({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"Qu???n l?? h??nh ???nh kh??a h???c"}
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
            showNoti("T???i d??? li???u th??nh c??ng", "success");
        } else {
            showNoti("L???i: kh??ng t???i ???????c d??? li???u", "error");
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
                                    toolbar: { getData, handleRefresh, data },
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
                            <ManagerPracticalContent
                                managerPracticalContent={
                                    managerPracticalContent
                                }
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
                            <ManagerCourseImage
                                managerCourseImage={managerCourseImage}
                                setManagerCourseImage={setManagerCourseImage}
                            />
                        </div>
                    </ThemeProvider>
                    <ConfirmDialog
                        open={confirmState}
                        setOpen={setConfirmState}
                        confirmFunc={handleDelete}
                        title="X??c nh???n x??a?"
                        msg="X??c nh???n x??a kh??a h???c?"
                    />
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerTeacherDG);
