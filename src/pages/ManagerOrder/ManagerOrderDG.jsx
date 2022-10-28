import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
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

import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import orderApi from "api/Order/orderApi";
import deliveryMethodApi from "api/DeliveryMethod/deliveryMethodApi";
import orderStatusApi from "api/OrderStatus/orderStatusApi";

import { formatterVND } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { handleRefresh } = props;

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
            >
                Làm mới dữ liệu
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    getData: PropTypes.func.isRequired,
    handleRefresh: PropTypes.func.isRequired,
};

function ManagerOrderDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [orderStatus, setOrderStatus] = useState([]);

    const getData = useCallback(async () => {
        const response = await orderApi.getAllAdmin();
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, []);

    const getSubData = useCallback(async () => {
        const responseDelivery = await deliveryMethodApi.getAll();
        const responseOrderStatus = await orderStatusApi.getAll();
        if (
            responseDelivery.status === 200 &&
            responseOrderStatus.status === 200
        ) {
            setDeliveryMethods(responseDelivery.data);
            setOrderStatus(responseOrderStatus.data);
        }
    }, []);

    useEffect(() => {
        getSubData();
    }, [getSubData]);

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

    const columns = useMemo(
        () => [
            {
                field: "last_name",
                headerName: "Họ",
                width: 100,
                renderCell: RenderCellExpand,
            },
            {
                field: "first_name",
                headerName: "Tên",
                width: 100,
                renderCell: RenderCellExpand,
            },
            {
                field: "address",
                headerName: "Địa chỉ",
                width: 230,
                renderCell: RenderCellExpand,
            },
            {
                field: "phone",
                headerName: "Số điện thoại",
                width: 110,
                renderCell: RenderCellExpand,
            },
            {
                field: "email",
                headerName: "email",
                width: 250,
                renderCell: RenderCellExpand,
            },
            {
                field: "total",
                headerName: "Đơn giá",
                width: 90,
                type: "number",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }

                    return formatterVND.format(params.value);
                },
            },
            {
                field: "deliveryMethodsId",
                headerName: "Đơn vị vận chuyển",
                width: 150,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = deliveryMethods.find(
                        (item) => item.id === params.value
                    );
                    return valueFormatted ? valueFormatted.name : "";
                },
            },

            {
                field: "orderStatusId",
                headerName: "Trạng thái",
                width: 100,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    const valueFormatted = orderStatus.find(
                        (item) => item.id === params.value
                    );
                    return valueFormatted ? valueFormatted.name : "";
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Công cụ",
                width: 80,
                cellClassName: "actions",
                getActions: (params) => {
                    return [
                        <GridActionsCellItem
                            icon={<ShoppingCartIcon />}
                            label={"Chi tiết đơn hàng"}
                            // onClick={(e) =>
                            //     setManagerPracticalContent({
                            //         open: true,
                            //         id: params.id,
                            //         name: params.row.name,
                            //     })
                            // }
                            title={"Chi tiết đơn hàng"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<ShoppingCartCheckoutIcon />}
                            label={"Chuyển trạng thái"}
                            // onClick={(e) =>
                            //     setManagerPracticalContent({
                            //         open: true,
                            //         id: params.id,
                            //         name: params.row.name,
                            //     })
                            // }
                            title={"Chuyển trạng thái đơn hàng"}
                            showInMenu
                        />,
                    ];
                },
            },
        ],
        [deliveryMethods, orderStatus]
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
                                density="compact"
                            />
                        </ThemeProvider>
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerOrderDG);
