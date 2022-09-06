import React, { memo, useState } from "react";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { Trans } from "react-i18next";
import i18n from "../../translation/i18n";

import { isLoggedIn } from "../../utils";

function TopNav(props) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    let navigate = useNavigate();
    const [lang, setLang] = useState("vi");

    function handleLogout() {
        localStorage.removeItem("roles");
        navigate("/");
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (path) => {
        setAnchorElNav(null);
        if (!!props.prefix) {
            path = props.prefix + "/" + path;
        }
        if (path) {
            navigate(path);
        }
    };

    function handleChangeLanguage(e) {
        i18n.changeLanguage(e.target.value);
        setLang(e.target.value);
    }

    return (
        <MuiAppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
                    >
                        <Trans i18nKey={"content.class"} />
                    </Typography>

                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: "block", md: "none" },
                            }}
                        >
                            {props.routes.map(({ path, title }) => (
                                <MenuItem
                                    key={path}
                                    onClick={() =>
                                        handleCloseNavMenu(`${path}`)
                                    }
                                >
                                    <Typography textAlign="center">
                                        {title}
                                    </Typography>
                                </MenuItem>
                            ))}
                            {isLoggedIn() && (
                                <MenuItem key={"logout"} onClick={handleLogout}>
                                    <Typography textAlign="center">
                                        Logout
                                    </Typography>
                                </MenuItem>
                            )}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: { xs: "flex", md: "none" },
                        }}
                    >
                        React Router Auth
                    </Typography>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: { xs: "none", md: "flex" },
                        }}
                    >
                        {props.routes.map(({ path, title }) => (
                            <Button
                                key={path}
                                onClick={() => handleCloseNavMenu(`${path}`)}
                                sx={{
                                    my: 2,
                                    color: "white",
                                    display: "block",
                                }}
                            >
                                {title}
                            </Button>
                        ))}
                        {isLoggedIn() && (
                            <MenuItem key={"logout"} onClick={handleLogout}>
                                <Typography textAlign="center">
                                    Logout
                                </Typography>
                            </MenuItem>
                        )}
                    </Box>
                    <Box>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Language
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={lang}
                                label="Language"
                                onChange={handleChangeLanguage}
                                autoWidth
                            >
                                <MenuItem value="vi">Vi</MenuItem>
                                <MenuItem value="en">En</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Toolbar>
            </Container>
        </MuiAppBar>
    );
}

TopNav.propTypes = {
    routes: PropTypes.arrayOf(
        PropTypes.shape({
            path: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    prefix: PropTypes.string,
    className: PropTypes.string,
};

TopNav.defaultProps = {
    prefix: "",
    className: "",
};

export default memo(TopNav);
