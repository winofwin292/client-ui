import React, { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import BasicPage from "./BasicPage";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

const NotFound = (props) => (
    <BasicPage title="404" icon={<DoNotDisturbIcon />} />
);

NotFound.propTypes = {
    jumbotronProps: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
    }),
};

NotFound.defaultProps = {
    jumbotronProps: {
        title: "404 not found",
    },
    children: <Link to="/">Back to home</Link>,
};

export default memo(NotFound);
