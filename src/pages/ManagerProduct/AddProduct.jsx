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
                            `Bạn chỉ có thể tải lên tối đa ${MAX_COUNT} ảnh`,
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
            showNoti("Vui lòng chỉ chọn tệp hình ảnh", "error");
            return;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name) {
            showNoti("Vui lòng nhập tên của sản phẩm", "error");
            return;
        }

        if (price <= 0) {
            showNoti("Vui lòng nhập giá tiền của sản phẩm", "error");
            return;
        }

        if (inStock <= 0) {
            showNoti("Vui lòng nhập số lượng của sản phẩm", "error");
            return;
        }

        if (!author) {
            showNoti("Vui lòng nhập tên tác giả", "error");
            return;
        }

        if (!publishingYear) {
            showNoti("Vui lòng nhập năm xuất bản", "error");
            return;
        }

        if (!categoryId) {
            showNoti("Vui lòng nhập chọn loại hàng", "error");
            return;
        }

        if (!description) {
            showNoti("Vui lòng nhập mô tả sản phẩm", "error");
            return;
        }

        if (weight <= 0 && weight > 30000) {
            showNoti(
                "Vui lòng nhập khối lượng sản phẩm (nhỏ hơn 30000g)",
                "error"
            );
            return;
        }

        if (length <= 0 && length > 150) {
            showNoti(
                "Vui lòng nhập chiều dài sản phẩm (nhỏ hơn 150cm)",
                "error"
            );
            return;
        }

        if (width <= 0 && width > 150) {
            showNoti(
                "Vui lòng nhập chiều dài sản phẩm (nhỏ hơn 150cm)",
                "error"
            );
            return;
        }

        if (height <= 0 && height > 150) {
            showNoti("Vui lòng nhập độ dày sản phẩm (nhỏ hơn 150cm)", "error");
            return;
        }

        if (uploadedFiles <= 0) {
            showNoti("Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm", "error");
            return;
        }

        const userData = getObjectFromCookieValue("userData");
        if (!userData) {
            showNoti("Không lấy được thông tin người dùng", "error");
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
            showNoti("Thêm sản phẩm thành công", "success");
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
                <DialogTitle>Thêm mới sản phẩm</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Tên sản phẩm"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        id="price"
                        label="Giá"
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
                        label="Tác giả"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />

                    <TextField
                        margin="dense"
                        id="publishing-year"
                        label="Năm xuất bản"
                        type="text"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0" }}
                        value={publishingYear}
                        onChange={(e) => setPublishingYear(e.target.value)}
                    />

                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Loại
                    </InputLabel>
                    <Select
                        id="type"
                        fullWidth
                        margin="dense"
                        label="Loại"
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
                        label="Số lượng"
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
                        label="Mô tả sản phẩm"
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
                        label="Khối lượng (gram) (<=30000g)"
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
                        label="Chiều dài (cm) (<=150cm)"
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
                        label="Chiều rộng (cm) (<=150cm)"
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
                        label="Độ dày (cm) (<=150cm)"
                        type="number"
                        fullWidth
                        variant="standard"
                        inputProps={{ min: "0", max: "150" }}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />

                    {/* upload */}
                    <InputLabel sx={{ mt: 1 }} id="type-label">
                        Hình ảnh sản phẩm: (tối đa 6 ảnh, có thể thêm số lượng
                        ảnh sau khi <br />
                        tạo sản phẩm ở công cụ Quản lý ảnh sản phẩm)
                    </InputLabel>
                    <Button
                        variant="outlined"
                        component="label"
                        startIcon={<PhotoCamera fontSize="inherit" />}
                        size="small"
                    >
                        Chọn ảnh
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
                    <Button onClick={handleClose}>Hủy</Button>
                    <Button onClick={(e) => handleSubmit(e)}>Lưu</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
export default memo(AddProduct);
