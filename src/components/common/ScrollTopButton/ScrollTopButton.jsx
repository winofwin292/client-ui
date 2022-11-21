import React, { memo } from "react";
import { Box, Zoom, Fab } from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";
import useScrollTrigger from "@mui/material/useScrollTrigger";

function ScrollTop() {
    const trigger = useScrollTrigger({
        target: window,
        disableHysteresis: true,
        threshold: 100,
    });

    const scrollToTop = React.useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Zoom in={trigger}>
            <Box
                role="presentation"
                sx={{
                    position: "fixed",
                    bottom: 32,
                    right: 32,
                    zIndex: 1,
                }}
            >
                <Fab
                    onClick={scrollToTop}
                    color="info"
                    size="small"
                    aria-label="scroll back to top"
                    title="Trở về đầu trang"
                >
                    <KeyboardArrowUp />
                </Fab>
            </Box>
        </Zoom>
    );
}

export default memo(ScrollTop);
