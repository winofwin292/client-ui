import React, { memo, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function CustomAlert(props) {
    useEffect(() => {
        const timeId = setTimeout(() => {
            props.onClose({
                open: false,
                type: props.data.type,
                msg: "",
            });
        }, 3000);

        return () => {
            clearTimeout(timeId);
        };
    }, [props, props.data]);

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
                autoHideDuration={6000}
                onClose={handleClose}
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
