import React, { useState, memo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import validator from "validator";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { TrashIcon } from "@heroicons/react/24/solid";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ScrollTopButton } from "components/common/ScrollTopButton";

import { formatterVND } from "utils";

import orderApi from "api/Order/orderApi";
import ghnApi from "api/GHN/ghnApi";
import productApi from "api/Product/productApi";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ShopCheckout() {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [shippingFee, setShippingFee] = useState(0);
    const [totalWeight, setTotalWeight] = useState(0);
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [tax, setTax] = useState(0);
    const [total, setTotal] = useState(0);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [province, setProvince] = useState("-1");
    const [provinceName, setProvinceName] = useState("");
    const [district, setDistrict] = useState("-1");
    const [districtName, setDistrictName] = useState("");
    const [ward, setWard] = useState("-1");
    const [wardName, setWardName] = useState("");

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [service, setService] = useState({
        id: "-1",
        name: "",
    });
    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const showNoti = useCallback(
        (msg, type) => {
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
        },
        [closeSnackbar, enqueueSnackbar]
    );

    const getData = useCallback(async () => {
        const response = await productApi.getAll();
        if (response.status === 200) {
            const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                cart: [],
            };
            const sumPrice = currCart.cart.reduce(
                (acc, o) => acc + o.price * o.quantity,
                0
            );
            const sumWeight = currCart.cart.reduce(
                (acc, o) => acc + o.weight * o.quantity,
                0
            );

            currCart.cart.forEach((itemInCart) => {
                const product = response.data.find(
                    (itemInProduct) => itemInProduct.id === itemInCart.id
                );
                if (product) {
                    itemInCart.in_stock = product.in_stock;
                }
            });

            setTotalWeight(sumWeight);
            setProducts(currCart.cart);
            setSubtotal(sumPrice);
            setTax(sumPrice / 10);
            setTotal(sumPrice + sumPrice / 10);
        } else {
            showNoti("L???i: kh??ng l???y ???????c th??ng tin");
        }
    }, [showNoti]);

    const getProvinces = useCallback(async () => {
        const response = await ghnApi.getProvince();
        setProvinces(response.data);
    }, []);

    useEffect(() => {
        getProvinces();
    }, [getProvinces]);

    useEffect(() => {
        document.title = "Thanh to??n";
        getData();
    }, [getData]);

    useEffect(() => {
        setTotal(subtotal + tax + shippingFee);
    }, [subtotal, tax, shippingFee, totalWeight]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (products.length <= 0) {
            showNoti("Gi??? h??ng tr???ng, kh??ng th??? thanh to??n", "error");
            return;
        }

        if (!email) {
            showNoti("Email ch??a ???????c ??i???n!", "error");
            return;
        }

        if (!phoneNumber) {
            showNoti("S??? ??i???n tho???i ch??a ??i???n!", "error");
            return;
        }

        if (!validator.isMobilePhone(phoneNumber, "vi-VN")) {
            showNoti("Vui l??ng nh???p s??? ??i???n tho???i h???p l???!", "error");
            setPhoneNumber("");
            return;
        }

        if (!validator.isEmail(email)) {
            showNoti("Vui l??ng nh???p email h???p l???!", "error");
            setEmail("");
            return;
        }

        if (!firstName || !lastName) {
            showNoti("Vui l??ng ??i???n ?????y ????? h??? t??n v??o bi???u m???u", "error");
            return;
        }

        if (!address) {
            showNoti("Vui l??ng ??i???n ?????a ch??? ch??nh x??c v??o bi???u m???u", "error");
            return;
        }

        if (!province || province === "-1") {
            showNoti("Vui l??ng ch???n t???nh/th??nh ph???", "error");
            return;
        }

        if (!district || district === "-1") {
            showNoti("Vui l??ng ch???n qu???n/huy???n", "error");
            return;
        }

        if (!ward || ward === "-1") {
            showNoti("Vui l??ng ch???n x??/ph?????ng", "error");
            return;
        }

        if (!service.id || service.id === "-1") {
            showNoti("Vui l??ng ch???n lo???i d???ch v??? v???n chuy???n", "error");
            return;
        }

        for (let i = 0; i < products.length; i++) {
            if (products[i].quantity > products[i].in_stock) {
                showNoti(
                    "S??? l?????ng c???a s???n ph???m " +
                        products[i].name +
                        " l???n h??n s??? l?????ng trong kho",
                    "error"
                );
                return;
            }
        }

        const productList = products.map((item) => ({
            id: item.id,
            price: item.price,
            quantity: item.quantity,
            in_stock: item.in_stock - item.quantity,
        }));

        const data = {
            first_name: firstName,
            last_name: lastName,
            phone: phoneNumber,
            email,
            address: address,
            sub_total: subtotal,
            tax,
            total,
            ward: wardName,
            district: districtName,
            province: provinceName,
            orderStatusId: 1,
            products: productList,
            total_fee: shippingFee,
            service_id: parseInt(service.id),
            service_name: service.name,
        };

        console.log(data);

        setLoading(true);

        const response = await orderApi.add(data);
        if (response.status === 200) {
            setLoading(false);
            showNoti("?????t h??ng th??nh c??ng", "success");
            localStorage.setItem(
                "myCart",
                JSON.stringify({
                    cart: [],
                })
            );
            navigate("/shop");
        } else {
            setLoading(false);
            showNoti("L???i: kh??ng th??? ?????t h??ng", "error");
        }
    };

    const handleRemove = (e, index, price, quantity, weight) => {
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

            setProducts(newProductList);
            setSubtotal((prev) => prev - price * quantity);
            setTax((subtotal - price * quantity) / 10);
            setTotalWeight((prev) => prev - weight * quantity);
            showNoti("???? x??a s???n ph???m kh???i gi??? h??ng", "success");
        } catch {
            showNoti("L???i: kh??ng x??a ???????c s???n ph???m", "error");
        }
    };

    const handleAdd = (e, id, price, weight) => {
        e.preventDefault();
        let newProductList = [...products];
        newProductList.forEach((product) => {
            if (product.id === id) {
                product.quantity++;
            }
        });
        setProducts(newProductList);
        localStorage.setItem(
            "myCart",
            JSON.stringify({
                cart: newProductList,
            })
        );
        setTotalWeight((prev) => prev + weight);
        setSubtotal((prev) => prev + price);
        setTax((subtotal + price) / 10);
    };

    const handleSub = (e, id, price, weight) => {
        e.preventDefault();
        let newProductList = [...products];
        newProductList.forEach((product) => {
            if (product.id === id) {
                product.quantity--;
            }
        });
        setProducts(newProductList);
        localStorage.setItem(
            "myCart",
            JSON.stringify({
                cart: newProductList,
            })
        );
        setTotalWeight((prev) => prev - weight);
        setSubtotal((prev) => prev - price);
        setTax((subtotal - price) / 10);
    };

    const handleChangeProvince = async (e) => {
        setProvince(e.target.value);
        const index = e.nativeEvent.target.selectedIndex;
        const label = e.nativeEvent.target[index].text;
        setProvinceName(label);
        const response = await ghnApi.getDistrict({
            provinceId: parseInt(e.target.value),
        });
        setDistricts(response.data);
        setWard(-1);
        setService({
            id: "-1",
            name: "",
        });
    };

    const handleChangeDistrict = async (e) => {
        setDistrict(e.target.value);
        const index = e.nativeEvent.target.selectedIndex;
        const label = e.nativeEvent.target[index].text;
        setDistrictName(label);
        const response = await ghnApi.getWard({
            districtId: parseInt(e.target.value),
        });
        setWards(response.data);
        setService({
            id: "-1",
            name: "",
        });
    };

    const handleChangeWard = async (e) => {
        setWard(e.target.value);
        const index = e.nativeEvent.target.selectedIndex;
        const label = e.nativeEvent.target[index].text;

        const responseForSelect = await orderApi.getServices({
            districtId: district,
        });
        if (responseForSelect.status === 200)
            setServices(responseForSelect.data);
        else setServices([]);

        setWardName(label);
        setService({
            id: "-1",
            name: "",
        });
    };

    const handleChangeServices = async (e) => {
        const index = e.nativeEvent.target.selectedIndex;
        const label = e.nativeEvent.target[index].text;

        setService({
            id: e.target.value,
            name: label,
        });

        const productList = products.map((item) => ({
            weight: item.weight,
            width: item.width,
            height: item.height,
            length: item.length,
            quantity: item.quantity,
        }));

        const response = await orderApi.getFee({
            service_id: parseInt(e.target.value),
            district_id: district,
            ward_code: ward,
            products: productList,
            sub_total: subtotal,
        });
        if (response.status === 200) {
            setShippingFee(response.data.fee);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
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
                                        C???a h??ng t??i li???u
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
                                    Thanh to??n
                                </a>
                            </li>
                        </ol>
                    </div>
                </nav>
            </div>
            <main className="max-w-7xl mx-auto pt-8 pb-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto lg:max-w-none">
                    <h1 className="sr-only">?????t h??ng</h1>

                    <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                        <div>
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Th??ng tin li??n h???:
                                </h2>
                                {/* email */}
                                <div className="mt-4">
                                    <label
                                        htmlFor="email-address"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        ?????a ch??? email: (
                                        <span className="text-red-500">*</span>)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            id="email-address"
                                            name="email-address"
                                            autoComplete="email"
                                            className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            placeholder="Nh???p ?????a ch??? email"
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
                                        S??? ??i???n tho???i:(
                                        <span className="text-red-500">*</span>)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="number-phone"
                                            name="number-phone"
                                            autoComplete="tel"
                                            className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            placeholder="Nh???p s??? ??i???n tho???i"
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
                                    Th??ng tin nh???n h??ng:
                                </h2>

                                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    {/* H??? */}
                                    <div>
                                        <label
                                            htmlFor="last-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            H???: (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="last-name"
                                                name="last-name"
                                                // autoComplete="family-name"
                                                autoComplete="given-name"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                placeholder="Nh???p h???, l??t"
                                                value={lastName}
                                                onChange={(e) =>
                                                    setLastName(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* T??n */}
                                    <div>
                                        <label
                                            htmlFor="first-name"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            T??n:(
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                id="first-name"
                                                name="first-name"
                                                // autoComplete="given-name"
                                                autoComplete="family-name"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                placeholder="Nh???p t??n"
                                                value={firstName}
                                                onChange={(e) =>
                                                    setFirstName(e.target.value)
                                                }
                                            />
                                        </div>
                                    </div>
                                    {/* ?????a ch??? */}
                                    <div className="sm:col-span-2">
                                        <label
                                            htmlFor="address"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            ?????a ch???:(
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="text"
                                                name="address"
                                                id="address"
                                                // autoComplete="street-address"
                                                autoComplete="address-level3"
                                                className="form-input block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                placeholder="S??? nh??, ???????ng, ???p, t???, khu d??n c??,..."
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
                                            T???nh / Th??nh ph???:(
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                type="text"
                                                name="city"
                                                id="city"
                                                // autoComplete="address-level1"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={province}
                                                onChange={(e) =>
                                                    handleChangeProvince(e)
                                                }
                                            >
                                                <option value="-1">
                                                    Ch???n t???nh/th??nh ph???
                                                </option>
                                                {provinces.map(
                                                    (item, index) => (
                                                        <option
                                                            key={index}
                                                            value={
                                                                item.ProvinceID
                                                            }
                                                        >
                                                            {item.ProvinceName}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="district"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Qu???n / Huy???n: (
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                type="text"
                                                name="district"
                                                id="district"
                                                // autoComplete="address-level2"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={district}
                                                onChange={(e) =>
                                                    handleChangeDistrict(e)
                                                }
                                            >
                                                <option value="-1">
                                                    Ch???n qu???n/huy???n
                                                </option>
                                                {province === "-1" ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        {districts.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.DistrictID
                                                                    }
                                                                >
                                                                    {
                                                                        item.DistrictName
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="commune"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                        >
                                            Ph?????ng / X??:(
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            )
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                type="text"
                                                name="ward"
                                                id="ward"
                                                // autoComplete="address-level3"
                                                autoComplete="street-address"
                                                className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                                value={ward}
                                                onChange={(e) =>
                                                    handleChangeWard(e)
                                                }
                                            >
                                                <option value="-1">
                                                    Ch???n x??/ph?????ng
                                                </option>
                                                {district === "-1" ? (
                                                    ""
                                                ) : (
                                                    <>
                                                        {wards.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item.WardCode
                                                                    }
                                                                >
                                                                    {
                                                                        item.WardName
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 border-t border-gray-200 dark:border-gray-500 pt-10">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    V???n chuy???n:
                                </h2>
                                {/* ????n v??? v???n chuy???n */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        Lo???i d???ch v???:(
                                        <span className="text-red-500">*</span>
                                        )( Vui l??ng ch???n ?????a ch??? tr?????c khi ch???n
                                        lo???i d???ch v??? )
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            type="text"
                                            name="services"
                                            id="services"
                                            // autoComplete="address-level1"
                                            className="form-select block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
                                            value={service.id}
                                            onChange={(e) =>
                                                handleChangeServices(e)
                                            }
                                        >
                                            <option value="-1">
                                                Ch???n lo???i d???ch v???
                                            </option>
                                            {services.map((item, index) => (
                                                <option
                                                    key={index}
                                                    value={item.service_id}
                                                >
                                                    {item.short_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order summary */}
                        <div className="mt-10 lg:mt-0">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                T???ng quan ????n h??ng:
                            </h2>

                            <div className="mt-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-500 rounded-lg shadow-sm">
                                <h3 className="sr-only">
                                    C??c s???n ph???m trong gi??? h??ng
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
                                                            Kho: &nbsp;
                                                            {product.in_stock}
                                                        </p>
                                                    </div>

                                                    <div className="ml-4 flex-shrink-0 flow-root">
                                                        <button
                                                            type="button"
                                                            className="-m-2.5 bg-white dark:bg-gray-900 p-2.5 flex items-center justify-center text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-400"
                                                            onClick={(e) =>
                                                                handleRemove(
                                                                    e,
                                                                    index,
                                                                    product.price,
                                                                    product.quantity,
                                                                    product.weight
                                                                )
                                                            }
                                                        >
                                                            <span className="sr-only">
                                                                Xo?? kh???i gi???
                                                                h??ng
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

                                                    <div className="ml-4">
                                                        <div className=" custom-number-input w-24">
                                                            <div className="flex flex-row h-8 w-full rounded-lg relative bg-transparent mt-1">
                                                                <button
                                                                    data-action="decrement"
                                                                    className=" bg-white  text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-l cursor-pointer outline-none dark:bg-gray-300 border"
                                                                    disabled={
                                                                        product.quantity <=
                                                                        1
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleSub(
                                                                            e,
                                                                            product.id,
                                                                            product.price,
                                                                            product.weight
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="m-auto text-2xl font-thin">
                                                                        ???
                                                                    </span>
                                                                </button>
                                                                <input
                                                                    type="number"
                                                                    className={classNames(
                                                                        product.quantity >
                                                                            product.in_stock
                                                                            ? "text-red-500 hover:text-red-500"
                                                                            : "",
                                                                        "outline-none focus:outline-none text-center w-full bg-white font-semibold text-md hover:text-black focus:text-black  md:text-basecursor-default flex items-center text-gray-700 dark:bg-gray-200 border-y"
                                                                    )}
                                                                    name="custom-input-number"
                                                                    value={
                                                                        product.quantity
                                                                    }
                                                                    disabled
                                                                ></input>
                                                                <button
                                                                    data-action="increment"
                                                                    className="bg-white  text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-20 rounded-r cursor-pointer dark:bg-gray-300 border"
                                                                    onClick={(
                                                                        e
                                                                    ) =>
                                                                        handleAdd(
                                                                            e,
                                                                            product.id,
                                                                            product.price,
                                                                            product.weight
                                                                        )
                                                                    }
                                                                >
                                                                    <span className="m-auto text-2xl font-thin">
                                                                        +
                                                                    </span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <dl className="border-t border-gray-200 dark:border-gray-500 py-6 px-4 space-y-6 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            T???ng gi?? ti???n s???n ph???m
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(subtotal)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            Ph?? v???n chuy???n
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(shippingFee)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm dark:text-gray-200">
                                            Thu??? (10% t???ng gi?? tr??? s???n ph???m)
                                        </dt>
                                        <dd className="text-sm font-medium text-gray-900 dark:text-gray-200">
                                            {formatterVND.format(tax)}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-500 pt-6">
                                        <dt className="text-base font-medium dark:text-gray-200">
                                            Th??nh ti???n
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
                                        X??c nh???n ?????t h??ng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer />
            <ScrollTopButton />
        </div>
    );
}

export default memo(ShopCheckout);
