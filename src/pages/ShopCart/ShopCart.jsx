import React, { Fragment, useState, useEffect, memo, useCallback } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import productApi from "api/Product/productApi";

import { formatterVND } from "utils";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ShopCart(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

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
        const response = await productApi.getAll();
        if (response.status === 200) {
            const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                cart: [],
            };
            const sumPrice = currCart.cart.reduce(
                (acc, o) => acc + o.price * o.quantity,
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

            setProducts(currCart.cart);
            setSubtotal(sumPrice);
        } else {
            showNoti("Lỗi: không lấy được thông tin");
        }
    }, [showNoti]);

    useEffect(() => {
        getData();
    }, [props.cartOpen, getData]);

    const handleRemove = (e, index, price, quantity) => {
        e.preventDefault();
        try {
            let newProductList = [...products];
            newProductList.splice(index, 1);
            setProducts(newProductList);
            localStorage.setItem(
                "myCart",
                JSON.stringify({
                    cart: newProductList,
                })
            );
            props.setCountCart((prev) => prev - quantity);
            setSubtotal((prev) => prev - price * quantity);
            showNoti("Đã xóa sản phẩm khỏi giỏ hàng", "success");
        } catch {
            showNoti("Lỗi: không xóa được sản phẩm", "error");
        }
    };

    const handleAdd = (e, id, price) => {
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
        props.setCountCart((prev) => prev + 1);
        setSubtotal((prev) => prev + price);
    };

    const handleSub = (e, id, price) => {
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
        props.setCountCart((prev) => prev - 1);
        setSubtotal((prev) => prev - price);
    };

    return (
        <>
            <Transition.Root show={props.cartOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-20"
                    onClose={props.setCartOpen}
                >
                    <Transition.Child
                        as={Fragment}
                        enter="ease-in-out duration-500"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in-out duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-hidden">
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                                <Transition.Child
                                    as={Fragment}
                                    enter="transform transition ease-in-out duration-500 sm:duration-700"
                                    enterFrom="translate-x-full"
                                    enterTo="translate-x-0"
                                    leave="transform transition ease-in-out duration-500 sm:duration-700"
                                    leaveFrom="translate-x-0"
                                    leaveTo="translate-x-full"
                                >
                                    <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                        <div className="flex h-full flex-col overflow-y-scroll bg-white dark:bg-gray-900 shadow-xl">
                                            <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                                <div className="flex items-start justify-between">
                                                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                        Giỏ hàng
                                                    </Dialog.Title>
                                                    <div className="ml-3 flex h-7 items-center">
                                                        <button
                                                            type="button"
                                                            className="-m-2 p-2 text-gray-400 hover:text-gray-500 dark:text-white"
                                                            onClick={() =>
                                                                props.setCartOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            <span className="sr-only">
                                                                Đóng
                                                            </span>
                                                            <XMarkIcon
                                                                className="h-6 w-6"
                                                                aria-hidden="true"
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Danh sách hàng */}
                                                <div className="mt-8">
                                                    <div className="flow-root">
                                                        <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-600">
                                                            {products.length >
                                                            0 ? (
                                                                <>
                                                                    {products.map(
                                                                        (
                                                                            product,
                                                                            index
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    index
                                                                                }
                                                                                className="flex py-6"
                                                                            >
                                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                                    <img
                                                                                        src={
                                                                                            product
                                                                                                .ProductImage[0]
                                                                                                .url
                                                                                        }
                                                                                        alt={
                                                                                            product
                                                                                                .ProductImage[0]
                                                                                                .name
                                                                                        }
                                                                                        className="h-full w-full object-cover object-center"
                                                                                    />
                                                                                </div>

                                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                                    <div>
                                                                                        <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                                                            {/* Chuyển hướng đến chi tiết sản phẩm */}
                                                                                            <h3>
                                                                                                <a
                                                                                                    href={
                                                                                                        "/shop/" +
                                                                                                        product.id
                                                                                                    }
                                                                                                    className="line-clamp-1"
                                                                                                    title={
                                                                                                        product.name
                                                                                                    }
                                                                                                >
                                                                                                    {
                                                                                                        product.name
                                                                                                    }
                                                                                                </a>
                                                                                            </h3>
                                                                                            <p className="ml-4">
                                                                                                {formatterVND.format(
                                                                                                    product.price
                                                                                                )}
                                                                                            </p>
                                                                                        </div>
                                                                                        <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                                                                            Kho:&nbsp;
                                                                                            {
                                                                                                product.in_stock
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex flex-1 items-end justify-between text-sm">
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
                                                                                                            product.price
                                                                                                        )
                                                                                                    }
                                                                                                >
                                                                                                    <span className="m-auto text-2xl font-thin">
                                                                                                        −
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
                                                                                                            product.price
                                                                                                        )
                                                                                                    }
                                                                                                    disabled={
                                                                                                        product.quantity ===
                                                                                                        product.in_stock
                                                                                                    }
                                                                                                >
                                                                                                    <span className="m-auto text-2xl font-thin">
                                                                                                        +
                                                                                                    </span>
                                                                                                </button>
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="flex">
                                                                                            <button
                                                                                                type="button"
                                                                                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-white
                                                                                            dark:hover:text-gray-500"
                                                                                                onClick={(
                                                                                                    e
                                                                                                ) =>
                                                                                                    handleRemove(
                                                                                                        e,
                                                                                                        index,
                                                                                                        product.price,
                                                                                                        product.quantity
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                Loại
                                                                                                bỏ
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </>
                                                            ) : (
                                                                <>
                                                                    Bạn chưa có
                                                                    sản phẩm nào
                                                                    trong giỏ
                                                                    hàng.
                                                                </>
                                                            )}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-600 py-6 px-4 sm:px-6">
                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                    <p>Tổng tiền</p>
                                                    <p>
                                                        {formatterVND.format(
                                                            subtotal
                                                        )}
                                                    </p>
                                                </div>
                                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-700">
                                                    - Phí vận chuyển và thuế sẽ
                                                    được cộng vào khi thanh
                                                    toán.
                                                </p>
                                                <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-500">
                                                    - Lưu ý: giỏ hàng chỉ lưu
                                                    trên thiết bị này, nếu bạn
                                                    chuyển sang thiết bị khác sẽ
                                                    không thể truy cập vào giỏ
                                                    hàng đã lưu
                                                </p>
                                                <div className="mt-6">
                                                    <a
                                                        href="/shop/checkout"
                                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                    >
                                                        Thanh toán
                                                    </a>
                                                </div>
                                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                                    <p>
                                                        hoặc &nbsp;
                                                        <button
                                                            type="button"
                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                                            onClick={() =>
                                                                props.setCartOpen(
                                                                    false
                                                                )
                                                            }
                                                        >
                                                            Tiếp tục mua hàng
                                                            <span aria-hidden="true">
                                                                {" "}
                                                                &rarr;
                                                            </span>
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </Dialog.Panel>
                                </Transition.Child>
                            </div>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}

export default memo(ShopCart);
