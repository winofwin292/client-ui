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
import OrderDetail from "./components/OrderDetail/OrderDetail";
import ChangeState from "./components/ChangeState/ChangeState";
import orderApi from "api/Order/orderApi";

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
    handleRefresh: PropTypes.func.isRequired,
};

function ManagerOrderDG() {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [orderDetail, setOrderDetail] = useState({
        open: false,
        id: null,
    });

    const [orderStatus, setOrderStatus] = useState({
        open: false,
        id: null,
        orderStatusId: "",
        info: "",
    });

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
                field: "DeliveryMethods",
                headerName: "Đơn vị vận chuyển",
                width: 150,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    return params.value.name;
                },
            },

            {
                field: "OrderStatus",
                headerName: "Trạng thái",
                width: 100,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    return params.value.name;
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
                            onClick={(e) =>
                                setOrderDetail({
                                    open: true,
                                    id: params.id,
                                })
                            }
                            title={"Chi tiết đơn hàng"}
                            showInMenu
                        />,
                        <GridActionsCellItem
                            icon={<ShoppingCartCheckoutIcon />}
                            label={"Chuyển trạng thái"}
                            onClick={(e) =>
                                setOrderStatus({
                                    open: true,
                                    id: params.id,
                                    orderStatusId: parseInt(
                                        params.row.OrderStatus.id
                                    ),
                                    info:
                                        params.row.last_name +
                                        " " +
                                        params.row.first_name +
                                        " - " +
                                        params.row.phone,
                                })
                            }
                            title={"Chuyển trạng thái đơn hàng"}
                            showInMenu
                        />,
                    ];
                },
            },
        ],
        []
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
                                    toolbar: { handleRefresh },
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
                        <OrderDetail
                            orderDetail={orderDetail}
                            setOrderDetail={setOrderDetail}
                        />
                        <ChangeState
                            orderStatus={orderStatus}
                            setOrderStatus={setOrderStatus}
                            getData={getData}
                        />
                    </div>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerOrderDG);
