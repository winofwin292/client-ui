import React, { memo, useState, useCallback, useEffect } from "react";
import imageCompression from "browser-image-compression";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ClearIcon from "@mui/icons-material/Clear";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useSnackbar } from "notistack";

import { getObjectFromCookieValue } from "utils";

import productApi from "api/Product/productApi";
import categoryApi from "api/Category/categoryApi";

const MAX_COUNT = 6;
const optionsImageCompress = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
};

function AddProduct(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [dataType, setDataType] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [author, setAuthor] = useState("");
    const [publishingYear, setPublishingYear] = useState("");
    const [weight, setWeight] = useState(0);
    const [length, setLength] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [inStock, setInStock] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");

    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileLimit, setFileLimit] = useState(false);

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

    const setDefaultState = () => {
        setName("");
        setPrice(0);
        setAuthor("");
        setPublishingYear("");
        setCategoryId("");
        setDescription("");
        setUploadedFiles([]);
        setFileLimit(false);
        setWeight(0);
        setLength(0);
        setWidth(0);
        setHeight(0);
        setInStock(0);
    };

    const getDataSelect = useCallback(async () => {
        const responseType = await categoryApi.getAllAdmin();
        setDataType(responseType.data);
    }, []);

    useEffect(() => {
        getDataSelect();
    }, [getDataSelect]);

    const handleClose = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setOpen(false);
        setDefaultState();
    };

    const handleUploadFiles = useCallback(
        async (files) => {
            const uploaded = [...uploadedFiles];
            let limitExceeded = false;
            files.some((file) => {
                if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                    uploaded.push(file);
                    if (uploaded.length === MAX_COUNT) setFileLimit(true);
                    if (uploaded.length > MAX_COUNT) {
                        showNoti(
                            `B???n ch??? c?? th??? t???i l??n t???i ??a ${MAX_COUNT} ???nh`,
                            "error"
                        );
                        setFileLimit(false);
                        limitExceeded = true;
                        return true;
                    }
                }
                return false;
            });
            if (!limitExceeded) {
                let temp = [];
                for (const file of uploaded) {
                    const compressedFile = await imageCompression(
                        file,
                        optionsImageCompress
                    );
                    temp.push(new File([compressedFile], compressedFile.name));
                }
                setUploadedFiles(temp);
            }
        },
        [showNoti, uploadedFiles]
    );

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        e.target.value = null;
        var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
        const checkResult = chosenFiles.some(
            (file) => !allowedExtensions.exec(file.name)
        );

        if (!checkResult) {
            handleUploadFiles(chosenFiles);
        } else {
            showNoti("Vui l??ng ch??? ch???n t???p h??nh ???nh", "error");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            showNoti("Vui l??ng nh???p t??n c???a s???n ph???m", "error");
            return;
        }

        if (price <= 0) {
            showNoti("Vui l??ng nh???p gi?? ti???n c???a s???n ph???m", "error");
            return;
        }

        if (inStock <= 0) {
            showNoti("Vui l??ng nh???p s??? l?????ng c???a s???n ph???m", "error");
            return;
        }

        if (!author) {
            showNoti("Vui l??ng nh???p t??n t??c gi???", "error");
            return;
        }

        if (!publishingYear) {
            showNoti("Vui l??ng nh???p n??m xu???t b???n", "error");
            return;
        }

        if (!categoryId) {
            showNoti("Vui l??ng nh???p ch???n lo???i h??ng", "error");
            return;
        }

        if (!description) {
            showNoti("Vui l??ng nh???p m?? t??? s???n ph???m", "error");
            return;
        }

        if (weight <= 0 && weight > 30000) {
            showNoti(
                "Vui l??ng nh???p kh???i l?????ng s???n ph???m (nh??? h??n 30000g)",
                "error"
            );
            return;
        }

        if (length <= 0 && length > 150) {
            showNoti(
                "Vui l??ng nh???p chi???u d??i s???n ph???m (nh??? h??n 150cm)",
                "error"
            );
            return;
        }

        if (width <= 0 && width > 150) {
            showNoti(
                "Vui l??ng nh???p chi???u d??i s???n ph???m (nh??? h??n 150cm)",
                "error"
            );
            return;
        }

        if (height <= 0 && height > 150) {
            showNoti("Vui l??ng nh???p ????? d??y s???n ph???m (nh??? h??n 150cm)", "error");
            return;
        }

        if (uploadedFiles <= 0) {
            showNoti("Vui l??ng ch???n ??t nh???t 1 h??nh ???nh cho s???n ph???m", "error");
            return;
        }

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Kh??ng l???y ???????c th??ng tin ng?????i d??ng", "error");
            return;
        }

        const data = {
            name,
            price: parseInt(price),
            author,
            publishing_year: parseInt(publishingYear),
            description,
            categoryId,
            weight: parseInt(weight),
            length: parseInt(length),
            width: parseInt(width),
            height: parseInt(height),
            in_stock: parseInt(inStock),
            username: userData.username,
        };

        let formData = new FormData();

        formData.append("data", JSON.stringify(data));
        uploadedFiles.forEach((file) => formData.append("file", file));

        const response = await productApi.add(formData);
        if (response.status === 200) {
            setDefaultState();
            props.getData();
            props.setOpen(false);
            showNoti("Th??m s???n ph???m th??nh c??ng", "success");
        } else {
            showNoti(response.data, "error");
        }
    };

    const handleDeleteImage = (e, name) => {
        setUploadedFiles((prev) => prev.filter((item) => item.name !== name));
        setFileLimit(false);
    };

    return (
        <div>
            <Dialog
                open={props.open}
                onClose={handleClose}
                disableEscapeKeyDown
            >
                <DialogTitle>Th??m m???i s???n ph???m</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="T??n s???n ph???m"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Gi??"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="author"
                        label="T??c gi???"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="publishing-year"
                        label="N??m xu???t b???n"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={publishingYear}
                        onChange={(e) => setPublishingYear(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Lo???i
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        label="Lo???i"
                        variant="standard"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        {dataType.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>

                    <TextField
                        margin="dense"
                        id="in-stock"
                        label="S??? l?????ng"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={inStock}
                        onChange={(e) => setInStock(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="description"
                        label="M?? t??? s???n ph???m"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="weight"
                        label="Kh???i l?????ng (gram) (<=30000g)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0", max: "30000" }}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="length"
                        label="Chi???u d??i (cm) (<=150cm)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0", max: "150" }}
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="width"
                        label="Chi???u r???ng (cm) (<=150cm)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0", max: "150" }}
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="height"
                        label="????? d??y (cm) (<=150cm)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0", max: "150" }}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        H??nh ???nh s???n ph???m: (t???i ??a 6 ???nh, c?? th??? th??m s??? l?????ng
                        ???nh sau khi <br />
                        t???o s???n ph???m ??? c??ng c??? Qu???n l?? ???nh s???n ph???m)
                    </InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera fontSize="inherit" />}
                        size="small"
                    >
                        Ch???n ???nh
                        <input
                            hidden
                            id="fileUpload"
                            accept="image/*"
                            multiple
                            type="file"
                            onChange={handleFileEvent}
                            disabled={fileLimit}
                        />
                    </Button>

                    <ImageList
                        // sx={{ width: 500, height: 450 }}
                        sx={{ mt: 1 }}
                        cols={3}
                        rowHeight={164}
                    >
                        {uploadedFiles.map((file, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={URL.createObjectURL(file)}
                                    srcSet={URL.createObjectURL(file)}
                                    alt={file.name}
                                    style={{ height: "164px" }}
                                    // loading="lazy"
                                />
                                <ImageListItemBar
                                    sx={{
                                        background:
                                            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                                            "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                                    }}
                                    title={file.name}
                                    position="top"
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: "white" }}
                                            aria-label={`star ${file.name}`}
                                            onClick={(e) =>
                                                handleDeleteImage(e, file.name)
                                            }
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    }
                                    actionPosition="right"
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>H???y</Button>
                    <Button onClick={(e) => handleSubmit(e)}>L??u</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddProduct);
