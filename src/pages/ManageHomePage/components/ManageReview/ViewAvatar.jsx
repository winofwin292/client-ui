import React, { memo } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";

import { createTheme, ThemeProvider } from "@mui/material/styles";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";
import { sleep } from "utils";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function ViewAvatar(props) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setViewAvatar({
            open: false,
            url: "",
            name: "",
        });
    };

    return (
        <div>
            <ThemeProvider theme={darkMode ? themeD : theme}>
                <Dialog
                    open={props.viewAvatar.open}
                    onClose={handleClose}
                    disableEscapeKeyDown
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Avatar</DialogTitle>
                    <DialogContent>
                        {/* <DialogContentText id="alert-dialog-description">
                            Đang quản trị hình ảnh của sản phẩm:{" "}
                            <b>{props.previewImage.name}</b>{" "}
                        </DialogContentText> */}
                        {props.viewAvatar.url ? (
                            <ImageList
                                // sx={{ width: 500, height: 450 }}
                                sx={{ mt: 1 }}
                                cols={1}
                                rowHeight={492}
                            >
                                <ImageListItem>
                                    <img
                                        src={props.viewAvatar.url}
                                        alt=""
                                        style={{
                                            height: "492px",
                                            width: "492px",
                                        }}
                                        loading="lazy"
                                        onError={async ({ currentTarget }) => {
                                            currentTarget.onerror = null;
                                            const url = currentTarget.src;
                                            await sleep(3000);
                                            currentTarget.src = url;
                                        }}
                                    />
                                    <ImageListItemBar
                                        sx={{
                                            background:
                                                "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                                "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                        }}
                                        title={props.viewAvatar.name}
                                        position="top"
                                    />
                                </ImageListItem>
                            </ImageList>
                        ) : (
                            <DialogContentText id="alert-dialog-description">
                                Không có ảnh đại diện
                            </DialogContentText>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Đóng</Button>
                    </DialogActions>
                </Dialog>
            </ThemeProvider>
        </div>
    );
}
export default memo(ViewAvatar);
