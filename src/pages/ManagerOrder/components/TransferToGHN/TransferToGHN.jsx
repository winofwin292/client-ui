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

import { formatterVND } from "utils";

import orderApi from "api/Order/orderApi";

function TransferToGHN(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [serviceId, setServiceId] = useState("");
    const [dataSelect, setDataSelect] = useState([]);
    const [fee, setFee] = useState(0);

    const getServices = useCallback(async () => {
        const responseForSelect = await orderApi.getServices({
            districtId: props.transferStatus.districtId,
        });
        if (responseForSelect.status === 200)
            setDataSelect(responseForSelect.data);
        else setDataSelect([]);
    }, [props.transferStatus.districtId]);

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
        getServices();
    }, [getServices]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setTransferStatus({
            open: false,
            id: null,
            districtId: "",
            wardCode: "",
        });
        setServiceId("");
        setFee(0);
    };

    const handleChangeService = async (e) => {
        setServiceId(e.target.value);
        const response = await orderApi.getFee({
            service_id: parseInt(e.target.value),
            district_id: props.transferStatus.districtId,
            ward_code: props.transferStatus.wardCode,
            orderId: props.transferStatus.id,
        });
        setFee(parseInt(response.data.fee));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (serviceId === "") {
            showNoti("Vui lòng chọn loại dịch vụ", "error");
            return;
        }

        const response = await orderApi.transferToGHN({
            id: props.transferStatus.id,
            service_id: serviceId,
        });

        if (response.status === 200) {
            showNoti("Đã chuyển đơn hàng cho vận chuyển", "success");
            props.setTransferStatus({
                open: false,
                id: null,
                districtId: "",
                wardCode: "",
            });
            setServiceId("");
            setFee(0);
            props.getData();
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <Dialog
                open={props.transferStatus.open}
                onClose={handleClose}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Chọn dịch vụ</DialogTitle>
                <DialogContent>
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Loại
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        value={serviceId}
                        sx={{ mt: 1 }}
                        label="Loại"
                        variant="standard"
                        onChange={(e) => handleChangeService(e)}
                    >
                        {dataSelect.map((item, index) => (
                            <MenuItem key={index} value={item.service_id}>
                                {item.short_name}
                            </MenuItem>
                        ))}
                    </Select>
                    <DialogContentText
                        id="alert-dialog-description"
                        sx={{ mt: 2 }}
                    >
                        Phí giao hàng: {formatterVND.format(fee)}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Chuyển</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(TransferToGHN);
