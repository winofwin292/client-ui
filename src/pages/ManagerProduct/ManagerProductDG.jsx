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
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import GetAppIcon from "@mui/icons-material/GetApp";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import { ConfirmDialog } from "components/common/ConfirmDialog";

import AddProduct from "./AddProduct";
import ManagerProductImage from "./components/ManagerProductImage/ManagerProductImage";

import productApi from "api/Product/productApi";
import categoryApi from "api/Category/categoryApi";

import { formatterVND, getObjectFromCookieValue } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { getData, handleRefresh, data, categories } = props;
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleExportXlsx = () => {
        const filename =
            "san-pham-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "T??n s???n ph???m": item.name,
                "Gi?? s???n ph???m": item.price,
                "T??c gi???": item.author,
                "N??m xu???t b???n": item.publishing_year,
                "S??? l?????ng kho": item.in_stock <= 0 ? "H???t h??ng" : item.in_stock,
                "M?? t???": item.description,
                "Kh???i l?????ng": item.weight + "g",
                "Chi???u cao": item.length + "cm",
                "Chi???u r???ng": item.width + "cm",
                "????? d??y": item.height + "cm",
                Lo???i: categories.find((cate) => cate.value === item.categoryId)
                    ?.label,
                "Hi???n/???n": item.is_show ? "Hi???n" : "???n",
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, { dateNF: "dd/MM/yyyy" });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh s??ch s???n ph???m");
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
            <AddProduct open={open} setOpen={setOpen} getData={getData} />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
    categories: PropTypes.array.isRequired,
};

function ManagerProductDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [rowModesModel, setRowModesModel] = useState({});

    const [managerProductImage, setManagerProductImage] = useState({
        open: false,
        id: null,
        name: "",
    });

    const [confirmState, setConfirmState] = useState({
        state: false,
        data: {},
    });

    const getData = useCallback(async () => {
        const response = await productApi.getAllAdmin();
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
        const response = await productApi.delete({ id: data.id });
        if (response.status === 200) {
            showNoti("X??a th??nh c??ng", "success");
            getData();
        } else {
            showNoti("L???i: kh??ng x??a ???????c s???n ph???m", "error");
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

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        const { id, User, ...data } = newRow;

        const response = await productApi.edit({
            id,
            data,
            username: userData.username,
        });
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
                headerName: "T??n s???n ph???m",
                width: 150,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "price",
                headerName: "Gi??",
                width: 80,
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
                field: "author",
                headerName: "T??c gi???",
                width: 130,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "publishing_year",
                headerName: "N??m XB",
                width: 70,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return params.value.toString();
                },
                editable: true,
            },
            {
                field: "in_stock",
                headerName: "Kho",
                width: 30,
                type: "number",
                editable: true,
            },
            {
                field: "description",
                headerName: "M?? t???",
                width: 200,
                renderCell: RenderCellExpand,
                editable: true,
            },
            {
                field: "weight",
                headerName: "Kh???i l?????ng",
                width: 80,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return params.value.toString() + "g";
                },
                editable: true,
            },
            {
                field: "length",
                headerName: "Cao",
                width: 60,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return params.value.toString() + "cm";
                },
                editable: true,
            },
            {
                field: "width",
                headerName: "R???ng",
                width: 60,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return params.value.toString() + "cm";
                },
                editable: true,
            },
            {
                field: "height",
                headerName: "D??y",
                width: 40,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return params.value.toString() + "cm";
                },
                editable: true,
            },
            {
                field: "categoryId",
                headerName: "Lo???i",
                width: 140,
                type: "singleSelect",
                valueOptions: categories,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = categories.find(
                        (item) => item.value === params.value
                    );
                    return valueFormatted ? valueFormatted.label : "";
                },
                editable: true,
            },
            {
                field: "is_show",
                headerName: "Hi???n/???n",
                width: 70,
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
                            label={"H??nh ???nh s???n ph???m"}
                            onClick={(e) =>
                                setManagerProductImage({
                                    open: true,
                                    id: params.id,
                                    name: params.row.name,
                                })
                            }
                            title={"Qu???n l?? h??nh ???nh s???n ph???m"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            label={
                                "Ch???nh s???a g???n ????y: " +
                                (params.row.User
                                    ? params.row.User.username
                                    : "")
                            }
                            title={
                                "Ch???nh s???a g???n ????y: " +
                                (params.row.User
                                    ? params.row.User.username
                                    : "")
                            }
                            showInMenu
                            disabled
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
            categories,
        ]
    );

    const getCategories = useCallback(async () => {
        const response = await categoryApi.getAllAdmin();
        let data = [];
        if (response.status === 200) {
            data = response.data.map((item) => ({
                value: item.id,
                label: item.name,
            }));
            setCategories(data);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

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
                                    toolbar: {
                                        getData,
                                        handleRefresh,
                                        data,
                                        categories,
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
                            <ManagerProductImage
                                managerProductImage={managerProductImage}
                                setManagerProductImage={setManagerProductImage}
                                getData={getData}
                            />
                        </div>
                    </ThemeProvider>
                    <ConfirmDialog
                        open={confirmState}
                        setOpen={setConfirmState}
                        confirmFunc={handleDelete}
                        title="X??c nh???n x??a?"
                        msg="X??c nh???n x??a s???n ph???m n??y?"
                    />
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerProductDG);
