import React, { memo, useState, useCallback } from "react";
import parse from "html-react-parser";
import { useSnackbar } from "notistack";

import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import { MoreVert } from "@mui/icons-material";
import DownloadIcon from "@mui/icons-material/Download";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import CloseIcon from "@mui/icons-material/Close";

import "./Announcement.css";

import { ConfirmDialog } from "components/common/ConfirmDialog";

import EditLesson from "../EditLesson/EditLesson";
import lessonApi from "api/Lesson/lessonApi";

function Announcement({ data, getData, courseId }) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = useState(null);
    const [editLessonState, setEditLessonState] = useState({
        state: false,
        id: null,
    });
    const [confirmDelete, setConfirmDelete] = useState({
        state: false,
        data: {},
    });

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

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenEdit = (e, lessonId) => {
        setEditLessonState({
            state: true,
            id: lessonId,
        });
        setAnchorEl(null);
    };

    const handleDeleteLesson = async (lessonId) => {
        const response = await lessonApi.delete({ id: lessonId.id });
        if (response.status === 200) {
            showNoti("Xóa thành công", "success");
            getData(courseId);
        } else {
            showNoti("Lỗi: không xóa được bài học", "error");
        }
    };

    const handleDeleteClick = (id) => async () => {
        setConfirmDelete({
            state: true,
            data: {
                id: id,
            },
        });
        setAnchorEl(null);
    };
    return (
        <div className="announcement">
            <div className="announcement__informationContainer">
                <div className="announcement__infoSection">
                    <div className="announcement__nameAndDate">
                        <div className="announcement__name">{data.title}</div>
                        <div className="announcement__date">
                            Ngày đăng:{" "}
                            {new Date(data.createdAt).toLocaleDateString(
                                "en-GB"
                            ) +
                                " " +
                                new Date(data.createdAt).toLocaleTimeString(
                                    "en-GB"
                                )}
                        </div>
                    </div>
                </div>
                <div className="announcement__infoSection">
                    <IconButton onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <MenuItem onClick={(e) => handleOpenEdit(e, data.id)}>
                        Chỉnh sửa
                    </MenuItem>
                    <MenuItem onClick={handleDeleteClick(data.id)}>
                        Xóa
                    </MenuItem>
                </Menu>
            </div>
            <div className="announcement__content">{parse(data.content)}</div>
            {!data.isTest ? (
                <>
                    <br />
                    <div className="announcement__name">*Các tệp đính kèm</div>
                    <div className="announcement__files">
                        <List dense={true}>
                            {data.LessonFile?.map((file, index) => (
                                <ListItem
                                    key={index}
                                    secondaryAction={
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            href={file.file_url}
                                        >
                                            <DownloadIcon fontSize="inherit" />
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
                    </div>
                </>
            ) : (
                ""
            )}
            <EditLesson
                open={editLessonState}
                setOpen={setEditLessonState}
                lessonId={data.id}
                getData={getData}
                courseId={courseId}
            />
            <ConfirmDialog
                open={confirmDelete}
                setOpen={setConfirmDelete}
                confirmFunc={handleDeleteLesson}
                title="Xác nhận xóa?"
                msg="Xác nhận xóa bài học?"
            />
        </div>
    );
}
export default memo(Announcement);
