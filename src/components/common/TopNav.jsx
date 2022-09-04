import React, { memo } from "react";
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
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { isLoggedIn } from "../../utils";

function TopNav(props) {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    let history = useHistory();

    function handleLogout() {
        localStorage.removeItem("roles");
        history.push("/");
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = (path) => {
        setAnchorElNav(null);
        if (path) {
            history.push(path);
        }
    };

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
                        React Router Auth
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
                                        handleCloseNavMenu(
                                            `${props.prefix}${path}`
                                        )
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
                                onClick={() =>
                                    handleCloseNavMenu(`${props.prefix}${path}`)
                                }
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
