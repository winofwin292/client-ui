import React, { memo, useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";

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
import { sleep, getObjectFromCookieValue } from "utils";

import reviewApi from "api/Review/reviewApi";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

const optionsImageCompress = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 500,
    useWebWorker: true,
};

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

    const handleClose = useCallback(
        (e, reason) => {
            if (reason && reason === "backdropClick") return;
            setImageUrl("");
            setUploadedFile(null);
            setSaveState(true);
            props.getData();
            props.setViewAvatar({
                open: false,
                url: "",
                name: "",
                id: "",
                key: "",
            });
        },
        [props]
    );

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

    const handleFileEvent = useCallback(
        async (e) => {
            const chosenFiles = Array.prototype.slice.call(e.target.files);
            e.target.value = null;
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            const checkResult = chosenFiles.some(
                (file) => !allowedExtensions.exec(file.name)
            );

            if (!checkResult) {
                const compressedFile = await imageCompression(
                    chosenFiles[0],
                    optionsImageCompress
                );
                setUploadedFile(
                    new File([compressedFile], compressedFile.name)
                );
                setSaveState(false);
            } else {
                showNoti(
                    "Vui l??ng ch??? ch???n t???p h??nh ???nh v?? nh??? h??n 5MB",
                    "error"
                );
            }
            e.target.files = null;
            return;
        },
        [showNoti]
    );

    const handleDeleteImage = (e, name) => {
        setUploadedFile(null);
        setSaveState(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        if (!uploadedFile) {
            showNoti("Vui l??ng ch???n ???nh", "error");
            return;
        }

        const data = {
            reviewId: props.viewAvatar.id,
            aws_key: props.viewAvatar.key,
            username: userData.username,
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
            showNoti("S???a h??nh ???nh th??nh c??ng", "success");
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
                                        loading="lazy"
                                        onError={async ({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            const url = currentTarget.src;
                                            await sleep(1000);
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
                                Kh??ng c?? ???nh ?????i di???n
                            </DialogContentText>
                        )}

                        <InputLabel sx={{ mt: 1 }} id="type-label">
                            C???p nh???t h??nh ???nh (hi???n th??? t???t nh???t v???i ???nh t??? l???{" "}
                            <b>1:1</b> (???nh vu??ng)):
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
                            L??u
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
                        <Button onClick={handleClose}>????ng</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}
export default memo(ViewAvatar);
