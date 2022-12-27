import React, { memo, useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";

function CreateClass({ createState, setCreateState }) {
    // const [user, loading, error] = useAuthState(auth);
    const [className, setClassName] = useState("");
    const handleClose = () => {
        setCreateState(false);
    };

    return (
        <div>
            <Dialog
                open={createState}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Create class</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the name of class and we will create a classroom
                        for you!
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Class Name"
                        type="text"
                        fullWidth
                        value={className}
                        onChange={(e) => setClassName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default memo(CreateClass);
