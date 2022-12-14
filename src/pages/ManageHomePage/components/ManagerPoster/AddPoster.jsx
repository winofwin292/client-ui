import React, { memo, useState, useCallback } from "react";
import imageCompression from "browser-image-compression";

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

const optionsImageCompress = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
};

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

    const handleFileEvent = useCallback(
        async (e) => {
            const chosenFiles = Array.prototype.slice.call(e.target.files);
            e.target.value = null;
            var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
            const checkResult = chosenFiles.some(
                (file) => !allowedExtensions.exec(file.name)
            );

            if (!checkResult && !(chosenFiles[0].size / 1024 / 1024 > 5)) {
                const compressedFile = await imageCompression(
                    chosenFiles[0],
                    optionsImageCompress
                );
                setUploadedFile(
                    new File([compressedFile], compressedFile.name)
                );
            } else {
                showNoti(
                    "Vui l??ng ch??? ch???n t???p h??nh ???nh v?? nh??? h??n 5MB",
                    "error"
                );
                return;
            }
        },
        [showNoti]
    );

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        if (!content) {
            showNoti("Vui l??ng nh???p n???i dung ????nh gi??", "error");
            return;
        }

        if (!uploadedFile) {
            showNoti("Vui l??ng ???nh ?????i ??i???n c???a ng?????i ????nh gi??", "error");
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
            showNoti("Th??m th??nh c??ng", "success");
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
                <DialogTitle>Th??m m???i</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="content"
                        label="N???i dung"
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
                        ???nh cho poster (hi???n th??? t???t nh???t v???i ???nh t??? l???{" "}
                        <b>16:9</b>): ( &lt;5MB )
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
                    <Button onClick={handleClose}>H???y</Button>
                    <Button onClick={(e) => handleSubmit(e)}>L??u</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddPoster);
