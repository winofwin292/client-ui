import React, { memo, useState, useCallback } from "react";
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

import { useSnackbar } from "notistack";

import courseApi from "api/Course/courseApi";

function AddCourse(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
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
    };

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
        };
        const response = await courseApi.addCourse(data);
        if (response.status === 200) {
            setDefaultState();
            props.getData();
            props.setOpen(false);
            showNoti("Tạo khóa học thành công", "success");
        } else {
            showNoti(response.data, "error");
        }
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
                        <MenuItem value={1}>Khóa học</MenuItem>
                        <MenuItem value={2}>Chuyên đề</MenuItem>
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
                        <MenuItem value={1}>Trực tiếp</MenuItem>
                        <MenuItem value={2}>Trực tuyến</MenuItem>
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
