import React, { memo } from "react";
import { BasicPage } from "../components/common";
import SquareFootIcon from "@mui/icons-material/SquareFoot";

function TeacherCourse() {
    return <BasicPage title="Teacher Page" icon={<SquareFootIcon />} />;
}

export default memo(TeacherCourse);
