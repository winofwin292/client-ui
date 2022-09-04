import React, { memo } from "react";
import { BasicPage } from "../components/common";
import SchoolIcon from "@mui/icons-material/School";

function StudentCourse() {
    return <BasicPage title="Student Page" icon={<SchoolIcon />} />;
}

export default memo(StudentCourse);
