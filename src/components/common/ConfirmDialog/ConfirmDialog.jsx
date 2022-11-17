import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

function ConfirmDialog(props) {
    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen({
            state: false,
            isConfirm: {},
        });
    };

    const handleConfirm = () => {
        props.confirmFunc(props.open.data);
        props.setOpen({
            state: false,
            data: {},
        });
    };

    return (
        <Dialog
            open={props.open.state}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props.msg}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Hủy</Button>
                <Button onClick={handleConfirm} autoFocus>
                    Xác nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default memo(ConfirmDialog);
