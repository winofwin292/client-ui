import React, {
    memo,
    useMemo,
    useCallback,
    useState,
    useEffect,
    Suspense,
    lazy,
} from "react";
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
import Loading from "components/common/Loading/Loading";

import { getObjectFromCookieValue } from "utils";

import reviewApi from "api/Review/reviewApi";

// import ConfirmDialog from "components/common/ConfirmDialog/ConfirmDialog";
// import ViewAvatar from "./ViewAvatar";
// import AddReview from "./AddReview";

const ConfirmDialog = lazy(() =>
    import("components/common/ConfirmDialog/ConfirmDialog")
);
const ViewAvatar = lazy(() => import("./ViewAvatar"));
const AddReview = lazy(() => import("./AddReview"));

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

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
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

    const handleDelete = async (data) => {
        const response = await reviewApi.delete({
            id: data.id,
            aws_key: data.aws_key,
        });
        if (response.status === 200) {
            showNoti("X??a th??nh c??ng", "success");
            getData();
        } else {
            showNoti("L???i: kh??ng x??a ???????c ????nh gi??", "error");
        }
    };

    const handleDeleteClick = useCallback(
        (id, aws_key) => async () => {
            setConfirmState({
                state: true,
                data: {
                    id: id,
                    aws_key: aws_key,
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
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        const { id, User, ...data } = newRow;

        const response = await reviewApi.edit({
            id,
            data,
            username: userData.username,
        });

        if (response.status === 200) {
            showNoti("C???p nh???t d??? li???u th??nh c??ng", "success");
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
                headerName: "T??n",
                width: 170,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "info",
                headerName: "Vai tr??/Ch???c v???",
                width: 160,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "content",
                headerName: "N???i dung ????nh gi??",
                width: 500,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "is_show",
                headerName: "Hi???n/???n",
                width: 80,
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
                field: "User",
                headerName: "C???p nh???t b???i",
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
                            label="Ch???nh s???a"
                            className="textPrimary"
                            onClick={handleEditClick(params.id)}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<DeleteIcon />}
                            label="X??a"
                            onClick={handleDeleteClick(
                                params.id,
                                params.row.aws_key
                            )}
                            color="inherit"
                        />,
                        <GridActionsCellItem
                            icon={<ImageSearchIcon />}
                            label="Xem ???nh"
                            onClick={(e) =>
                                setViewAvatar({
                                    open: true,
                                    url: params.row.image_url,
                                    name: params.row.name,
                                    id: params.id,
                                    key: params.row.aws_key,
                                })
                            }
                            title="Xem ???nh ?????i di???n"
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

    return (
        <Grid item xs={12}>
            <Card>
                <div style={{ height: 500, width: "100%" }}>
                    <Suspense fallback={<Loading />}>
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
                            getData={getData}
                        />
                        <ConfirmDialog
                            open={confirmState}
                            setOpen={setConfirmState}
                            confirmFunc={handleDelete}
                            title="X??c nh???n x??a?"
                            msg="X??c nh???n x??a ????nh gi???"
                        />
                    </Suspense>
                </div>
            </Card>
        </Grid>
    );
}

export default memo(ManagerReview);
