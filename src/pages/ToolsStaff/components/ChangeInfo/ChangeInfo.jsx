import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

function ChangeInfo(props) {
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

    const setDefaultState = () => {
        setFirstName("");
        setLastName("");
        setSex(true);
        setDob(new Date().setFullYear(new Date().getFullYear() - 18));
        setAddress("");
        setEmail("");
        setPhone("");
        setUsername("");
    };

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
            setFirstName(response.data.first_name);
            setLastName(response.data.last_name);
            setSex(response.data.sex);
            setDob(new Date(response.data.dob));
            setAddress(response.data.address);
            setEmail(response.data.email);
            setPhone(response.data.phone);
            setUsername(response.data.username);
        }
    }, [props, showNoti]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
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
            username,
            first_name: firstName,
            last_name: lastName,
            sex,
            dob: new Date(dob).toISOString(),
            address,
            email,
            phone,
        };

        const response = await userApi.editUserInfo(data);
        if (response.status === 200) {
            setDefaultState();
            props.setOpen(false);
            showNoti("Cập nhật thông tin thành công", "success");
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
                <DialogTitle>Đổi thông tin người dùng</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="firstName"
                        label="Họ"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="lastName"
                        label="Tên"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
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
        </div>
    );
}
export default memo(ChangeInfo);
