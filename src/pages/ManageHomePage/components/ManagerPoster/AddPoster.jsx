import React, { memo, useState, useCallback } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ClearIcon from "@mui/icons-material/Clear";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useSnackbar } from "notistack";

import { getObjectFromCookieValue } from "utils";

import posterApi from "api/Poster/posterApi";

function AddPoster(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [content, setContent] = useState("");

    const [uploadedFile, setUploadedFile] = useState(null);

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
        setContent("");
        setUploadedFile(null);
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        e.target.value = null;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult && !(chosenFiles[0].size / 1024 / 1024 > 5)) {
            setUploadedFile(chosenFiles[0]);
        } else {
            showNoti("Vui lòng chỉ chọn tệp hình ảnh và nhỏ hơn 5MB", "error");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Không lấy được thông tin người dùng", "error");
        }

        if (!content) {
            showNoti("Vui lòng nhập nội dung đánh giá", "error");
            return;
        }

        if (!uploadedFile) {
            showNoti("Vui lòng ảnh đại điện của người đánh giá", "error");
            return;
        }

        const data = {
            content,
            username: userData.username,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", uploadedFile);

        const response = await posterApi.add(formData);
        if (response.status === 200) {
            setDefaultState();
            props.getData();
            props.setOpen(false);
            showNoti("Thêm thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleDeleteImage = () => {
        setUploadedFile(null);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Thêm mới</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="content"
                        label="Nội dung"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        inputProps={{ maxLength: 200 }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Ảnh cho poster (hiển thị tốt nhất với ảnh tỷ lệ{" "}
                        <b>16:9</b>): ( &lt;5MB )
                    </InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera fontSize="inherit" />}
                        size="small"
                    >
                        Chọn ảnh
                        <input
                            hidden
                            id="fileUpload"
                            accept="image/*"
                            type="file"
                            onChange={handleFileEvent}
                        />
                    </Button>

                    <ImageList
                        // sx={{ width: 500, height: 450 }}
                        sx={{ mt: 1 }}
                        cols={1}
                        rowHeight={492}
                    >
                        {uploadedFile ? (
                            <ImageListItem>
                                <img
                                    src={URL.createObjectURL(uploadedFile)}
                                    srcSet={URL.createObjectURL(uploadedFile)}
                                    alt={uploadedFile.name}
                                    style={{ height: "492px" }}
                                    // loading="lazy"
                                />
                                <ImageListItemBar
                                    sx={{
                                        background:
                                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                            "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                    }}
                                    title={uploadedFile.name}
                                    position="top"
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: "white" }}
                                            aria-label={`star ${uploadedFile.name}`}
                                            onClick={handleDeleteImage}
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    }
                                    actionPosition="right"
                                />
                            </ImageListItem>
                        ) : (
                            ""
                        )}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddPoster);
