import React, { Fragment, useState, useEffect, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import { formatterVND } from "utils";

function ShopCart(props) {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [products, setProducts] = useState([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        const currCart = JSON.parse(localStorage.getItem("myCart")) || {
            cart: [],
        };
        const sumPrice = currCart.cart.reduce(
            (acc, o) => acc + parseInt(o.price),
            0
        );
        setProducts(currCart.cart);
        setSubtotal(sumPrice);
    }, [props.cartOpen]);

    const handleRemove = (e, index) => {
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
            props.setCountCart((prev) => prev - 1);
            const sumPrice = newProductList.reduce(
                (acc, o) => acc + parseInt(o.price),
                0
            );
            setSubtotal(sumPrice);
            enqueueSnackbar("Đã xóa 1 sản phẩm khỏi giỏ hàng", {
                variant: "success",
                style: {
                    borderColor: "#43a047",
                    color: "#43a047",
                },
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
        } catch {
            enqueueSnackbar("Lỗi: không xóa được sản phẩm", {
                variant: "error",
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
        }
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
                                                                                            product.imageSrc
                                                                                        }
                                                                                        alt={
                                                                                            product.imageAlt
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
                                                                                            {
                                                                                                product.author
                                                                                            }
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                                                        <p className="text-gray-500 dark:text-white">
                                                                                            {/* {
                                                                                    product.author
                                                                                } */}
                                                                                        </p>

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
                                                                                                        index
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
