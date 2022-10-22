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

import purposeOfCourseApi from "api/PurposeOfCourse/purposeOfCourseApi";

function AddPurposeOfCourse(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [content, setContent] = useState("");

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
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setContent("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!content) {
            showNoti("Vui lòng nhập nội dung cần thêm", "error");
            return;
        }

        const data = {
            courseId: props.courseId,
            content: content,
        };
        const response = await purposeOfCourseApi.add(data);
        if (response.status === 200) {
            setContent("");
            props.getData();
            props.setOpen(false);
            showNoti("Thêm nội dung thành công", "success");
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
                <DialogTitle>Thêm mới mục tiêu khóa học</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Mục tiêu"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
export default memo(AddPurposeOfCourse);
