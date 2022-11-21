import React, { memo } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
function Loading() {
    return (
        <div>
            <Backdrop
                sx={{
                    color: "#fff",
                    backgroundColor: "white",
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
