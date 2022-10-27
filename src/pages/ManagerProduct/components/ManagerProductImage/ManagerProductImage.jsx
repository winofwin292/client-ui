import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";

import { useSnackbar } from "notistack";
import productImageApi from "api/ProductImage/productImageApi";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";
import { sleep } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

const MAX_COUNT = 6;

function ManagerProductImage(props) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [images, setImages] = useState([]);
    const [saveState, setSaveState] = useState(true);
    const [clearFile, setClearFile] = useState(Date.now());

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

    const getData = useCallback(async () => {
        const response = await productImageApi.getAllAdmin({
            productId: props.managerProductImage.id
                ? props.managerProductImage.id
                : -1,
        });

        if (response.status === 200) {
            setImages(response.data);
            return true;
        } else {
            return false;
        }
    }, [props.managerProductImage.id]);

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

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        if (uploadedFiles.length === 0) {
            setSaveState(true);
        }
    }, [uploadedFiles]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        setImages([]);
        props.setManagerProductImage({
            open: false,
            id: "",
            name: "",
        });
    };

    const handleUploadFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    showNoti(
                        `Bạn chỉ có thể tải lên tối đa ${MAX_COUNT} ảnh`,
                        "error"
                    );
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
            return false;
        });
        if (!limitExceeded) {
            setUploadedFiles(uploaded);
        }
    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult) {
            handleUploadFiles(chosenFiles);
            setSaveState(false);
        } else {
            showNoti("Vui lòng chỉ chọn tệp hình ảnh", "error");
            return;
        }
    };

    const handleDeleteImage = (e, name) => {
        setUploadedFiles((prev) => prev.filter((item) => item.name !== name));
        setFileLimit(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (uploadedFiles.length === 0) {
            showNoti("Vui lòng chọn ít nhất 1 ảnh", "error");
            return;
        }

        const data = {
            productId: props.managerProductImage.id,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        const response = await productImageApi.add(formData);
        if (response.status === 200) {
            getData();
            showNoti("Thêm hình ảnh thành công", "success");
            setUploadedFiles([]);
            setClearFile(Date.now());
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleDelete = async (e, id, key) => {
        const response = await productImageApi.delete({ id, key });
        if (response.status === 200) {
            getData();
            showNoti("Xóa hình ảnh thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <Dialog
                    open={props.managerProductImage.open}
                    onClose={handleClose}
                    disableEscapeKeyDown
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Hình ảnh sản phẩm</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Đang quản trị hình ảnh của sản phẩm:{" "}
                            <b>{props.managerProductImage.name}</b>{" "}
                        </DialogContentText>
                        <ImageList
                            // sx={{ width: 500, height: 450 }}
                            sx={{ mt: 1 }}
                            cols={3}
                            rowHeight={164}
                        >
                            {images.map((image, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={image.url}
                                        alt=""
                                        style={{
                                            height: "164px",
                                            width: "164px",
                                        }}
                                        loading="lazy"
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
                                        title={image.name}
                                        position="top"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: "white" }}
                                                aria-label={`star ${image.name}`}
                                                onClick={(e) =>
                                                    handleDelete(
                                                        e,
                                                        image.id,
                                                        image.aws_key
                                                    )
                                                }
                                            >
                                                <ClearIcon
                                                    style={{ color: "white" }}
                                                />
                                            </IconButton>
                                        }
                                        actionPosition="right"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>

                        <InputLabel sx={{ mt: 1 }} id="type-label">
                            Thêm mới hình ảnh: (tối đa 6 ảnh, có thể thêm số
                            lượng ảnh sau khi <br />
                            tạo sản phẩm ở công cụ Quản lý ảnh sản phẩm)
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
                                multiple
                                type="file"
                                key={clearFile}
                                onChange={handleFileEvent}
                                disabled={fileLimit}
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
                            // sx={{ width: 500, height: 450 }}
                            sx={{ mt: 1 }}
                            cols={3}
                            rowHeight={164}
                        >
                            {uploadedFiles.map((file, index) => (
                                <ImageListItem key={index}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        srcSet={URL.createObjectURL(file)}
                                        alt={file.name}
                                        style={{ height: "164px" }}
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                        }}
                                        title={file.name}
                                        position="top"
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: "white" }}
                                                aria-label={`star ${file.name}`}
                                                onClick={(e) =>
                                                    handleDeleteImage(
                                                        e,
                                                        file.name
                                                    )
                                                }
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                        }
                                        actionPosition="right"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Hủy</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}
export default memo(ManagerProductImage);
