import React, { memo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionUp(props) {
    return <Slide {...props} direction="up" />;
}

function CustomAlert(props) {
    const timeOutConst = props.timeOut || 3000;
    useEffect(() => {
        const timeId = setTimeout(() => {
            props.onClose({
                open: false,
                type: props.data.type,
                msg: "",
            });
        }, timeOutConst);

        return () => {
            clearTimeout(timeId);
        };
    }, [props, props.data, timeOutConst]);

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        props.onClose({
            open: false,
            type: props.data.type,
            msg: "",
        });
    };

    return (
        <Stack spacing={2} sx={{ width: "100%" }}>
            <Snackbar
                open={props.data.open}
                // autoHideDuration={6000}
                onClose={handleClose}
                TransitionComponent={TransitionUp}
            >
                <Alert
                    onClose={handleClose}
                    severity={props.data.type}
                    sx={{ width: "100%" }}
                >
                    {props.data.msg}
                </Alert>
            </Snackbar>
        </Stack>
    );
}

export default memo(CustomAlert);
