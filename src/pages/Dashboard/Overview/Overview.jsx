import React, { memo, useEffect, useCallback, useState, useMemo } from "react";

// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/MDComponents/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/MDComponents/examples/Navbars/DashboardNavbar";
import Footer from "components/MDComponents/examples/Footer";
import ComplexStatisticsCard from "components/MDComponents/examples/Cards/StatisticsCards/ComplexStatisticsCard";
import VerticalBarChart from "components/MDComponents/examples/Charts/BarCharts/VerticalBarChart";

// Dashboard components
import NewOrders from "pages/Dashboard/Overview/components/NewOrders/NewOrders";
import TopOrder from "./components/TopOrder/TopOrder";

import overviewApi from "api/Overview/overviewApi";

function Overview() {
    const [countProduct, setCountProduct] = useState({
        count: "",
        countShow: 0,
    });
    const [countCourse, setCountCourse] = useState({ count: "", countShow: 0 });
    const [countUser, setCountUser] = useState({ count: "", countDisabled: 0 });
    const [countOrder, setCountOrder] = useState({
        count: "",
        countWithTime: 0,
    });
    const [dataChart, setDataChart] = useState([]);
    const labelChart = useMemo(
        () => [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
        ],
        []
    );
    const [dataTable, setDataTable] = useState([]);
    const [newOrders, setNewOrders] = useState([]);

    const getData = useCallback(async () => {
        const toDate = new Date();

        const firstDay = new Date(
            toDate.getFullYear(),
            toDate.getMonth() - 1,
            1
        );

        const lastDay = new Date(
            toDate.getFullYear(),
            toDate.getMonth() + 1,
            0,
            22,
            59,
            59
        );

        const firstDateOfYear = new Date(toDate.getFullYear(), 0, 1);
        const lastDateOfYear = new Date(
            toDate.getFullYear(),
            11,
            31,
            23,
            59,
            59
        );
        const response = await overviewApi.getData({
            startDate: firstDay,
            endDate: lastDay,
            startDateOfYear: firstDateOfYear,
            endDateOfYear: lastDateOfYear,
        });
        setCountProduct(response.data.product);
        setCountCourse(response.data.course);
        setCountUser(response.data.user);
        setCountOrder(response.data.order);
        const temp = response.data.orderTotal.map((item) => parseInt(item));
        setDataChart(temp);
        setDataTable(response.data.orderTop);
        setNewOrders(response.data.orderNew);
    }, []);

    useEffect(() => {
        document.title = "Tổng quan";
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox py={3}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="dark"
                                icon="weekend"
                                title="Khóa học"
                                count={countCourse.count}
                                percentage={{
                                    color: "info",
                                    amount: countCourse.countShow,
                                    label: "khóa học đang hiển thị",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                icon="inventory_2"
                                title="Sản phẩm"
                                count={countProduct.count}
                                percentage={{
                                    color: "info",
                                    amount: countProduct.countShow,
                                    label: "sản phẩm đang hiển thị",
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="success"
                                icon="store"
                                title={"Tổng số đơn hàng"}
                                count={countOrder.count}
                                percentage={{
                                    color: "success",
                                    amount: "+" + countOrder.countWithTime,
                                    label:
                                        "đơn hàng trong tháng " +
                                        (new Date().getMonth() + 1).toString(),
                                }}
                            />
                        </MDBox>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <MDBox mb={1.5}>
                            <ComplexStatisticsCard
                                color="primary"
                                icon="person_add"
                                title="Người dùng"
                                count={countUser.count}
                                percentage={{
                                    color: "error",
                                    amount: countUser.countDisabled,
                                    label: "bị khóa",
                                }}
                            />
                        </MDBox>
                    </Grid>
                </Grid>
                {/* Chart here */}
                <MDBox>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sx={{ mt: 3 }}>
                            <VerticalBarChart
                                icon={{
                                    color: "info",
                                    component: "leaderboard",
                                }}
                                title="Doanh thu theo tháng"
                                description="Tổng doanh thu của từng tháng trong năm"
                                chart={{
                                    labels: labelChart,
                                    datasets: [
                                        {
                                            label: "Tổng doanh thu",
                                            color: "info",
                                            data: dataChart,
                                        },
                                    ],
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={8}>
                            <TopOrder
                                countOrder={countOrder}
                                dataTable={dataTable}
                            />
                        </Grid>
                        <Grid item xs={12} md={6} lg={4}>
                            <NewOrders newOrders={newOrders} />
                        </Grid>
                    </Grid>
                </MDBox>
            </MDBox>
            <Footer />
        </DashboardLayout>
    );
}

export default memo(Overview);
