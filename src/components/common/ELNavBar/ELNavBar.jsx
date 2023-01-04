import React, { memo, useState } from "react";
import { Avatar, IconButton, MenuItem, Menu } from "@mui/material";
import { Add, Apps, Menu as MenuIcon } from "@mui/icons-material";

import { useMaterialUIController, setOpenConfigurator } from "context";

import "./ELNavBar.css";

function ELNavBar({ setCreateState, setJoinState }) {
    // const [user, loading, error] = useAuthState(auth);
    const [anchorEl, setAnchorEl] = useState(null);

    const [controller, dispatch] = useMaterialUIController();
    const { openConfigurator } = controller;

    const handleConfiguratorOpen = () => {
        setOpenConfigurator(dispatch, !openConfigurator);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleOpenCreate = () => {
        setCreateState(true);
    };

    const handleOpenJoin = () => {
        setJoinState(true);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar__left">
                    <IconButton>
                        <MenuIcon />
                    </IconButton>
                    <img
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Logo"
                        className="navbar__logo"
                    />{" "}
                    <span>E-Learning</span>
                </div>
                <div className="navbar__right">
                    <IconButton
                        aria-controls="simple-menu"
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <Add />
                    </IconButton>
                    <IconButton onClick={handleConfiguratorOpen}>
                        <Apps />
                    </IconButton>
                    <IconButton
                    // onClick={logout}
                    >
                        <Avatar src="https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541" />
                    </IconButton>
                    <Menu
                        id="simple-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleOpenCreate}>
                            Create Class
                        </MenuItem>
                        <MenuItem onClick={handleOpenJoin}>Join Class</MenuItem>
                    </Menu>
                </div>
            </nav>
        </>
    );
}

export default memo(ELNavBar);
