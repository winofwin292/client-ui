import React, { memo } from "react";
import BasicPage from "./BasicPage";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

const NotFound = () => <BasicPage title="404" icon={<DoNotDisturbIcon />} />;

export default memo(NotFound);
