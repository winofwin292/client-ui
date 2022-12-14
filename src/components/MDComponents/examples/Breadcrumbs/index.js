/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// react-router-dom components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import { Breadcrumbs as MuiBreadcrumbs } from "@mui/material";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

import { urls } from "routes/url";

function Breadcrumbs({ icon, route, light }) {
    let pageTitle = urls[route.at(-1)];

    return (
        <MDBox mr={{ xs: 0, xl: 8 }}>
            <MuiBreadcrumbs
                sx={{
                    "& .MuiBreadcrumbs-separator": {
                        color: ({ palette: { white, grey } }) =>
                            light ? white.main : grey[600],
                    },
                }}
            >
                <Link to="/">
                    <MDTypography
                        component="span"
                        variant="body2"
                        color={light ? "white" : "dark"}
                        opacity={light ? 0.8 : 0.5}
                        sx={{ lineHeight: 0 }}
                    >
                        <Icon>{icon}</Icon>
                    </MDTypography>
                </Link>
                <Link to="/app/dashboard/*">
                    <MDTypography
                        component="span"
                        variant="button"
                        fontWeight="regular"
                        textTransform="capitalize"
                        color={light ? "white" : "dark"}
                        opacity={light ? 0.8 : 0.5}
                        sx={{ lineHeight: 0 }}
                    >
                        H??? th???ng qu???n l??
                    </MDTypography>
                </Link>
                <MDTypography
                    variant="button"
                    fontWeight="regular"
                    textTransform="capitalize"
                    color={light ? "white" : "dark"}
                    sx={{ lineHeight: 0 }}
                >
                    {pageTitle}
                </MDTypography>
            </MuiBreadcrumbs>
            <MDTypography
                fontWeight="bold"
                textTransform="capitalize"
                variant="h6"
                color={light ? "white" : "dark"}
                noWrap
            >
                {pageTitle}
            </MDTypography>
        </MDBox>
    );
}

// Setting default values for the props of Breadcrumbs
Breadcrumbs.defaultProps = {
    light: false,
};

// Typechecking props for the Breadcrumbs
Breadcrumbs.propTypes = {
    icon: PropTypes.node.isRequired,
    route: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
    light: PropTypes.bool,
};

export default Breadcrumbs;
