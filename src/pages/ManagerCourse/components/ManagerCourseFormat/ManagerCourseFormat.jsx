import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import courseFormatApi from "api/CourseFormat/courseFormatApi";
import formatApi from "api/Format/formatApi";

function ManagerCourseFormat(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [format, setFormat] = useState([]);
    const [dataSelect, setDataSelect] = useState([]);

    const getFormat = useCallback(async () => {
        const responseForSelect = await formatApi.getAll();
        setDataSelect(responseForSelect.data);
    }, []);

    const getData = useCallback(async () => {
        const response = await courseFormatApi.getAllByCourseId({
            courseId: props.managerCourseFormat.id,
        });

        if (response.status === 200) {
            let tempArr = [];
            response.data.forEach((element) => {
                tempArr.push(element.formatsId);
            });

            setFormat(tempArr);
            return true;
        } else {
            return false;
        }
    }, [props.managerCourseFormat.id]);

    const showNoti = useCallback(
        (msg, type) => {
            enqueueSnackbar(msg, {
                variant: type,
                action: (key) => (
                    <IconButton
                        size="small"
                        onClick={() => closeSnackbar(key)}
                        style={{
                            color: "white",
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ),
            });
        },
        [closeSnackbar, enqueueSnackbar]
    );

    useEffect(() => {
        getData();
    }, [getData]);

    useEffect(() => {
        getFormat();
    }, [getFormat]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setManagerCourseFormat({
            open: false,
            id: null,
            name: "",
        });
        setFormat([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (format.length === 0) {
            showNoti("Vui l??ng ch???n ??t nh???t 1 h??nh th???c cho kh??a h???c", "error");
            return;
        }

        const data = format.map((item) => ({
            courseId: props.managerCourseFormat.id,
            formatsId: item,
        }));

        const response = await courseFormatApi.update({
            courseId: props.managerCourseFormat.id,
            data: data,
        });

        if (response.status === 200) {
            setFormat([]);
            props.setManagerCourseFormat({
                open: false,
                id: null,
                name: "",
            });
            showNoti("C???p nh???t th??nh c??ng", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    return (
        <div>
            <Dialog
                open={props.managerCourseFormat.open}
                onClose={handleClose}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>H??nh th???c kh??a h???c</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        ??ang qu???n tr??? h??nh th???c c???a kh??a h???c:{" "}
                        <b>{props.managerCourseFormat.name}</b>
                    </DialogContentText>
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        H??nh th???c
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        value={format}
                        label="Lo???i"
                        variant="standard"
                        multiple
                        onChange={(e) => setFormat(e.target.value)}
                    >
                        {dataSelect.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.description}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>H???y</Button>
                    <Button onClick={(e) => handleSubmit(e)}>L??u</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(ManagerCourseFormat);
