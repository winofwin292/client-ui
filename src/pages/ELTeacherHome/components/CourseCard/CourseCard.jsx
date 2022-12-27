import { IconButton } from "@mui/material";
import { AssignmentIndOutlined, FolderOpenOutlined } from "@mui/icons-material";
import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import "./CourseCard.css";

function CourseCard({ name, teacherName, teacherPhoto, id, style }) {
    const navigate = useNavigate();

    const goToCourse = () => {
        navigate(`/teacher/course/${id}`);
    };

    return (
        <div className="classCard" style={style} onClick={goToCourse}>
            <div className="classCard__upper">
                <div className="classCard__className">{name}</div>
                <div className="classCard__creatorName">{teacherName}</div>
                <img
                    src={teacherPhoto}
                    className="classCard__creatorPhoto"
                    alt=""
                />
            </div>
            <div className="classCard__middle"></div>
            <div className="classCard__lower">
                <IconButton>
                    <FolderOpenOutlined />
                </IconButton>
                <IconButton>
                    <AssignmentIndOutlined />
                </IconButton>
            </div>
        </div>
    );
}
export default memo(CourseCard);
