import React, { Fragment, useState, useEffect, memo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const products = [
    {
        id: 1,
        name: "Throwback Hip Bag",
        href: "#",
        color: "Salmon",
        price: "$90.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-01.jpg",
        imageAlt:
            "Salmon orange fabric pouch with match zipper, gray zipper pull, and adjustable hip belt.",
    },
    {
        id: 2,
        name: "Medium Stuff Satchel",
        href: "#",
        color: "Blue",
        price: "$32.00",
        quantity: 1,
        imageSrc:
            "https://tailwindui.com/img/ecommerce-images/shopping-cart-page-04-product-02.jpg",
        imageAlt:
            "Front of satchel with blue canvas body, black straps and handle, drawstring top, and front zipper pouch.",
    },
    // More products...
];

function ShopCart(props) {
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
    };

    return (
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
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">
                                                    Giỏ hàng
                                                </Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="-m-2 p-2 text-gray-400 hover:text-gray-500"
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
                                                    <ul className="-my-6 divide-y divide-gray-200">
                                                        {products.length > 0 ? (
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
                                                                                    <div className="flex justify-between text-base font-medium text-gray-900">
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
                                                                                            {
                                                                                                product.price
                                                                                            }
                                                                                            &nbsp;VNĐ
                                                                                        </p>
                                                                                    </div>
                                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                                        {
                                                                                            product.author
                                                                                        }
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                                                    <p className="text-gray-500">
                                                                                        {/* {
                                                                                    product.author
                                                                                } */}
                                                                                    </p>

                                                                                    <div className="flex">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="font-medium text-indigo-600 hover:text-indigo-500"
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
                                                                Bạn chưa có sản
                                                                phẩm nào trong
                                                                giỏ hàng.
                                                            </>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Tổng tiền</p>
                                                <p>{subtotal}&nbsp;VNĐ</p>
                                            </div>
                                            <p className="mt-0.5 text-sm text-gray-500">
                                                Phí vận chuyển và thuế sẽ được
                                                cộng vào khi thanh toán.
                                            </p>
                                            <div className="mt-6">
                                                <a
                                                    href="/shop/"
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
    );
}

export default memo(ShopCart);
