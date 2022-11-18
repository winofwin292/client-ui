import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import * as XLSX from "xlsx";
import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
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
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PrintIcon from "@mui/icons-material/Print";
import GetAppIcon from "@mui/icons-material/GetApp";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import { RenderCellExpand } from "components/common/RenderCellExpand";
import OrderDetail from "./components/OrderDetail/OrderDetail";
import TransferToGHN from "./components/TransferToGHN/TransferToGHN";
import PrintOrder from "./components/PrintOrder/PrintOrder";
import orderApi from "api/Order/orderApi";

import { formatterVND } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { handleRefresh, data } = props;

    const handleExportXlsx = () => {
        console.log(data);
        const filename =
            "don-hang-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "Họ và tên": item.last_name + " " + item.first_name,
                "Địa chỉ": item.full_address,
                Email: item.email,
                "Số điện thoại": item.phone,
                "Đơn giá": item.total,
                "Trạng thái": item.OrderStatus.name,
                "Ngày giao hàng dự kiến": new Date(
                    item.expected_delivery_time
                ).toLocaleDateString("en-GB"),
                "Mã GHN": item.order_code,
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, { dateNF: "dd/MM/yyyy" });
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");
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
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    handleRefresh: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
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

    const [transferStatus, setTransferStatus] = useState({
        open: false,
        id: null,
        districtId: "",
        wardCode: "",
    });

    const [printState, setPrintState] = useState({
        open: false,
        orderCode: "",
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

    const handleChangeState = useCallback(
        async (e, id, state) => {
            // e.preventDefault();

            const response = await orderApi.changeStatus({
                orderId: id,
                orderStatusId: state,
            });

            if (response.status === 200) {
                getData();
                showNoti("Cập nhật thành công", "success");
            } else {
                showNoti(response.data, "error");
            }
        },
        [getData, showNoti]
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
                field: "full_address",
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
                field: "expected_delivery_time",
                headerName: "Ngày giao hàng dự kiến",
                width: 150,
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    return new Date(params.value).toLocaleDateString("en-GB");
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
                            label={"Xác nhận đơn hàng"}
                            onClick={(e) => handleChangeState(e, params.id, 2)}
                            title={"Xác nhận đơn hàng"}
                            showInMenu
                            sx={
                                params.row.OrderStatus.id === 1
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        />,
                        <GridActionsCellItem
                            icon={<ShoppingCartCheckoutIcon />}
                            label={"Chuyển đơn hàng cho vận chuyển"}
                            onClick={(e) =>
                                setTransferStatus({
                                    open: true,
                                    id: params.id,
                                    districtId: params.row.district_id,
                                    wardCode: params.row.ward_code,
                                })
                            }
                            title={"Chuyển đơn hàng cho vận chuyển"}
                            showInMenu
                            sx={
                                params.row.OrderStatus.id === 2
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        />,
                        <GridActionsCellItem
                            icon={<PrintIcon />}
                            label={"In vận đơn"}
                            onClick={(e) =>
                                setPrintState({
                                    open: true,
                                    orderCode: params.row.order_code,
                                })
                            }
                            title={"In phiếu của đơn vị vận chuyển"}
                            showInMenu
                            sx={
                                params.row.OrderStatus.id === 3
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        />,
                        <GridActionsCellItem
                            icon={<PriceCheckIcon />}
                            label={"Đánh dấu đã hoàn thành"}
                            onClick={(e) => handleChangeState(e, params.id, 4)}
                            title={"Đánh dấu đã hoàn thành"}
                            showInMenu
                            sx={
                                params.row.OrderStatus.id === 3
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        />,
                        <GridActionsCellItem
                            icon={<RemoveShoppingCartIcon />}
                            label={"Hủy đơn hàng"}
                            onClick={(e) => handleChangeState(e, params.id, 5)}
                            title={"Hủy đơn hàng"}
                            showInMenu
                            sx={
                                params.row.OrderStatus.id === 1 ||
                                params.row.OrderStatus.id === 2
                                    ? { display: "block" }
                                    : { display: "none" }
                            }
                        />,
                    ];
                },
            },
        ],
        [handleChangeState]
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
                    <ThemeProvider theme={darkMode ? themeD : theme}>
                        <div style={{ height: 550, width: "100%" }}>
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
                                    toolbar: { handleRefresh, data },
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
                            <OrderDetail
                                orderDetail={orderDetail}
                                setOrderDetail={setOrderDetail}
                            />
                            <TransferToGHN
                                transferStatus={transferStatus}
                                setTransferStatus={setTransferStatus}
                                getData={getData}
                            />
                            <PrintOrder
                                printState={printState}
                                setPrintState={setPrintState}
                            />
                        </div>
                    </ThemeProvider>
                </Card>
            </Grid>
        </>
    );
}

export default memo(ManagerOrderDG);
