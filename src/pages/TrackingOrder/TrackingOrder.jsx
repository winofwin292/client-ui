import React, { memo, useState, useEffect } from "react";
import validator from "validator";
import { useSnackbar } from "notistack";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setLayout } from "context";

import DetailTrackingOrder from "./components/DetailTrackingOrder/DetailTrackingOrder";

import orderApi from "api/Order/orderApi";

function TrackingOrder() {
    // eslint-disable-next-line no-unused-vars
    const [controller, dispatch] = useMaterialUIController();

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const [phone, setPhone] = useState("");
    const [listResult, setListResult] = useState([]);
    const [result, setResult] = useState(false);

    const [orderDetail, setOrderDetail] = useState({
        open: false,
        id: null,
    });

    const showNoti = (msg, type) => {
        return enqueueSnackbar(msg, {
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
    };

    useEffect(() => {
        document.title = "Tra cứu đơn hàng";
    }, []);

    useEffect(() => {
        setLayout(dispatch, "needToKnow");
    }, [dispatch]);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!validator.isMobilePhone(phone, "vi-VN")) {
            showNoti("Vui lòng nhập số điện thoại hợp lệ!", "error");
            setPhone("");
            return;
        }
        const response = await orderApi.getByPhone({ phone });
        if (response.status === 200) {
            setListResult(response.data);
            setResult(true);
        } else {
            console.log(response.data);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            <>
                <div className="pt-2 relative">
                    <nav
                        aria-label="Top"
                        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
                    >
                        <div className="flex h-16 items-center">
                            <ol className="flex max-w-2xl items-center space-x-2 lg:max-w-7xl">
                                <li>
                                    <div className="flex items-center">
                                        <a
                                            href="/shop"
                                            className="mr-2 text-sm font-medium text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300"
                                        >
                                            Cửa hàng tài liệu
                                        </a>
                                        <svg
                                            width={16}
                                            height={20}
                                            viewBox="0 0 16 20"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            className="h-5 w-4 text-gray-300 dark:text-white"
                                        >
                                            <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                                        </svg>
                                    </div>
                                </li>
                                <li className="text-sm">
                                    <a
                                        href={"/shop/tracking"}
                                        aria-current="page"
                                        className="font-medium text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                                    >
                                        Tra cứu đơn hàng
                                    </a>
                                </li>
                            </ol>
                        </div>
                    </nav>
                </div>
                <div className="max-w-7xl px-4 pt-2 pb-4 sm:px-6 lg:px-8 lg:pt-2 lg:pb-4">
                    <div className="py-2 lg:pt-2 lg:pb-2 lg:ml-60">
                        <div className="max-w-2xl mx-auto">
                            <form className="flex items-center">
                                <label
                                    htmlFor="voice-search"
                                    className="sr-only"
                                >
                                    Tìm kiếm
                                </label>
                                <div className="relative w-full">
                                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                                        <svg
                                            className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        id="voice-search"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Số điện thoại..."
                                        required
                                        value={phone}
                                        onChange={(e) =>
                                            setPhone(e.target.value)
                                        }
                                    />
                                    <button
                                        type="button"
                                        className="flex absolute inset-y-0 right-0 items-center pr-3"
                                    >
                                        <svg
                                            className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    onClick={(e) => handleSearch(e)}
                                    className="inline-flex items-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    <svg
                                        className="mr-1 ml-1 w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        ></path>
                                    </svg>
                                </button>
                            </form>
                            {result ? (
                                <>
                                    {listResult.length > 0 ? (
                                        <table className="mt-4 min-w-full divide-y divide-gray-200 table-fixed dark:divide-gray-700">
                                            <thead className="bg-gray-100 dark:bg-gray-700">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="py-3 px-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                    >
                                                        Số điện thoại
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="py-3 px-6 text-sm font-bold tracking-wider text-left text-gray-700 uppercase dark:text-gray-400"
                                                    >
                                                        Ngày đặt hàng
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="p-4"
                                                    >
                                                        <span className="sr-only">
                                                            Edit
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                                {listResult.map(
                                                    (item, index) => (
                                                        <tr
                                                            key={index}
                                                            className="hover:bg-gray-100 dark:hover:bg-gray-700"
                                                        >
                                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {item.phone}
                                                            </td>
                                                            <td className="py-4 px-6 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                                {new Date(
                                                                    item.createdAt
                                                                ).toLocaleDateString(
                                                                    "en-GB"
                                                                )}
                                                            </td>

                                                            <td className="py-4 px-6 text-sm font-medium text-right whitespace-nowrap">
                                                                <button
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        setOrderDetail(
                                                                            {
                                                                                open: true,
                                                                                id: item.id,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="text-blue-600 dark:text-blue-500 hover:underline"
                                                                >
                                                                    Chi tiết
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p className="mt-5">
                                            Không tìm thấy kết quả
                                        </p>
                                    )}
                                </>
                            ) : (
                                <p className="mt-5">
                                    Vui lòng nhập số điện thoại để tìm kiếm đơn
                                    hàng.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </>
            <DetailTrackingOrder
                orderDetail={orderDetail}
                setOrderDetail={setOrderDetail}
            />
            <Footer />
        </div>
    );
}
export default memo(TrackingOrder);
