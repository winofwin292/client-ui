import React, { memo, useState, useCallback, useMemo, useEffect } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import { DataGrid, viVN } from "@mui/x-data-grid";

import { formatterVND } from "utils";

import orderApi from "api/Order/orderApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function OrderDetail(props) {
    const [orderItem, setOrderItem] = useState([]);
    const [orderInfo, setOrderInfo] = useState("");

    const [loading, setLoading] = useState(true);

    const [darkMode, setDarkMode] = useState(false);

    const getData = useCallback(async () => {
        const response = await orderApi.getById({
            orderId: props.orderDetail.id,
        });
        if (response.status === 200 && response.data !== null) {
            const { OrderItem, ...temp } = response.data;
            const items = OrderItem.map((item) => ({
                orderItemId: item.id,
                unit_price: item.unit_price,
                quantity: item.quantity,
                ...item.Product,
            }));
            const rows = [
                ...items,
                {
                    id: "SUBTOTAL",
                    label: "Tổng",
                    subtotal: formatterVND.format(parseInt(temp.sub_total)),
                },
                {
                    id: "TAX",
                    label: "Thuế",
                    taxRate: 10,
                    taxTotal: formatterVND.format(parseInt(temp.tax)),
                },
                {
                    id: "DELIVERY",
                    label: "Phí vận chuyển",
                    price: formatterVND.format(parseInt(temp.total_fee)),
                },
                {
                    id: "TOTAL",
                    label: "Thành tiền",
                    total: formatterVND.format(parseInt(temp.total)),
                },
            ];

            setOrderItem(rows);
            setOrderInfo(temp);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, [props.orderDetail.id]);

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên sách",
                width: 500,
                disableColumnMenu: true,
                sortable: false,
                colSpan: ({ row }) => {
                    if (
                        row.id === "SUBTOTAL" ||
                        row.id === "TOTAL" ||
                        row.id === "DELIVERY"
                    ) {
                        return 3;
                    }
                    if (row.id === "TAX") {
                        return 2;
                    }
                    return undefined;
                },
                valueGetter: ({ value, row }) => {
                    if (
                        row.id === "SUBTOTAL" ||
                        row.id === "TAX" ||
                        row.id === "TOTAL" ||
                        row.id === "DELIVERY"
                    ) {
                        return row.label;
                    }
                    return value;
                },
            },
            {
                field: "quantity",
                headerName: "Số lượng",
                width: 100,
                align: "right",
                headerAlign: "right",
                disableColumnMenu: true,
                sortable: false,
            },
            {
                field: "unit_price",
                headerName: "Đơn giá",
                width: 100,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => {
                    if (params.value == null) {
                        return "";
                    }
                    if (params.row.id === "TAX") {
                        return `${params.row.taxRate}%`;
                    }
                    return formatterVND.format(parseInt(params.value));
                },
                disableColumnMenu: true,
                sortable: false,
                valueGetter: ({ row, value }) => {
                    if (row.id === "TAX") {
                        return `${row.taxRate}%`;
                    }
                    return value;
                },
            },
            {
                field: "total",
                headerName: "Thành tiền",
                width: 100,
                align: "right",
                headerAlign: "right",
                renderCell: (params) => {
                    if (
                        params.row.id === "SUBTOTAL" ||
                        params.row.id === "TAX" ||
                        params.row.id === "TOTAL" ||
                        params.row.id === "DELIVERY"
                    )
                        return params.value;
                    return formatterVND.format(params.value);
                },
                disableColumnMenu: true,
                sortable: false,
                valueGetter: ({ row }) => {
                    if (row.id === "SUBTOTAL") {
                        return row.subtotal;
                    }
                    if (row.id === "TAX") {
                        return row.taxTotal;
                    }
                    if (row.id === "DELIVERY") {
                        return row.price;
                    }
                    if (row.id === "TOTAL") {
                        return row.total;
                    }
                    return parseInt(row.unit_price) * row.quantity;
                },
            },
        ],
        []
    );

    const getCellClassName = ({ row, field }) => {
        if (row.id === "SUBTOTAL" || row.id === "TOTAL" || row.id === "TAX") {
            if (field === "item") {
                return "bold";
            }
        }
        return "";
    };

    useEffect(() => {
        if (
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches
        ) {
            setDarkMode(true);
        }

        window
            .matchMedia("(prefers-color-scheme: dark)")
            .addEventListener("change", function (e) {
                setDarkMode((prev) => !prev);
            });
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleCloseManager = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOrderDetail({
            open: false,
            id: "",
        });
    };

    return (
        <ThemeProvider theme={darkMode ? themeD : theme}>
            <Dialog
                open={props.orderDetail.open}
                onClose={handleCloseManager}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                fullWidth
                maxWidth="md"
            >
                <style type="text/css" media="print">
                    {" @page { size: landscape; } "}
                </style>
                <DialogTitle id="alert-dialog-title">
                    {"Chi tiết đơn hàng"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <b>Thông tin đơn hàng:</b>
                    </DialogContentText>
                    {orderInfo ? (
                        <DialogContentText
                            id="alert-dialog-description"
                            sx={{ ml: 2 }}
                        >
                            - Họ tên:{" "}
                            {orderInfo.last_name + " " + orderInfo.first_name}
                            <br />- Điện thoại: {orderInfo.phone}
                            <br />- Email: {orderInfo.email}
                            <br />- Địa chỉ: {orderInfo.address},{" "}
                            {orderInfo.ward}, {orderInfo.district},{" "}
                            {orderInfo.province}
                            <br />- Ngày đặt hàng:{" "}
                            {new Date(orderInfo.createdAt).toLocaleDateString(
                                "en-GB"
                            )}
                            <br />- Phương thức vận chuyển:{" "}
                            <b>{orderInfo.service_name}</b>
                            <br />- Trạng thái đơn hàng:{" "}
                            <b>{orderInfo.OrderStatus.name}</b>
                            <br />- Mã GHN:{" "}
                            <b>
                                {orderInfo.order_code
                                    ? orderInfo.order_code
                                    : "Đơn hàng này chưa chuyển cho đơn vị vận chuyển"}
                            </b>{" "}
                            {orderInfo.order_code ? (
                                <a
                                    href={
                                        "https://tracking.ghn.dev/?order_code=" +
                                        orderInfo.order_code
                                    }
                                    className="bg-gray-500 text-white rounded"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Theo dõi đơn hàng
                                </a>
                            ) : (
                                ""
                            )}
                            <br />- Ngày giao hàng dự kiến:{" "}
                            <b>
                                {orderInfo.expected_delivery_time
                                    ? new Date(
                                          orderInfo.expected_delivery_time
                                      ).toLocaleDateString("en-GB")
                                    : "Đơn hàng này chưa chuyển cho đơn vị vận chuyển"}
                            </b>
                        </DialogContentText>
                    ) : (
                        ""
                    )}
                    <DialogContentText id="alert-dialog-description">
                        <b>Danh sách sản phẩm:</b>
                    </DialogContentText>
                    <div style={{ height: "100%", width: "802px" }}>
                        <DataGrid
                            rows={orderItem}
                            columns={columns}
                            localeText={
                                viVN.components.MuiDataGrid.defaultProps
                                    .localeText
                            }
                            loading={loading}
                            initialState={{
                                columns: {
                                    columnVisibilityModel: {
                                        id: false,
                                    },
                                },
                            }}
                            density="compact"
                            autoHeight
                            disableExtendRowFullWidth
                            disableColumnFilter
                            disableSelectionOnClick
                            hideFooter
                            showCellRightBorder
                            showColumnRightBorder
                            getCellClassName={getCellClassName}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseManager} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}

export default memo(OrderDetail);
