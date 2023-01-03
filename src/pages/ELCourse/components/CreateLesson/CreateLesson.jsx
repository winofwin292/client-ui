import React, { memo, useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { createTheme, ThemeProvider } from "@mui/material/styles";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import FilePresentIcon from "@mui/icons-material/FilePresent";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";

import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import ClearIcon from "@mui/icons-material/Clear";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useSnackbar } from "notistack";

import { getObjectFromCookieValue } from "utils";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import axiosClient from "api/axiosClient";

const MAX_COUNT = 6;

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center" p={3}>
            <Box width="100%" mr={3}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
}

LinearProgressWithLabel.propTypes = {
    value: PropTypes.number.isRequired,
};

function CreateLesson(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

    const [progress, setProgress] = useState();

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
        setTitle("");
        setUploadedFiles([]);
        setFileLimit(false);
        setProgress();
        setEditorState(() => EditorState.createEmpty());
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen({
            state: false,
            courseId: "",
        });
        setDefaultState();
    };

    const handleUploadFiles = useCallback(
        async (files) => {
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
        },
        [showNoti, uploadedFiles]
    );

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        e.target.value = null;
        handleUploadFiles(chosenFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title) {
            showNoti("Vui lòng nhập tiêu đề", "error");
            return;
        }

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Không lấy được thông tin người dùng", "error");
            return;
        }

        const data = {
            title,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            courseId: parseInt(props.open.courseId),
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        axiosClient
            .post("/lesson/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (data) => {
                    setProgress(Math.round((100 * data.loaded) / data.total));
                },
            })
            .then((response) => {
                props.setOpen({
                    state: false,
                    courseId: "",
                });
                setDefaultState();
                //     props.getData();
                showNoti("Thêm sản phẩm thành công", "success");
            })
            .catch((error) => {
                showNoti("Đã có lỗi xảy ra, vui lòng thử lại sau", "error");
            });
    };

    const handleDeleteFile = (e, name) => {
        setUploadedFiles((prev) => prev.filter((item) => item.name !== name));
        setFileLimit(false);
    };

    return (
        <ThemeProvider theme={darkMode ? themeD : theme}>
            <Dialog
                open={props.open.state}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Tạo mới bài học</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tiêu đề:"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Nội dung:
                    </InputLabel>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Tệp đính kèm: (tối đa 6 tệp)
                    </InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<FilePresentIcon fontSize="inherit" />}
                        size="small"
                    >
                        Chọn tệp
                        <input
                            hidden
                            id="fileUpload"
                            multiple
                            type="file"
                            onChange={handleFileEvent}
                            disabled={fileLimit}
                        />
                    </Button>

                    {progress && <LinearProgressWithLabel value={progress} />}

                    <List dense={true}>
                        {uploadedFiles.map((file) => (
                            <ListItem
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={(e) =>
                                            handleDeleteFile(e, file.name)
                                        }
                                    >
                                        <ClearIcon fontSize="inherit" />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <FilePresentIcon fontSize="inherit" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
export default memo(CreateLesson);
