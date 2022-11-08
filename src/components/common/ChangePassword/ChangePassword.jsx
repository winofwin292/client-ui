import React, { memo, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import validator from "validator";
import userApi from "api/Users/useApi";
import { getObjectFromCookieValue } from "utils";

function ChangePassword(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

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

    const setDefaultState = () => {
        setPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!password) {
            showNoti("Vui lòng điền mật khẩu cũ", "error");
            return;
        }

        const user = getObjectFromCookieValue("userData");

        const data = {
            username: user.username,
            oldPass: password,
            newPass: newPassword,
        };

        const response = await userApi.changePassword(data);
        if (response.status === 200) {
            setDefaultState();
            props.setOpen(false);
            showNoti("Đổi mật khẩu thành công!", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Đổi mật khẩu</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        tabIndex={0}
                        margin="dense"
                        id="password"
                        label="Mật khẩu cũ"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <TextField
                        tabIndex={1}
                        margin="dense"
                        id="new-password"
                        label="Mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <TextField
                        tabIndex={2}
                        margin="dense"
                        id="confirm-password"
                        label="Nhập lại mật khẩu mới"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Mật khẩu phải có độ dài lơn hơn 8 ký tự, chứa ký tự hoa,
                        ký tự thường, số
                        <br /> và ký tự đặc biệt
                    </InputLabel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button
                        onClick={(e) => handleSubmit(e)}
                        disabled={
                            !validator.isStrongPassword(newPassword) ||
                            newPassword !== confirmNewPassword
                        }
                    >
                        Đổi mật khẩu
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(ChangePassword);
