import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import orderStatusApi from "api/OrderStatus/orderStatusApi";
import orderApi from "api/Order/orderApi";

function ChangeState(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [orderStatus, setOrderStatus] = useState("");
    const [dataSelect, setDataSelect] = useState([]);

    const getStatus = useCallback(async () => {
        const responseForSelect = await orderStatusApi.getAll();
        setDataSelect(responseForSelect.data);
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

    useEffect(() => {
        setOrderStatus(props.orderStatus.orderStatusId);
    }, [props.orderStatus.orderStatusId]);

    useEffect(() => {
        getStatus();
    }, [getStatus]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOrderStatus({
            open: false,
            id: null,
            orderStatusId: "",
            info: "",
        });
        setOrderStatus("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await orderApi.changeStatus({
            orderId: props.orderStatus.id,
            orderStatusId: orderStatus,
        });

        if (response.status === 200) {
            setOrderStatus("");
            props.setOrderStatus({
                open: false,
                id: null,
                orderStatusId: "",
                info: "",
            });
            props.getData();
            showNoti("Cập nhật thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <Dialog
                open={props.orderStatus.open}
                onClose={handleClose}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Chuyển trạng thái đơn hàng</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Đơn hàng của: <b>{props.orderStatus.info}</b>
                    </DialogContentText>
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Trạng thái
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        value={orderStatus}
                        label="Trạng thái"
                        variant="standard"
                        onChange={(e) => setOrderStatus(e.target.value)}
                    >
                        {dataSelect.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(ChangeState);
