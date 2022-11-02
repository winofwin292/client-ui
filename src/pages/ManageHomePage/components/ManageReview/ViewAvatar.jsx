import React, { memo, useState, useEffect, useCallback } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { useSnackbar } from "notistack";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";
import { sleep } from "utils";

import reviewApi from "api/Review/reviewApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function ViewAvatar(props) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [imageUrl, setImageUrl] = useState("");

    const [saveState, setSaveState] = useState(true);

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

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setImageUrl("");
        setUploadedFile(null);
        setSaveState(true);
        props.setViewAvatar({
            open: false,
            url: "",
            name: "",
            id: "",
            key: "",
        });
    };

    useEffect(() => {
        setImageUrl(
            props.viewAvatar.url
                ? props.viewAvatar.url + `?${new Date().getTime()}`
                : props.viewAvatar.url
        );
    }, [props.viewAvatar.url]);

    useEffect(() => {
        if (!uploadedFile) {
            setSaveState(true);
        }
    }, [uploadedFile]);

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult && !(chosenFiles[0].size / 1024 / 1024 > 2)) {
            setUploadedFile(chosenFiles[0]);
            setSaveState(false);
        } else {
            showNoti("Vui lòng chỉ chọn tệp hình ảnh và nhỏ hơn 2MB", "error");
        }
        e.target.files = null;
        return;
    };

    const handleDeleteImage = (e, name) => {
        setUploadedFile(null);
        setSaveState(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!uploadedFile) {
            showNoti("Vui lòng chọn ảnh", "error");
            return;
        }

        const data = {
            reviewId: props.viewAvatar.id,
            aws_key: props.viewAvatar.key,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        formData.append("file", uploadedFile);

        const response = await reviewApi.changeAvatar(formData);
        if (response.status === 200) {
            setImageUrl("../../loading.png");
            setTimeout(
                () =>
                    setImageUrl(response.data.url + `?${new Date().getTime()}`),
                2000
            );
            setSaveState(true);
            setUploadedFile(null);
            showNoti("Sửa hình ảnh thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <Dialog
                    open={props.viewAvatar.open}
                    onClose={handleClose}
                    disableEscapeKeyDown
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Avatar</DialogTitle>
                    <DialogContent>
                        {imageUrl ? (
                            <ImageList
                                sx={{ width: 300, mt: 1 }}
                                cols={1}
                                rowHeight={300}
                            >
                                <ImageListItem>
                                    <img
                                        src={imageUrl}
                                        alt={imageUrl}
                                        style={{
                                            height: "300px",
                                            width: "300px",
                                        }}
                                        // loading="lazy"
                                        onError={async ({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            const url = currentTarget.src;
                                            await sleep(3000);
                                            currentTarget.src = url;
                                        }}
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                        }}
                                        title={props.viewAvatar.name}
                                        position="top"
                                    />
                                </ImageListItem>
                            </ImageList>
                        ) : (
                            <DialogContentText id="alert-dialog-description">
                                Không có ảnh đại diện
                            </DialogContentText>
                        )}

                        <InputLabel sx={{ mt: 1 }} id="type-label">
                            Cập nhật hình ảnh: ( &lt;2MB )
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
                                disabled={uploadedFile}
                            />
                        </Button>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ ml: 1 }}
                            disabled={saveState}
                            startIcon={<SaveIcon fontSize="inherit" />}
                            onClick={(e) => handleSubmit(e)}
                        >
                            Lưu
                        </Button>

                        <ImageList
                            sx={{ width: 164, mt: 1 }}
                            cols={1}
                            rowHeight={164}
                        >
                            {uploadedFile ? (
                                <ImageListItem>
                                    <img
                                        src={URL.createObjectURL(uploadedFile)}
                                        srcSet={URL.createObjectURL(
                                            uploadedFile
                                        )}
                                        alt={uploadedFile.name}
                                        style={{
                                            height: "164px",
                                            width: "164px",
                                        }}
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
                        <Button onClick={handleClose}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}
export default memo(ViewAvatar);
