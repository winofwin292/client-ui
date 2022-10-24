import React, { memo, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import { removeAccents } from "utils";
import categoryApi from "api/Category/categoryApi";

function AddCategory(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [description, setDescription] = useState("");

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
        setName("");
        setCode("");
        setDescription("");
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setDefaultState();
        props.getData();
        props.setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            showNoti("Vui lòng điền tên loại hàng vào biểu mẫu", "error");
            return;
        }

        if (!code) {
            showNoti("Vui lòng điền mã loại hàng vào biểu mẫu", "error");
            return;
        }

        const data = {
            name,
            code,
            description,
        };
        const response = await categoryApi.add(data);
        if (response.status === 200) {
            showNoti("Tạo thành công", "success");
            setDefaultState();
            props.setOpen(false);
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
                <DialogTitle>Thêm mới loại hàng</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên loại hàng"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);

                            setCode(
                                removeAccents(
                                    e.target.value
                                        .replace(/\s+/g, "")
                                        .toUpperCase()
                                )
                            );
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="code"
                        label="Mã loại hàng"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="description"
                        label="Mô tả: (không bắt buộc)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
export default memo(AddCategory);
