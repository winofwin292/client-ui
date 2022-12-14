import React, { memo, useState, useCallback, useMemo, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import ghnApi from "api/GHN/ghnApi";

function PrintOrder(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [printSize, setPrintSize] = useState(0);

    const printRef = useRef();

    const dataSelect = useMemo(
        () => [
            {
                id: 1,
                name: "A5",
                url: "https://dev-online-gateway.ghn.vn/a5/public-api/printA5?token=",
            },
            {
                id: 2,
                name: "80x80",
                url: "https://dev-online-gateway.ghn.vn/a5/public-api/print80x80?token=",
            },
            {
                id: 3,
                name: "50x72",
                url: "https://dev-online-gateway.ghn.vn/a5/public-api/print52x70?token=",
            },
        ],
        []
    );

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

    const handleClose = (e, reason) => {
        // if (reason && reason === "backdropClick") return;
        props.setPrintState({
            open: false,
            orderCode: "",
        });
        setPrintSize(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let token = "";

        if (printSize === 0) {
            showNoti("Vui l??ng ch???n k??ch c??? in", "error");
            return;
        }

        const response = await ghnApi.getTokenPrint({
            orderCode: props.printState.orderCode,
        });
        if (response.status === 200) token = response.data.token;
        else {
            showNoti("Kh??ng l???y ???????c token", "error");
            return;
        }

        const url = dataSelect.find((item) => item.id === printSize).url;

        printRef.current.innerHTML =
            "<iframe style='display: none;' src=" + url + token + " ></iframe>";

        // props.setPrintState({
        //     open: false,
        //     orderCode: "",
        // });
        setPrintSize(0);
    };

    return (
        <div>
            <Dialog
                open={props.printState.open}
                onClose={handleClose}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>In phi???u ????n h??ng</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description">
                        ????n h??ng c???a: <b>{props.orderStatus.info}</b>
                    </DialogContentText> */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        K??ch c???
                    </InputLabel>
                    <Select
                        id="size"
                        fullWidth
                        margin="dense"
                        sx={{ mt: 1 }}
                        value={printSize}
                        label="K??ch c???"
                        variant="standard"
                        onChange={(e) => setPrintSize(e.target.value)}
                    >
                        <MenuItem value={0}>Ch???n k??ch c??? in</MenuItem>
                        {dataSelect.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>
                    <div style={{ display: "none" }} ref={printRef}></div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>????ng</Button>
                    <Button onClick={(e) => handleSubmit(e)}>In</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(PrintOrder);
