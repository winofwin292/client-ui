import { RenderCellExpand } from "components/common/RenderCellExpand";

export const rCDGcolumns = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "full_name",
        headerName: "Họ tên",
        width: 180,
        renderCell: RenderCellExpand,
    },
    { field: "phone", headerName: "SĐT", width: 120 },
    {
        field: "email",
        headerName: "Email",
        width: 300,
        renderCell: RenderCellExpand,
    },
    {
        field: "note",
        headerName: "Ghi chú",
        width: 150,
        renderCell: RenderCellExpand,
    },
    {
        field: "subject",
        headerName: "Chủ đề",
        width: 150,
        renderCell: RenderCellExpand,
    },
    {
        field: "createdAt",
        headerName: "Ngày gửi",
        type: "date",
        width: 120,
        valueFormatter: (params) => {
            if (params.value == null) {
                return "";
            }

            const valueFormatted = new Date(params.value).toLocaleDateString(
                "en-GB"
            );
            return valueFormatted;
        },
    },
    {
        field: "isContact",
        headerName: "Trạng thái",
        width: 100,
        editable: true,
        type: "boolean",
        // valueFormatter: (params) => {
        //     if (params.value == null) {
        //         return "";
        //     }

        //     const valueFormatted = params.value ? "Đã liên hệ" : "Chưa liên hệ";
        //     return valueFormatted;
        // },
    },
];
