import React, { memo, useState, useCallback, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { InputLabel } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { useSnackbar } from "notistack";

import productApi from "api/Product/productApi";
import categoryApi from "api/Category/categoryApi";

const MAX_COUNT = 6;

function AddProduct(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [dataType, setDataType] = useState([]);

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [author, setAuthor] = useState("");
    const [publishingYear, setPublishingYear] = useState("");
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
    };

    const getDataSelect = useCallback(async () => {
        const responseType = await categoryApi.getAll();
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

    const handleUploadFiles = (files) => {
        const uploaded = [...uploadedFiles];
        let limitExceeded = false;
        files.some((file) => {
            if (uploaded.findIndex((f) => f.name === file.name) === -1) {
                uploaded.push(file);
                if (uploaded.length === MAX_COUNT) setFileLimit(true);
                if (uploaded.length > MAX_COUNT) {
                    alert(`You can only add a maximum of ${MAX_COUNT} files`);
                    setFileLimit(false);
                    limitExceeded = true;
                    return true;
                }
            }
            return false;
        });
        if (!limitExceeded) {
            setUploadedFiles(uploaded);
        }
    };

    const handleFileEvent = (e) => {
        const chosenFiles = Array.prototype.slice.call(e.target.files);
        console.log(chosenFiles);
        handleUploadFiles(chosenFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(uploadedFiles);

        if (!name) {
            showNoti("Vui lòng nhập tên của sản phẩm", "error");
            return;
        }

        if (price <= 0) {
            showNoti("Vui lòng nhập giá tiền của sản phẩm", "error");
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

        const data = {
            name,
            price: parseInt(price),
            author,
            publishing_year: parseInt(publishingYear),
            description,
            categoryId,
        };
        // const response = await productApi.add(data);
        // if (response.status === 200) {
        //     setDefaultState();
        //     props.getData();
        //     props.setOpen(false);
        //     showNoti("Thêm sản phẩm thành công", "success");
        // } else {
        //     showNoti(response.data, "error");
        // }
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
                        inputProps={{ min: "0" }}
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

                    {/* <div className="uploaded-files-list">
                        {uploadedFiles.map((file) => (
                            <div>{URL.createObjectURL(file)}</div>
                        ))}
                    </div> */}
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
                                        >
                                            <StarBorderIcon />
                                        </IconButton>
                                    }
                                    actionPosition="left"
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
