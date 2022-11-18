import React, { memo, useMemo, useCallback, useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import * as XLSX from "xlsx";
import {
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from "@mui/x-data-grid";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import RefreshIcon from "@mui/icons-material/Refresh";
import GetAppIcon from "@mui/icons-material/GetApp";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import CloseIcon from "@mui/icons-material/Close";

import { formatterVND } from "utils";

import orderItemApi from "api/OrderItem/orderItemApi";

function StatisticalToolbar(props) {
    const { data, setData, setLoading, darkMode } = props;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

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

    const getData = useCallback(async () => {
        setLoading(true);
        const toDay = new Date();
        const start = new Date(
            toDay.getFullYear(),
            toDay.getMonth(),
            toDay.getDate(),
            0,
            0,
            0,
            0
        ).toISOString();
        const end = toDay.toISOString();
        const response = await orderItemApi.getStatistical({
            startDate: start,
            endDate: end,
        });
        if (response.status === 200) {
            setData(response.data);
        } else {
            setData([]);
        }
        setLoading(false);
    }, [setData, setLoading]);

    useEffect(() => {
        getData();
    }, [getData]);

    const handleClick = async () => {
        setLoading(true);
        const startDateFormMoment = new Date(startDate);
        const endDateFormMoment = new Date(endDate);
        const start = new Date(
            startDateFormMoment.getFullYear(),
            startDateFormMoment.getMonth(),
            startDateFormMoment.getDate(),
            0,
            0,
            0
        ).toISOString();
        const end = new Date(
            endDateFormMoment.getFullYear(),
            endDateFormMoment.getMonth(),
            endDateFormMoment.getDate(),
            23,
            59,
            59
        ).toISOString();
        const response = await orderItemApi.getStatistical({
            startDate: start,
            endDate: end,
        });
        if (response.status === 200) {
            setData(response.data);
        } else {
            setData([]);
        }
        setLoading(false);
    };

    const handleReset = () => {
        setData([]);
        setStartDate(new Date());
        setEndDate(new Date());
        showNoti("Đã xóa", "success");
    };

    const handleExportXlsx = () => {
        const startDateFormMoment = new Date(startDate);
        const endDateFormMoment = new Date(endDate);
        const startDateString = new Date(
            startDateFormMoment.getFullYear(),
            startDateFormMoment.getMonth(),
            startDateFormMoment.getDate(),
            0,
            0,
            0
        ).toLocaleString("en-GB");
        const endDateString = new Date(
            endDateFormMoment.getFullYear(),
            endDateFormMoment.getMonth(),
            endDateFormMoment.getDate(),
            23,
            59,
            59
        ).toLocaleString("en-GB");

        const filename =
            "doanh-thu-" + new Date().getTime().toString() + ".xlsx";

        const exportData = data.map((item, index) => {
            return {
                STT: index + 1,
                "Tên sản phẩm": item.name,
                "Số lượng bán ra": item.total_quantity,
                "Doanh thu": formatterVND.format(item.total),
            };
        });

        var ws = XLSX.utils.json_to_sheet(exportData, {
            dateNF: "dd/MM/yyyy",
            origin: "A4",
        });
        XLSX.utils.sheet_add_aoa(ws, [["Từ ngày:"]], {
            origin: "A1",
        });
        XLSX.utils.sheet_add_aoa(ws, [["Đến ngày:"]], {
            origin: "A2",
        });
        XLSX.utils.sheet_add_aoa(ws, [[startDateString]], {
            origin: "B1",
        });
        XLSX.utils.sheet_add_aoa(ws, [[endDateString]], {
            origin: "B2",
        });

        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Doanh thu");
        XLSX.writeFile(wb, filename);
    };

    return (
        <GridToolbarContainer>
            Từ ngày:
            <DatePicker
                id="dob"
                maxDate={endDate}
                minDate={new Date("01/01/1900")}
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                    <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
                        <input
                            ref={inputRef}
                            {...inputProps}
                            style={{
                                marginRight: "-5px",
                                backgroundColor: darkMode ? "#1f283e" : "",
                                color: darkMode ? "#FFFFFF" : "",
                                borderRadius: "5px",
                                border: darkMode
                                    ? "1px solid #BBBBBB"
                                    : "1px solid black",
                            }}
                        />
                        {InputProps?.endAdornment}
                    </Box>
                )}
            />
            Đến ngày:
            <DatePicker
                id="dob"
                maxDate={new Date()}
                minDate={startDate}
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                renderInput={({ inputRef, inputProps, InputProps }) => (
                    <Box sx={{ display: "flex", alignItems: "center", mx: 1 }}>
                        <input
                            ref={inputRef}
                            {...inputProps}
                            style={{
                                marginRight: "-5px",
                                backgroundColor: darkMode ? "#1f283e" : "",
                                color: darkMode ? "#FFFFFF" : "",
                                borderRadius: "5px",
                                border: darkMode
                                    ? "1px solid #BBBBBB"
                                    : "1px solid black",
                            }}
                        />
                        {InputProps?.endAdornment}
                    </Box>
                )}
            />
            <Button
                color="primary"
                startIcon={<TroubleshootIcon />}
                onClick={handleClick}
            >
                Thống kê
            </Button>
            <Button
                color="primary"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
            >
                Xóa dữ liệu
            </Button>
            <GridToolbarColumnsButton />
            <GridToolbarDensitySelector />
            <GridToolbarFilterButton />
            <Button
                color="primary"
                startIcon={<GetAppIcon />}
                onClick={handleExportXlsx}
            >
                Xuất Excel
            </Button>
        </GridToolbarContainer>
    );
}

StatisticalToolbar.propTypes = {
    setData: PropTypes.func.isRequired,
    data: PropTypes.array.isRequired,
};

export default memo(StatisticalToolbar);
