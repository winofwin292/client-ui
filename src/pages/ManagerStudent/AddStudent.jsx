import React, { memo, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import validator from "validator";
import { useSnackbar } from "notistack";

import { removeAccents } from "utils";
import userApi from "api/Users/useApi";

function AddStudent(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [sex, setSex] = useState(true);
    const [dob, setDob] = useState(
        new Date().setFullYear(new Date().getFullYear() - 18)
    );
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [resultDialog, setResultDialog] = useState(false);
    const [resultCopy, setResultCopy] = useState("");

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
        setFirstName("");
        setLastName("");
        setSex(true);
        setDob(new Date().setFullYear(new Date().getFullYear() - 18));
        setAddress("");
        setEmail("");
        setPhone("");
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
    };

    const handleCloseResult = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setUsername("");
        setPassword("");
        setResultCopy("");
        setDefaultState();
        setResultDialog(false);
        props.setOpen(false);
        props.handleRefresh();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !phone || !email || !address) {
            showNoti("Vui lòng điền thông tin vào biểu mẫu", "error");
            return;
        }

        if (!validator.isMobilePhone(phone, "vi-VN")) {
            showNoti("Vui lòng nhập số điện thoại hợp lệ!", "error");
            setPhone("");
            return;
        }

        if (!validator.isEmail(email)) {
            showNoti("Vui lòng nhập email hợp lệ!", "error");
            setEmail("");
            return;
        }

        const data = {
            username:
                removeAccents(
                    (firstName + lastName).replace(/\s+/g, "").toLowerCase()
                ) +
                new Date(dob).getDate().toString() +
                (new Date(dob).getMonth() + 1).toString() +
                new Date(dob).getFullYear().toString(),
            firstName,
            lastName,
            sex,
            dob: new Date(dob).toISOString(),
            address,
            email,
            phone,
            roleId: 4,
        };
        const response = await userApi.register(data);
        if (response.status === 200) {
            setUsername(response.data.username);
            setPassword(response.data.password);
            setResultDialog(true);
            showNoti("Tạo thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleCopy = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(
                "username: " + username + " - password: " + password
            );
            setResultCopy("Đã copy nội dung");
            console.log("Content copied to clipboard");
        } catch (err) {
            setResultCopy("Lỗi, không copy được nội dung");
            console.error("Failed to copy: ", err);
        }
    }, [password, username]);

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Thêm mới học viên</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="firstName"
                        label="Họ"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="lastName"
                        label="Tên"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="sex-label">
                        Giới tính
                    </InputLabel>
                    <Select
                        id="sex"
                        fullWidth
                        margin="dense"
                        value={sex}
                        label="Giới tính"
                        variant="standard"
                        onChange={(e) => setSex(e.target.value)}
                    >
                        <MenuItem value={true}>Nam</MenuItem>
                        <MenuItem value={false}>Nữ</MenuItem>
                    </Select>

                    <DatePicker
                        label="Ngày sinh"
                        id="dob"
                        maxDate={new Date().setFullYear(
                            new Date().getFullYear() - 18
                        )}
                        minDate={new Date("01/01/1900")}
                        value={dob}
                        onChange={(newDob) => setDob(newDob)}
                        renderInput={(params) => (
                            <TextField
                                fullWidth
                                variant="standard"
                                margin="dense"
                                {...params}
                            />
                        )}
                    />
                    <TextField
                        margin="dense"
                        id="address"
                        label="Địa chỉ"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
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
                    <TextField
                        margin="dense"
                        id="phone"
                        label="Số điện thoại"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={10}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={resultDialog}
                onClose={handleCloseResult}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Tạo học viên thành công"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Tài khoản: {username}
                    </DialogContentText>
                    <DialogContentText id="alert-dialog-description">
                        Mật khẩu: {password}
                    </DialogContentText>
                    <Button onClick={handleCopy} autoFocus>
                        Sao chép
                    </Button>
                    <DialogContentText id="alert-dialog-description">
                        {resultCopy}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseResult} autoFocus>
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddStudent);
