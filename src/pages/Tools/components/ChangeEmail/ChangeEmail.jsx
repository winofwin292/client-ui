import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import validator from "validator";
import { useSnackbar } from "notistack";

import { getObjectFromCookieValue } from "utils";

import userApi from "api/Users/useApi";

function ChangeEmail(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");

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

    const getData = useCallback(async () => {
        const user = getObjectFromCookieValue("userData");
        if (!user) {
            showNoti("Không lấy được thông tin người dùng", "error");
            props.setOpen(false);
        }

        const response = await userApi.getProfileUpdate({
            username: user.username,
        });

        if (response.status === 200) {
            setEmail(response.data.email);
            setUsername(response.data.username);
        }
    }, [props, showNoti]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setUsername("");
        setEmail("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            showNoti("Vui lòng nhập địa chỉ email", "error");
            return;
        }

        if (!validator.isEmail(email)) {
            showNoti("Vui lòng nhập email hợp lệ!", "error");
            setEmail("");
            return;
        }

        const data = {
            username,
            email,
        };

        const response = await userApi.editUserInfo(data);
        if (response.status === 200) {
            setUsername("");
            setEmail("");
            props.setOpen(false);
            showNoti("Đổi email thành công", "success");
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
                <DialogTitle>Đổi email thông báo giao hàng</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(ChangeEmail);
