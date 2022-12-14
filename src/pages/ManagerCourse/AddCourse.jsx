import React, { memo, useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ClearIcon from "@mui/icons-material/Clear";

import { useSnackbar } from "notistack";

import { getObjectFromCookieValue } from "utils";

import courseApi from "api/Course/courseApi";
import formatApi from "api/Format/formatApi";
import typeOfContentApi from "api/TypeOfContent/typeOfContentApi";

const MAX_COUNT = 4;
const optionsImageCompress = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 960,
    useWebWorker: true,
};

function AddCourse(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [dataFormat, setDataFormat] = useState([]);
    const [dataType, setDataType] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [student, setStudent] = useState(0);
    const [content, setContent] = useState(0);
    const [time, setTime] = useState(0);
    const [otherInfo, setOtherInfo] = useState("");
    const [type, setType] = useState(1);
    const [format, setFormat] = useState([]);
    const [purposeOfCourses, setPurposeOfCourses] = useState("");
    const [practicalContents, setPracticalContents] = useState("");

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

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
        setPrice(0);
        setStudent(0);
        setContent(0);
        setTime(0);
        setOtherInfo("");
        setType(1);
        setFormat([]);
        setPracticalContents("");
        setPurposeOfCourses("");
        setUploadedFiles([]);
        setFileLimit(false);
    };

    const getDataSelect = useCallback(async () => {
        const responseFormat = await formatApi.getAll();
        const responseType = await typeOfContentApi.getAll();
        setDataFormat(responseFormat.data);
        setDataType(responseType.data);
    }, []);

    useEffect(() => {
        getDataSelect();
    }, [getDataSelect]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
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
                            `B???n ch??? c?? th??? t???i l??n t???i ??a ${MAX_COUNT} ???nh`,
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
            }
        },
        [showNoti, uploadedFiles]
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        if (!name) {
            showNoti("Vui l??ng nh???p t??n c???a kh??a h???c", "error");
            return;
        }

        if (price <= 0) {
            showNoti("Vui l??ng nh???p gi?? ti???n c???a kh??a h???c", "error");
            return;
        }

        if (student <= 0) {
            showNoti("Vui l??ng nh???p s??? l?????ng h???c vi??n c???a kh??a h???c", "error");
            return;
        }

        if (content <= 0) {
            showNoti("Vui l??ng nh???p n???i dung c???a kh??a h???c", "error");
            return;
        }

        if (time <= 0) {
            showNoti(
                "Vui l??ng nh???p th???i l?????ng m???i bu???i/chuy??n ????? c???a kh??a h???c",
                "error"
            );
            return;
        }

        if (format.length === 0) {
            showNoti("Vui l??ng ch???n ??t nh???t 1 h??nh th???c cho kh??a h???c", "error");
            return;
        }

        if (uploadedFiles <= 0) {
            showNoti("Vui l??ng ch???n ??t nh???t 1 h??nh ???nh cho kh??a h???c", "error");
            return;
        }

        const data = {
            name,
            price: parseInt(price),
            student_number: parseInt(student),
            content: parseInt(content),
            time: parseInt(time),
            other_info: otherInfo,
            typeOfContentId: type,
            format,
            purposeOfCourses: purposeOfCourses.split(";"),
            practicalContents: practicalContents.split(";"),
            username: userData.username,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        const response = await courseApi.addCourse(formData);
        if (response.status === 200) {
            setDefaultState();
            props.getData();
            props.setOpen(false);
            showNoti("T???o kh??a h???c th??nh c??ng", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleDeleteImage = (e, name) => {
        setUploadedFiles((prev) => prev.filter((item) => item.name !== name));
        setFileLimit(false);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Th??m m???i kh??a h???c</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="T??n kh??a h???c"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Gi??"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="student"
                        label="S??? l?????ng h???c vi??n"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={student}
                        onChange={(e) => setStudent(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Lo???i
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        label="Lo???i"
                        variant="standard"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        {dataType.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.description}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        margin="dense"
                        id="content"
                        label="N???i dung (s??? bu???i/chuy??n ?????)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="time"
                        label="Th???i l?????ng (gi???/(bu???i,chuy??n ?????))"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        H??nh th???c
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        value={format}
                        label="Lo???i"
                        variant="standard"
                        multiple
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        {dataFormat.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.description}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        margin="dense"
                        id="other-info"
                        label="Th??ng tin kh??c (vd:4.5 th??ng, m???i tu???n 2 bu???i h???c,...)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={otherInfo}
                        onChange={(e) => setOtherInfo(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="purpose-of-courses"
                        label="M???c ti??u (c??c n???i dung c??ch nhau d???u ;)"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={purposeOfCourses}
                        onChange={(e) => setPurposeOfCourses(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="practical-contents"
                        label="N???i dung th???c h??nh (c??c n???i dung c??ch nhau d???u ;)"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={practicalContents}
                        onChange={(e) => setPracticalContents(e.target.value)}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        H??nh ???nh kh??a h???c: (t???i ??a 4 ???nh, c?? th??? th??m s??? l?????ng
                        ???nh sau khi <br />
                        t???o kh??a h???c ??? c??ng c??? Qu???n l?? ???nh kh??a h???c)
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
                            onChange={handleFileEvent}
                            disabled={fileLimit}
                        />
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
                                    // loading="lazy"
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
                                                handleDeleteImage(e, file.name)
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
                    <Button onClick={handleClose}>H???y</Button>
                    <Button onClick={(e) => handleSubmit(e)}>L??u</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddCourse);
