import React, { memo, useEffect } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getObjectFromCookieValue } from "utils";

function Loading() {
    useEffect(() => {
        const userRole = getObjectFromCookieValue("userData").role || "";
        if (userRole === "ADMIN" || userRole === "STAFF")
            window.location.href = "/app/dashboard/*";
        else if (userRole === "TEACHER") window.location.href = "/app/teacher";
        else window.location.href = "/app/student";
    }, []);

    return (
        <div>
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={true}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
}

export default memo(Loading);
