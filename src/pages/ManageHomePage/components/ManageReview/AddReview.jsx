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

import reviewApi from "api/Review/reviewApi";

function AddReview(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [name, setName] = useState("");
    const [info, setInfo] = useState("");
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
        setName("");
        setInfo("");
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
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult) {
            setUploadedFile(chosenFiles[0]);
        } else {
            showNoti("Vui lòng chỉ chọn tệp hình ảnh", "error");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            showNoti("Vui lòng nhập tên của người đánh giá", "error");
            return;
        }

        if (!info) {
            showNoti("Vui lòng nhập thông tin của người đánh giá", "error");
            return;
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
            name,
            info,
            content,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", uploadedFile);

        const response = await reviewApi.add(formData);
        if (response.status === 200) {
            setDefaultState();
            props.getData();
            props.setOpen(false);
            showNoti("Thêm đánh giá thành công", "success");
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
            >
                <DialogTitle>Thêm mới sản phẩm</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên người đánh giá"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="info"
                        label="Thông tin"
                        type="text"
                        fullWidth
                        variant="standard"
                        placeholder="vd:Học viên khóa n, Nhân viên văn phòng, Sinh viên,..."
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="content"
                        label="Đánh giá"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Ảnh người đánh giá:
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
export default memo(AddReview);
