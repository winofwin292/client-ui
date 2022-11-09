import React, { memo, useMemo } from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDComponents/MDBox";
import MDTypography from "components/MDComponents/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "components/MDComponents/examples/Timeline/TimelineItem";

function NewOrders(props) {
    const colors = useMemo(
        () => ["success", "error", "info", "warning", "primary"],
        []
    );
    return (
        <Card sx={{ height: "100%" }}>
            <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                    Đơn hàng mới
                </MDTypography>
            </MDBox>
            <MDBox p={2}>
                {props.newOrders.length > 0 ? (
                    <>
                        {props.newOrders.map((item, index) => (
                            <TimelineItem
                                key={index}
                                color={colors[index]}
                                icon="inventory_2"
                                title={"Đơn hàng mới của " + item.name}
                                dateTime={item.createAt}
                                lastItem={index === props.newOrders.length - 1}
                            />
                        ))}
                    </>
                ) : (
                    <MDBox pt={1} px={1}>
                        <MDTypography variant="body2">
                            Chúc mừng, bạn đã xử lí hết tất cả các đơn hàng đang
                            chờ xác nhận!!!
                        </MDTypography>
                    </MDBox>
                )}
            </MDBox>
        </Card>
    );
}

export default memo(NewOrders);
