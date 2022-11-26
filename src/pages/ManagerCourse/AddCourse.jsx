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
            showNoti("Vui lòng chỉ chọn tệp hình ảnh", "error");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Không lấy được thông tin người dùng", "error");
            return;
        }

        if (!name) {
            showNoti("Vui lòng nhập tên của khóa học", "error");
            return;
        }

        if (price <= 0) {
            showNoti("Vui lòng nhập giá tiền của khóa học", "error");
            return;
        }

        if (student <= 0) {
            showNoti("Vui lòng nhập số lượng học viên của khóa học", "error");
            return;
        }

        if (content <= 0) {
            showNoti("Vui lòng nhập nội dung của khóa học", "error");
            return;
        }

        if (time <= 0) {
            showNoti(
                "Vui lòng nhập thời lượng mỗi buổi/chuyên đề của khóa học",
                "error"
            );
            return;
        }

        if (format.length === 0) {
            showNoti("Vui lòng chọn ít nhất 1 hình thức cho khóa học", "error");
            return;
        }

        if (uploadedFiles <= 0) {
            showNoti("Vui lòng chọn ít nhất 1 hình ảnh cho khóa học", "error");
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
            showNoti("Tạo khóa học thành công", "success");
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
                <DialogTitle>Thêm mới khóa học</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên khóa học"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Giá"
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
                        label="Số lượng học viên"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={student}
                        onChange={(e) => setStudent(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Loại
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        label="Loại"
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
                        label="Nội dung (số buổi/chuyên đề)"
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
                        label="Thời lượng (giờ/(buổi,chuyên đề))"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Hình thức
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        value={format}
                        label="Loại"
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
                        label="Thông tin khác (vd:4.5 tháng, mỗi tuần 2 buổi học,...)"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={otherInfo}
                        onChange={(e) => setOtherInfo(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="purpose-of-courses"
                        label="Mục tiêu (các nội dung cách nhau dấu ;)"
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
                        label="Nội dung thực hành (các nội dung cách nhau dấu ;)"
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
                        Hình ảnh khóa học: (tối đa 4 ảnh, có thể thêm số lượng
                        ảnh sau khi <br />
                        tạo khóa học ở công cụ Quản lý ảnh khóa học)
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
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddCourse);
