import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";
import MDButton from "components/MDComponents/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "components/MDComponents/examples/Sidenav/SidenavCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "components/MDComponents/examples/Sidenav/SidenavRoot";

// Material Dashboard 2 React context
import {
    useMaterialUIController,
    setMiniSidenav,
    setTransparentSidenav,
    setWhiteSidenav,
} from "context";

import userApi from "api/Users/useApi";

function Sidenav({ color, brand, brandName, routes, ...rest }) {
    const [controller, dispatch] = useMaterialUIController();
    const {
        miniSidenav,
        transparentSidenav,
        whiteSidenav,
        darkMode,
        sidenavColor,
    } = controller;
    const location = useLocation();
    const collapseName = location.pathname.replace("/", "");
    const navigate = useNavigate();

    let textColor = "white";

    if (transparentSidenav || (whiteSidenav && !darkMode)) {
        textColor = "dark";
    } else if (whiteSidenav && darkMode) {
        textColor = "inherit";
    }

    const closeSidenav = () => setMiniSidenav(dispatch, true);

    useEffect(() => {
        // A function that sets the mini state of the sidenav.
        function handleMiniSidenav() {
            setMiniSidenav(dispatch, window.innerWidth < 1200);
            setTransparentSidenav(
                dispatch,
                window.innerWidth < 1200 ? false : transparentSidenav
            );
            setWhiteSidenav(
                dispatch,
                window.innerWidth < 1200 ? false : whiteSidenav
            );
        }

        /** 
     The event listener that's calling the handleMiniSidenav function when resizing the window.
    */
        window.addEventListener("resize", handleMiniSidenav);

        // Call the handleMiniSidenav function to set the state with the initial value.
        handleMiniSidenav();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleMiniSidenav);
        // eslint-disable-next-line
    }, [dispatch, location]);

    async function handleLogout() {
        const response = await userApi.logout();

        if (response.status === 200) {
            navigate("/");
        } else {
            console.log(response);
        }
    }

    // Render all the routes from the routes.js (All the visible items on the Sidenav)
    const renderRoutes = routes.map(
        ({ type, name, icon, title, noCollapse, key, href, path }) => {
            let returnValue;
            if (type === "collapse") {
                returnValue = href ? (
                    <Link
                        href={href}
                        key={key}
                        target="_blank"
                        rel="noreferrer"
                        sx={{ textDecoration: "none" }}
                    >
                        <SidenavCollapse
                            name={name}
                            icon={icon}
                            active={key === collapseName}
                            noCollapse={noCollapse}
                        />
                    </Link>
                ) : (
                    <NavLink key={key} to={path}>
                        <SidenavCollapse
                            name={name}
                            icon={icon}
                            active={key === collapseName}
                        />
                    </NavLink>
                );
            } else if (type === "title") {
                returnValue = (
                    <MDTypography
                        key={key}
                        color={textColor}
                        display="block"
                        variant="caption"
                        fontWeight="bold"
                        textTransform="uppercase"
                        pl={3}
                        mt={2}
                        mb={1}
                        ml={1}
                    >
                        {title}
                    </MDTypography>
                );
            } else if (type === "divider") {
                returnValue = (
                    <Divider
                        key={key}
                        light={
                            (!darkMode &&
                                !whiteSidenav &&
                                !transparentSidenav) ||
                            (darkMode && !transparentSidenav && whiteSidenav)
                        }
                    />
                );
            }

            return returnValue;
        }
    );

    return (
        <SidenavRoot
            {...rest}
            variant="permanent"
            ownerState={{
                transparentSidenav,
                whiteSidenav,
                miniSidenav,
                darkMode,
            }}
        >
            <MDBox pt={1} pb={1} px={4} textAlign="center">
                <MDBox
                    display={{ xs: "block", xl: "none" }}
                    position="absolute"
                    top={0}
                    right={0}
                    p={1.625}
                    onClick={closeSidenav}
                    sx={{ cursor: "pointer" }}
                >
                    <MDTypography variant="h6" color="secondary">
                        <Icon sx={{ fontWeight: "bold" }}>close</Icon>
                    </MDTypography>
                </MDBox>
            </MDBox>
            <List>{renderRoutes}</List>

            <MDBox p={2} mt="auto">
                <MDButton
                    variant="gradient"
                    color={sidenavColor}
                    fullWidth
                    onClick={handleLogout}
                >
                    Đăng xuất
                </MDButton>
            </MDBox>
        </SidenavRoot>
    );
}

// Setting default values for the props of Sidenav
Sidenav.defaultProps = {
    color: "info",
    brand: "",
};

// Typechecking props for the Sidenav
Sidenav.propTypes = {
    color: PropTypes.oneOf([
        "primary",
        "secondary",
        "info",
        "success",
        "warning",
        "error",
        "dark",
    ]),
    brand: PropTypes.string,
    brandName: PropTypes.string.isRequired,
    // routes: PropTypes.arrayOf(PropTypes.object).isRequired,
    routes: PropTypes.arrayOf(PropTypes.object),
};

export default Sidenav;
