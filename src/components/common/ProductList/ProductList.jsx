import React, { memo, useCallback } from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useSnackbar } from "notistack";

import { formatterVND } from "utils";

function ProductList(props) {
    const products = props.data;
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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

    const handleAddToCart = useCallback(
        (e, product) => {
            e.preventDefault();

            try {
                const { description, publishingYear, category, ...newProduct } =
                    product;
                newProduct.quantity = 1;
                newProduct.price = parseInt(newProduct.price);
                const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                    cart: [],
                };
                const productInCart = currCart.cart.find(
                    (item) => item.id === newProduct.id
                );

                if (productInCart) {
                    if (productInCart.quantity >= newProduct.in_stock) {
                        showNoti(
                            "Chỉ có thể thêm tối đa " +
                                newProduct.in_stock +
                                " sản phẩm này vào giỏ hàng",
                            "error"
                        );
                        return;
                    }
                    currCart.cart.forEach((item) => {
                        if (item.id === newProduct.id) item.quantity++;
                    });
                } else {
                    currCart.cart.push(newProduct);
                }

                props.setCountCart((prev) => prev + 1);
                localStorage.setItem("myCart", JSON.stringify(currCart));
                showNoti("Đã thêm 1 sản phẩm vào hàng", "success");
            } catch {
                showNoti("Lỗi: không thêm được sản phẩm", "error");
            }
        },
        [props, showNoti]
    );
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Danh sách tài liệu
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.length > 0 ? (
                        <>
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className="group relative"
                                >
                                    <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 ">
                                        <a href={"/shop/" + product.id}>
                                            {product.ProductImage.length > 0 ? (
                                                <img
                                                    src={
                                                        product.ProductImage[0]
                                                            .url
                                                    }
                                                    alt={
                                                        product.ProductImage[0]
                                                            .name
                                                    }
                                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                />
                                            ) : (
                                                <img
                                                    src="./image-error.png"
                                                    alt="error"
                                                    className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                                />
                                            )}
                                        </a>
                                    </div>
                                    <div className="mt-4">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                                                <a
                                                    href={"/shop/" + product.id}
                                                    className="font-bold line-clamp-1"
                                                    title={product.name}
                                                >
                                                    {product.name}
                                                </a>
                                            </h3>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                                    Kho: {product.in_stock}
                                                </p>
                                            </span>
                                            <span>
                                                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                                    {formatterVND.format(
                                                        product.price
                                                    )}
                                                </p>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex justify-between">
                                        <button
                                            onClick={(e) =>
                                                handleAddToCart(e, product)
                                            }
                                            className="text-white text-center w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800 disabled:opacity-50"
                                            disabled={product.in_stock === 0}
                                        >
                                            + Giỏ hàng
                                        </button>
                                        <a
                                            href={"/shop/" + product.id}
                                            className="text-white text-center w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                                        >
                                            Chi tiết
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
}
export default memo(ProductList);
