import React, { memo } from "react";
import { IconButton } from "@mui/material";
import { Menu, MoreVert } from "@mui/icons-material";
import "./Announcement.css";

function Announcement({ image, name, date, content, authorId }) {
    return (
        <div className="announcement">
            <div className="announcement__informationContainer">
                <div className="announcement__infoSection">
                    <div className="announcement__imageContainer">
                        <img src={image} alt="Profile photo" />
                    </div>
                    <div className="announcement__nameAndDate">
                        <div className="announcement__name">{name}</div>
                        <div className="announcement__date">{date}</div>
                    </div>
                </div>
                <div className="announcement__infoSection">
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="announcement__content">{content}</div>
        </div>
    );
}
export default memo(Announcement);
