import React, { memo, useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";

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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { useSnackbar } from "notistack";

import courseImageApi from "api/CourseImage/courseImageApi";

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

const optionsImageCompress = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 960,
    useWebWorker: true,
};

function ManagerCourseImage(props) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [images, setImages] = useState([]);
    const [saveState, setSaveState] = useState(true);
    const [clearFile, setClearFile] = useState(Date.now());

    const [maxCount, setMaxCount] = useState(4);

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

    const getData = useCallback(async () => {
        const response = await courseImageApi.getAllAdmin({
            courseId: props.managerCourseImage.id
                ? props.managerCourseImage.id
                : -1,
        });

        const responseCount = await courseImageApi.count({
            courseId: props.managerCourseImage.id
                ? props.managerCourseImage.id
                : -1,
        });

        if (responseCount.status === 200) {
            setMaxCount(4 - parseInt(responseCount.data.count));
        }

        if (response.status === 200) {
            setImages(response.data);
            return true;
        } else {
            return false;
        }
    }, [props.managerCourseImage.id]);

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
        setUploadedFiles([]);
        setFileLimit(false);
        props.setManagerCourseImage({
            open: false,
            id: "",
            name: "",
        });
    };

    const handleUploadFiles = useCallback(
        async (files) => {
            const uploaded = [...uploadedFiles];
            let limitExceeded = false;
            files.some((file) => {
                if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                    uploaded.push(file);
                    if (uploaded.length === maxCount) setFileLimit(true);
                    if (uploaded.length > maxCount) {
                        showNoti(
                            `B???n ch??? c?? th??? t???i l??n t???i ??a ${maxCount} ???nh`,
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
                let temp = [];
                for (const file of uploaded) {
                    const compressedFile = await imageCompression(
                        file,
                        optionsImageCompress
                    );
                    temp.push(new File([compressedFile], compressedFile.name));
                }

                setUploadedFiles(temp);
                setSaveState(false);
            }
        },
        [maxCount, showNoti, uploadedFiles]
    );

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        e.target.value = null;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult) {
            handleUploadFiles(chosenFiles);
        } else {
            showNoti("Vui l??ng ch??? ch???n t???p h??nh ???nh", "error");
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
            showNoti("Vui l??ng ch???n ??t nh???t 1 ???nh", "error");
            return;
        }

        const data = {
            courseId: props.managerCourseImage.id,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        const response = await courseImageApi.add(formData);
        if (response.status === 200) {
            getData();
            showNoti("Th??m h??nh ???nh th??nh c??ng", "success");
            setUploadedFiles([]);
            setFileLimit(false);
            setClearFile(Date.now());
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleDelete = async (e, id, key) => {
        const response = await courseImageApi.delete({ id, key });
        if (response.status === 200) {
            getData();
            showNoti("X??a h??nh ???nh th??nh c??ng", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <Dialog
                    open={props.managerCourseImage.open}
                    onClose={handleClose}
                    disableEscapeKeyDown
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>H??nh ???nh kh??a h???c</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            ??ang qu???n tr??? h??nh ???nh c???a kh??a:{" "}
                            <b>{props.managerCourseImage.name}</b>{" "}
                        </DialogContentText>
                        {images.length > 0 ? (
                            <>
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
                                                onError={async ({
                                                    currentTarget,
                                                }) => {
                                                    currentTarget.onerror =
                                                        null;
                                                    const url =
                                                        currentTarget.src;
                                                    await sleep(2000);
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
                                                            style={{
                                                                color: "white",
                                                            }}
                                                        />
                                                    </IconButton>
                                                }
                                                actionPosition="right"
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            </>
                        ) : (
                            <DialogContentText id="alert-dialog-description">
                                Kh??ng c?? h??nh ???nh cho kh??a n??y, vui l??ng t???i ???nh
                                l??n ????? c?? th??? qu???n tr???.
                            </DialogContentText>
                        )}

                        <InputLabel sx={{ mt: 1 }} id="type-label">
                            <AddCircleOutlineIcon sx={{ mr: 1 }} />
                            Th??m m???i h??nh ???nh:
                        </InputLabel>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<PhotoCamera fontSize="inherit" />}
                            size="small"
                        >
                            Ch???n ???nh
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
                            L??u
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
                        <Button onClick={handleClose}>????ng</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}
export default memo(ManagerCourseImage);
