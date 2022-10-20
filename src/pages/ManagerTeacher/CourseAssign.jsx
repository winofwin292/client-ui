import React, { memo, useState, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import RefreshIcon from "@mui/icons-material/Refresh";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { RenderCellExpand } from "components/common/RenderCellExpand";

import {
    DataGrid,
    viVN,
    GridActionsCellItem,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarExport,
    GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import courseApi from "api/Course/courseApi";
import roleInCourseApi from "api/RoleInCourse/roleInCourseApi";

// Material Dashboard 2 React contexts
import { useMaterialUIController } from "context";

const theme = createTheme();
const themeD = createTheme({
    palette: {
        mode: "dark",
    },
});

function EditToolbar(props) {
    const { handleRefresh } = props;

    return (
        <GridToolbarContainer>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
            >
                Làm mới dữ liệu
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <GridToolbarExport />
        </GridToolbarContainer>
    );
}

EditToolbar.propTypes = {
    handleRefresh: PropTypes.func.isRequired,
};

function CourseAssign(props) {
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(true);

    const [controller] = useMaterialUIController();
    const { darkMode } = controller;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const getData = useCallback(async () => {
        const response = await courseApi.getCourseForAssign();
        if (response.status === 200) {
            setData(response.data);
            setLoading(false);
            return true;
        } else {
            return false;
        }
    }, []);

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

    const handleClick = useCallback(
        async (e, courseId, id, teacher) => {
            if (teacher === null) {
                const response = await roleInCourseApi.add({
                    courseId: courseId,
                    userId: props.assignState.id,
                });
                if (response.status === 200) {
                    showNoti("Gán thành công", "success");
                    getData();
                } else {
                    showNoti("Đã xảy ra lỗi", "error");
                }
            }

            if (teacher === props.assignState.id) {
                const response = await roleInCourseApi.delete({
                    id: id,
                });
                if (response.status === 200) {
                    showNoti("Hủy giảng dạy thành công", "success");
                    getData();
                } else {
                    showNoti("Đã xảy ra lỗi", "error");
                }
            }
        },
        [getData, props.assignState.id, showNoti]
    );

    const columns = useMemo(
        () => [
            {
                field: "name",
                headerName: "Tên khóa học",
                width: 400,
                renderCell: RenderCellExpand,
            },
            {
                field: "teacher",
                headerName: "Trạng thái",
                width: 220,
                type: "string",
                renderCell: (params) => {
                    if (params.row.teacherId === null) {
                        return "Chưa có giáo viên";
                    }
                    if (params.row.teacherId === props.assignState.id) {
                        return "Đang giảng dạy khóa học này";
                    }
                    return "Giáo viên khác";
                },
            },
            {
                field: "actions",
                type: "actions",
                headerName: "Công cụ",
                width: 80,
                getActions: (params) => [
                    <GridActionsCellItem
                        icon={
                            params.row.teacherId === props.assignState.id ? (
                                <DoDisturbAltOutlinedIcon />
                            ) : (
                                <EditOutlinedIcon />
                            )
                        }
                        label="Chuyển trạng thái"
                        disabled={
                            params.row.teacherId !== props.assignState.id &&
                            params.row.teacherId !== null
                        }
                        onClick={(e) =>
                            handleClick(
                                e,
                                params.id,
                                params.row.roleInCourseId,
                                params.row.teacherId
                            )
                        }
                        title={
                            params.row.teacherId === props.assignState.id
                                ? "Hủy giảng dạy"
                                : params.row.teacher === null
                                ? "Gán giảng dạy"
                                : "Đã có giáo viên giảng dạy"
                        }
                    />,
                ],
            },
        ],
        [handleClick, props.assignState.id]
    );

    useEffect(() => {
        getData();
    }, [getData]);

    const handleRefresh = () => {
        if (getData()) {
            showNoti("Tải dữ liệu thành công", "success");
        } else {
            showNoti("Lỗi: không tải được dữ liệu", "error");
        }
    };

    const handleCloseAssign = (e, reason) => {
        if (reason && reason === "backdropClick") return;
        props.setAssignState({
            id: "",
            name: "",
            open: false,
        });
    };

    return (
        <Dialog
            open={props.assignState.open}
            onClose={handleCloseAssign}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">{"Gán khóa học"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Đang gán khóa học cho giáo viên: {props.assignState.name}
                </DialogContentText>
                <div style={{ height: 450, width: "100%" }}>
                    <ThemeProvider theme={darkMode ? themeD : theme}>
                        <DataGrid
                            rows={data}
                            columns={columns}
                            localeText={
                                viVN.components.MuiDataGrid.defaultProps
                                    .localeText
                            }
                            experimentalFeatures={{ newEditingApi: true }}
                            components={{
                                Toolbar: EditToolbar,
                            }}
                            componentsProps={{
                                toolbar: { handleRefresh },
                            }}
                            loading={loading}
                            density="compact"
                        />
                    </ThemeProvider>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseAssign} autoFocus>
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default memo(CourseAssign);
