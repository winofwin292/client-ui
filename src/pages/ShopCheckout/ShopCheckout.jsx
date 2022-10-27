import React, { useState, memo, useEffect, useCallback } from "react";
import { RadioGroup } from "@headlessui/react";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";
import {
    SelectProvince,
    SelectDistrict,
    SelectCommune,
    getCommunePathWithType,
} from "vn-ad";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";

import { TrashIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import validator from "validator";

import { formatterVND } from "utils";

import deliveryMethodApi from "api/DeliveryMethod/deliveryMethodApi";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ShopCheckout() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [deliveryMethods, setDeliveryMethods] = useState([]);
    const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState({
        id: -1,
        name: "",
        turnaround_noi_thanh: "",
        turnaround_ngoai_tinh: "",
        price: "0",
    });
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("-1");
    const [district, setDistrict] = useState("-1");
    const [commune, setCommune] = useState("-1");

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

    const getData = useCallback(async () => {
        const response = await deliveryMethodApi.getAll();
        if (response.status === 200) {
            setDeliveryMethods(response.data);
        } else {
            setDeliveryMethods([]);
        }
    }, []);

    useEffect(() => {
        document.title = "Thanh toán";
        getData();
        const currCart = JSON.parse(localStorage.getItem("myCart")) || {
            cart: [],
        };
        const sumPrice = currCart.cart.reduce(
            (acc, o) => acc + parseInt(o.price),
            0
        );
        setProducts(currCart.cart);
        setSubtotal(sumPrice);
        setTax(sumPrice / 10);
        setTotal(sumPrice + sumPrice / 10 + 30000);
    }, [getData]);

    useEffect(() => {
        setTotal(subtotal + tax + parseInt(selectedDeliveryMethod.price));
    }, [selectedDeliveryMethod, subtotal, tax]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!firstName || !lastName) {
            showNoti("Vui lòng điền đầy đủ họ tên vào biểu mẫu", "error");
            return;
        }

        if (!phoneNumber) {
            showNoti("Số điện thoại chưa điền hoặc không hợp lệ", "error");
            return;
        }

        if (!email) {
            showNoti("Email chưa được điền hoặc không hợp lệ", "error");
            return;
        }

        if (!address) {
            showNoti("Vui lòng điền địa chỉ chính xác vào biểu mẫu", "error");
            return;
        }

        if (!city || city === "-1") {
            showNoti("Vui lòng chọn tỉnh/thành phố", "error");
            return;
        }

        if (!district || district === "-1") {
            showNoti("Vui lòng chọn quận/huyện", "error");
            return;
        }

        if (!commune || commune === "-1") {
            showNoti("Vui lòng chọn xã/phường", "error");
            return;
        }

        if (!validator.isMobilePhone(phoneNumber, "vi-VN")) {
            showNoti("Vui lòng nhập số điện thoại hợp lệ!", "error");
            setPhoneNumber("");
            return;
        }

        if (!validator.isEmail(email)) {
            showNoti("Vui lòng nhập email hợp lệ!", "error");
            setEmail("");
            return;
        }

        if (selectedDeliveryMethod.id === -1) {
            showNoti("Vui lòng chọn phương thức vận chuyển", "error");
            return;
        }

        try {
            const data = {
                firstName,
                lastName,
                phoneNumber,
                email,
                address,
                dc: getCommunePathWithType(commune),
                products,
                selectedDeliveryMethod,
                subtotal,
                total,
            };
            console.log(data);

            showNoti("Đặt hàng thành công", "success");
        } catch {
            showNoti("Lỗi: không thể đặt hàng", "error");
        }
    };

    const handleRemove = (e, index) => {
        e.preventDefault();
        try {
            let newProductList = [...products];
            newProductList.splice(index, 1);
            localStorage.setItem(
                "myCart",
                JSON.stringify({
                    cart: newProductList,
                })
            );

            const sumPrice = newProductList.reduce(
                (acc, o) => acc + parseInt(o.price),
                0
            );
            setProducts(newProductList);
            setSubtotal(sumPrice);
            setTax(sumPrice / 10);
            showNoti("Đã xóa 1 sản phẩm khỏi giỏ hàng", "success");
        } catch {
            showNoti("Lỗi: không xóa được sản phẩm", "error");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
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
                                    href={"/shop/checkout"}
                                    aria-current="page"
                                    className="font-medium text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                                >
                                    Thanh toán
                                </a>
                            </li>
                        </ol>
                    </div>
                </nav>
            </div>
            <main className="max-w-7xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-none">
                    <h1 className="sr-only">Đặt hàng</h1>

                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Thông tin liên hệ
                                </h2>
                                {/* email */}
                                <div className="mt-4">
                                    <label
                                        htmlFor="email-address"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Địa chỉ email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            id="email-address"
                                            name="email-address"
                                            autoComplete="email"
                                            className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                {/* phoneNumber */}
                                <div className="mt-4">
                                    <label
                                        htmlFor="email-address"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Số điện thoại
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="number-phone"
                                            name="number-phone"
                                            autoComplete="tel"
                                            className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            value={phoneNumber}
                                            onChange={(e) =>
                                                setPhoneNumber(e.target.value)
                                            }
                                            maxLength="10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-gray-200 dark:border-gray-500 pt-10">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Thông tin nhận hàng
                                </h2>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {/* Họ */}
                                    <div>
                                        <label
                                            htmlFor="last-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Họ
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="last-name"
                                                name="last-name"
                                                // autoComplete="family-name"
                                                autoComplete="given-name"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* Tên */}
                                    <div>
                                        <label
                                            htmlFor="first-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Tên
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="first-name"
                                                name="first-name"
                                                // autoComplete="given-name"
                                                autoComplete="family-name"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* Địa chỉ */}
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Địa chỉ
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                // autoComplete="street-address"
                                                autoComplete="address-level3"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Tỉnh / Thành phố
                                        </label>
                                        <div className="mt-1">
                                            <SelectProvince
                                                type="text"
                                                name="city"
                                                id="city"
                                                // autoComplete="address-level1"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={city}
                                                onChange={setCity}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="district"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Quận / Huyện
                                        </label>
                                        <div className="mt-1">
                                            <SelectDistrict
                                                type="text"
                                                name="district"
                                                id="district"
                                                // autoComplete="address-level2"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={district}
                                                onChange={setDistrict}
                                                province={city}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="commune"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Phường / Xã
                                        </label>
                                        <div className="mt-1">
                                            <SelectCommune
                                                type="text"
                                                name="commune"
                                                id="commune"
                                                // autoComplete="address-level3"
                                                autoComplete="street-address"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={commune}
                                                onChange={setCommune}
                                                district={district}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-gray-200 dark:border-gray-500 pt-10">
                                <RadioGroup
                                    value={selectedDeliveryMethod}
                                    onChange={setSelectedDeliveryMethod}
                                >
                                    <RadioGroup.Label className="text-lg font-medium text-gray-900 dark:text-white">
                                        Phương thức vận chuyển
                                    </RadioGroup.Label>

                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        {deliveryMethods.length > 0 ? (
                                            <>
                                                {deliveryMethods.map(
                                                    (deliveryMethod) => (
                                                        <RadioGroup.Option
                                                            key={
                                                                deliveryMethod.id
                                                            }
                                                            value={
                                                                deliveryMethod
                                                            }
                                                            className={({
                                                                checked,
                                                                active,
                                                            }) =>
                                                                classNames(
                                                                    checked
                                                                        ? "border-transparent"
                                                                        : "border-gray-300 dark:border-gray-500",
                                                                    active
                                                                        ? "ring-2 ring-indigo-500"
                                                                        : "",
                                                                    "relative bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none"
                                                                )
                                                            }
                                                        >
                                                            {({
                                                                checked,
                                                                active,
                                                            }) => (
                                                                <>
                                                                    <div className="flex-1 flex">
                                                                        <div className="flex flex-col">
                                                                            <RadioGroup.Label
                                                                                as="span"
                                                                                className="block text-sm font-medium text-gray-900 dark:text-gray-200"
                                                                            >
                                                                                {
                                                                                    deliveryMethod.name
                                                                                }
                                                                            </RadioGroup.Label>
                                                                            <RadioGroup.Description
                                                                                as="span"
                                                                                className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400"
                                                                            >
                                                                                {
                                                                                    deliveryMethod.turnaround_noi_thanh
                                                                                }
                                                                                &nbsp;(nội
                                                                                ô)
                                                                            </RadioGroup.Description>
                                                                            <RadioGroup.Description
                                                                                as="span"
                                                                                className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400"
                                                                            >
                                                                                {
                                                                                    deliveryMethod.turnaround_ngoai_tinh
                                                                                }
                                                                                &nbsp;(ngoại
                                                                                tỉnh)
                                                                            </RadioGroup.Description>
                                                                            <RadioGroup.Description
                                                                                as="span"
                                                                                className="mt-6 text-sm font-medium text-gray-900 dark:text-white"
                                                                            >
                                                                                {formatterVND.format(
                                                                                    deliveryMethod.price
                                                                                )}
                                                                            </RadioGroup.Description>
                                                                        </div>
                                                                    </div>
                                                                    {checked ? (
                                                                        <CheckCircleIcon
                                                                            className="h-5 w-5 text-indigo-600"
                                                                            aria-hidden="true"
                                                                        />
                                                                    ) : null}
                                                                    <div
                                                                        className={classNames(
                                                                            active
                                                                                ? "border"
                                                                                : "border-2",
                                                                            checked
                                                                                ? "border-indigo-500"
                                                                                : "border-transparent",
                                                                            "absolute -inset-px rounded-lg pointer-events-none"
                                                                        )}
                                                                        aria-hidden="true"
                                                                    />
                                                                </>
                                                            )}
                                                        </RadioGroup.Option>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                Tổng quan đơn hàng
                            </h2>

                            <div className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-500 rounded-lg shadow-sm">
                                <h3 className="sr-only">
                                    Các sản phẩm trong giỏ hàng
                                </h3>
                                <ul className="divide-y divide-gray-200 dark:divide-gray-500">
                                    {products.map((product, index) => (
                                        <li
                                            key={index}
                                            className="flex py-6 px-4 sm:px-6"
                                        >
                                            <div className="flex-shrink-0 h-20 w-20 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={
                                                        product.ProductImage[0]
                                                            .url
                                                    }
                                                    alt={
                                                        product.ProductImage[0]
                                                            .name
                                                    }
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-6 flex-1 flex flex-col">
                                                <div className="flex">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className="text-sm">
                                                            <a
                                                                href={
                                                                    "/shop/" +
                                                                    product.id
                                                                }
                                                                className="font-medium text-gray-700 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-400"
                                                            >
                                                                {product.name}
                                                            </a>
                                                        </h4>
                                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                            {product.author}
                                                        </p>
                                                    </div>

                                                    <div className="ml-4 flex-shrink-0 flow-root">
                                                        <button
                                                            type="button"
                                                            className="-m-2.5 bg-white dark:bg-gray-900 p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
                                                            onClick={(e) =>
                                                                handleRemove(
                                                                    e,
                                                                    index
                                                                )
                                                            }
                                                        >
                                                            <span className="sr-only">
                                                                Xoá khỏi giỏ
                                                                hàng
                                                            </span>
                                                            <TrashIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex-1 pt-2 flex items-end justify-between">
                                                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-200">
                                                        {formatterVND.format(
                                                            product.price
                                                        )}
                                                    </p>

                                                    {/* <div className="ml-4">
                                                        <label
                                                            htmlFor="quantity"
                                                            className="sr-only"
                                                        >
                                                            Quantity
                                                        </label>
                                                        <select
                                                            id="quantity"
                                                            name="quantity"
                                                            className="rounded-md border border-gray-300 text-base font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                        >
                                                            <option value={1}>
                                                                1
                                                            </option>
                                                            <option value={2}>
                                                                2
                                                            </option>
                                                            <option value={3}>
                                                                3
                                                            </option>
                                                            <option value={4}>
                                                                4
                                                            </option>
                                                            <option value={5}>
                                                                5
                                                            </option>
                                                            <option value={6}>
                                                                6
                                                            </option>
                                                            <option value={7}>
                                                                7
                                                            </option>
                                                            <option value={8}>
                                                                8
                                                            </option>
                                                        </select>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <dl className="border-t border-gray-200 dark:border-gray-500 py-6 px-4 space-y-6 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            Tổng giá tiền sản phẩm
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(subtotal)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            Phí vận chuyển
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(
                                                parseInt(
                                                    selectedDeliveryMethod.price
                                                )
                                            )}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            Thuế (10% tổng giá trị sản phẩm)
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(tax)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-500 pt-6">
                                        <dt className="text-base font-medium dark:text-gray-200">
                                            Thành tiền
                                        </dt>
                                        <dd className="text-base font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(total)}
                                        </dd>
                                    </div>
                                </dl>

                                <div className="border-t border-gray-200 dark:border-gray-500 py-6 px-4 sm:px-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-indigo-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                        onClick={(e) => handleSubmit(e)}
                                    >
                                        Xác nhận đặt hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default memo(ShopCheckout);
