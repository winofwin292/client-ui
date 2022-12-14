import React, { memo, useState, useCallback, useEffect } from "react";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
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

import { useSnackbar } from "notistack";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

import axiosClient from "api/axiosClient";
import lessonApi from "api/Lesson/lessonApi";
import lessonFileApi from "api/LessonFile/lessonFileApi";

import LinearProgressWithLabel from "components/common/LinearProgressWithLabel/LinearProgressWithLabel";

const MAX_COUNT = 6;

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditLesson(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const [title, setTitle] = useState("");
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );

    const [lessonFile, setLessonFile] = useState([]);

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

    const getData = useCallback(async (id) => {
        const response = await lessonApi.getById({ id: id });
        setTitle(response.data.title || "");

        const blocksFromHtml = htmlToDraft(response.data.content);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(
            contentBlocks,
            entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));

        setLessonFile(response.data.LessonFile);
    }, []);

    useEffect(() => {
        if (props.open.id) {
            getData(props.open.id);
        }
    }, [getData, props.open.id]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen({
            state: false,
            id: null,
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
                            `B???n ch??? c?? th??? t???i l??n t???i ??a ${MAX_COUNT} t???p`,
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
            showNoti("Vui l??ng nh???p ti??u ?????", "error");
            return;
        }

        if (!draftToHtml(convertToRaw(editorState.getCurrentContent()))) {
            showNoti("Vui l??ng nh???p n???i dung", "error");
            return;
        }

        const data = {
            id: props.open.id,
            title,
            content: draftToHtml(convertToRaw(editorState.getCurrentContent())),
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        await axiosClient
            .post("/lesson/edit", formData, {
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
                props.getData(props.courseId);
                showNoti("S???a b??i h???c m???i th??nh c??ng", "success");
            })
            .catch((error) => {
                showNoti("???? c?? l???i x???y ra, vui l??ng th??? l???i sau", "error");
            });
    };

    const handleDeleteFileUpload = (e, name) => {
        setUploadedFiles((prev) => prev.filter((item) => item.name !== name));
        setFileLimit(false);
    };

    const handleDeleteFile = async (e, id, key) => {
        e.preventDefault();
        const resultDelete = await lessonFileApi.delete({ id: id, key: key });
        if (resultDelete.status === 200) {
            setLessonFile((prev) => prev.filter((item) => item.id !== id));
            showNoti("X??a t???p ????nh k??m th??nh c??ng", "success");
        } else {
            showNoti("???? c?? l???i x???y ra, vui l??ng th??? l???i sau", "error");
        }
    };

    return (
        <ThemeProvider theme={darkMode ? themeD : theme}>
            <Dialog
                open={props.open.state}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Ch???nh s???a b??i h???c</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Ti??u ?????:"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        N???i dung:
                    </InputLabel>

                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        T???p ????nh k??m hi???n t???i:
                    </InputLabel>

                    <List dense={true}>
                        {lessonFile.map((file, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        // href={file.file_url}
                                        onClick={(e) =>
                                            handleDeleteFile(
                                                e,
                                                file.id,
                                                file.key
                                            )
                                        }
                                    >
                                        <ClearIcon fontSize="inherit" />
                                    </IconButton>
                                }
                                sx={{ mt: 1 }}
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

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        T???p ????nh k??m: (t???i ??a 6 t???p)
                    </InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<FilePresentIcon fontSize="inherit" />}
                        size="small"
                    >
                        Ch???n t???p
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
                                            handleDeleteFileUpload(e, file.name)
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
                    <Button onClick={handleClose}>H???y</Button>
                    <Button onClick={(e) => handleSubmit(e)}>L??u</Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
export default memo(EditLesson);
