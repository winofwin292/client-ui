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

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import { ConfirmDialog } from "components/common/ConfirmDialog";

import AddPracticalContent from "./AddPracticalContent";

import practicalContentApi from "api/PracticalContent/practicalContentApi";

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
            <AddPracticalContent
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

function ManagerPracticalContent(props) {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [rowModesModel, setRowModesModel] = useState({});

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
    });

    const getData = useCallback(async () => {
        const response = await practicalContentApi.getByCourseId({
            courseId: props.managerPracticalContent.id,
        });
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, [props.managerPracticalContent.id]);

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
        const response = await practicalContentApi.delete({ id: data.id });
        if (response.status === 200) {
            showNoti("X??a th??nh c??ng", "success");
            getData();
        } else {
            showNoti("L???i: kh??ng x??a ???????c", "error");
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

        const response = await practicalContentApi.edit({
            id: newRow.id,
            content: newRow.content,
        });
        if (response.status === 200) {
            showNoti("C???p nh???t d??? li???u th??nh c??ng", "success");
        } else {
            showNoti("L???i: kh??ng c???p nh???t ???????c d??? li???u", "error");
        }
        // setData(data.map((row) => (row.id === newRow.id ? updatedRow : row)));
        getData();
        return updatedRow;
    };

    const columns = useMemo(
        () => [
            {
                field: "content",
                headerName: "N???i dung th???c h??nh",
                width: 600,
                renderCell: RenderCellExpand,
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

    const handleCloseManager = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setManagerPracticalContent({
            open: false,
            id: "",
            name: "",
        });
    };

    return (
        <Dialog
            open={props.managerPracticalContent.open}
            onClose={handleCloseManager}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">
                {"Qu???n l?? n???i dung th???c h??nh"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    ??ang qu???n tr??? n???i dung th???c h??nh c???a kh??a h???c:{" "}
                    {props.managerPracticalContent.name}
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
                                    courseId: props.managerPracticalContent.id,
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
                    <ConfirmDialog
                        open={confirmState}
                        setOpen={setConfirmState}
                        confirmFunc={handleDelete}
                        title="X??c nh???n x??a?"
                        msg="X??c nh???n x??a n???i dung n??y?"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseManager} autoFocus>
                    ????ng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default memo(ManagerPracticalContent);
