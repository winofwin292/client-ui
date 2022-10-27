import React, { memo, useState, useEffect, useCallback } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import UndoIcon from "@mui/icons-material/Undo";

import { TopNav } from "components/common/TopNav";
import { Footer } from "components/common/Footer";
import { ShopCart } from "pages/ShopCart";

import { ShoppingBagIcon } from "@heroicons/react/24/outline";

import ImageGallery from "react-image-gallery";
import { useSnackbar } from "notistack";

import { formatterVND } from "utils";

import productApi from "api/Product/productApi";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

function ProductDetail() {
    let { id } = useParams();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const [countCart, setCountCart] = useState(0);
    const [productImages, setProductImages] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    const getData = useCallback(
        async (productId) => {
            const data = {
                productId: parseInt(productId),
            };
            const response = await productApi.getProduct(data);
            if (response.status === 200) {
                const temp = [];
                response.data.ProductImage.forEach((image) =>
                    temp.push({
                        original: image.url,
                        thumbnail: image.url,
                    })
                );
                setProductImages(temp);
                setProduct(response.data);
                document.title = response.data.name;
            } else {
                navigate("/404");
            }
        },
        [navigate]
    );

    useEffect(() => {
        getData(id);
    }, [getData, id]);

    // useEffect(() => {
    //     document.title = product.name;
    // }, [product.name]);

    useEffect(() => {
        const myCart = JSON.parse(localStorage.getItem("myCart")) || {
            cart: [],
        };
        setCountCart(myCart.cart.length);
        localStorage.setItem("myCart", JSON.stringify(myCart));
    }, []);

    const handleCancel = useCallback(
        (e) => {
            e.preventDefault();
            try {
                const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                    cart: [],
                };
                currCart.cart.pop();
                setCountCart((prev) => prev - 1);
                localStorage.setItem("myCart", JSON.stringify(currCart));
                enqueueSnackbar("Đã xóa 1 sản phẩm khỏi vào hàng", {
                    variant: "warning",
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
                enqueueSnackbar("Lỗi: không thể hoàn tác!", {
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
        },
        [closeSnackbar, enqueueSnackbar]
    );

    const handleAddToCart = useCallback(
        (e) => {
            e.preventDefault();
            try {
                const { desc, publishingYear, category, ...newProduct } =
                    product;
                const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                    cart: [],
                };
                currCart.cart.push(newProduct);
                setCountCart((prev) => prev + 1);
                localStorage.setItem("myCart", JSON.stringify(currCart));
                enqueueSnackbar("Đã thêm 1 sản phẩm vào hàng", {
                    variant: "success",
                    style: {
                        borderColor: "#43a047",
                        color: "#43a047",
                    },
                    action: (key) => (
                        <>
                            <IconButton
                                size="small"
                                onClick={(e) => handleCancel(e)}
                                title={"Hoàn tác"}
                                style={{
                                    color: "white",
                                }}
                            >
                                <UndoIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={() => closeSnackbar(key)}
                                style={{
                                    color: "white",
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    ),
                });
            } catch {
                enqueueSnackbar("Lỗi: không thêm được sản phẩm", {
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
        },
        [closeSnackbar, enqueueSnackbar, handleCancel, product]
    );

    const handleOpenCart = () => {
        setCartOpen(true);
    };

    return (
        <div className="bg-white dark:bg-gray-900">
            <TopNav />
            {product ? (
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
                                            href={"/shop/" + product.id}
                                            aria-current="page"
                                            className="font-medium text-gray-500 hover:text-gray-600 dark:text-white dark:hover:text-gray-300"
                                        >
                                            {product.name}
                                        </a>
                                    </li>
                                </ol>
                                <div className="ml-auto flex items-center text-gray-700 dark:text-white">
                                    {/* Cart */}
                                    <div className="ml-4 flow-root lg:ml-6">
                                        <button
                                            onClick={handleOpenCart}
                                            className="group -m-2 flex items-center p-2"
                                        >
                                            <ShoppingBagIcon
                                                className="h-6 w-6 flex-shrink-0 text-gray-400 dark:text-white group-hover:text-gray-500"
                                                aria-hidden="true"
                                            />
                                            <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800 dark:text-white dark:group-hover:text-gray-200">
                                                {countCart}
                                            </span>
                                            <span className="sr-only">
                                                items in cart, view bag
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </nav>

                        {/* Product info */}
                        <div className="mx-auto max-w-2xl px-4 pt-4 pb-8 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pt-6 lg:pb-8">
                            <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                                <ImageGallery
                                    items={productImages}
                                    showPlayButton={false}
                                    showFullscreenButton={false}
                                />
                            </div>

                            {/* Options */}
                            <div className="mt-4 lg:row-span-3 lg:mt-0">
                                <div className="lg:col-span-2 lg:pr-8 lg:mb-4">
                                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
                                        {product.name}
                                    </h1>
                                </div>
                                <h2 className="sr-only dark:text-white">
                                    Thông tin khóa học
                                </h2>
                                <p className="text-3xl tracking-tight text-gray-900 dark:text-white">
                                    {formatterVND.format(product.price)}
                                </p>

                                {/* Reviews */}
                                <div className="mt-6">
                                    <h3 className="sr-only">Reviews</h3>
                                    <div className="flex items-center">
                                        <div className="flex items-center">
                                            {[0, 1, 2, 3, 4].map((rating) => (
                                                <StarIcon
                                                    key={rating}
                                                    className={classNames(
                                                        reviews.average > rating
                                                            ? "text-gray-900  dark:text-white"
                                                            : "text-gray-200  dark:text-gray-500",
                                                        "h-5 w-5 flex-shrink-0"
                                                    )}
                                                    aria-hidden="true"
                                                />
                                            ))}
                                        </div>
                                        <p className="sr-only">
                                            {reviews.average} out of 5 stars
                                        </p>
                                        <a
                                            href={reviews.href}
                                            className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-white"
                                        >
                                            {reviews.totalCount} đánh giá
                                        </a>
                                    </div>
                                </div>

                                <div className="mt-10">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            Thông tin cơ bản:
                                        </h3>
                                        <div className="mt-4">
                                            <ul className="list-disc space-y-2 pl-4 text-sm">
                                                <li className="text-gray-600 dark:text-white">
                                                    Tác giả:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {product.author}
                                                    </span>
                                                </li>
                                                <li className="text-gray-600 dark:text-white">
                                                    Năm xuất bản:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {
                                                            product.publishing_year
                                                        }
                                                    </span>
                                                </li>
                                                <li className="text-gray-600 dark:text-white">
                                                    Loại:&nbsp;
                                                    <span className="text-gray-800 font-bold dark:text-white">
                                                        {product.Category.name}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => handleAddToCart(e)}
                                        className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 py-3 px-8 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Thêm vào giỏ hàng
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-7xl px-4 pt-2 pb-4 sm:px-6 lg:px-8 lg:pt-2 lg:pb-4">
                        <div className="py-2 lg:pt-2 lg:pb-2 lg:ml-28">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    Thông tin tài liệu:
                                </h3>

                                <div className="space-y-6">
                                    <p className="text-base text-gray-900 dark:text-white">
                                        {product.description}
                                    </p>
                                </div>
                            </div>

                            {/* <div className="mt-4">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                                    Thông tin tài liệu:
                                </h3>

                                <div className="mt-4">
                                    <ul className="list-disc space-y-2 pl-4 text-sm">
                                        {product.highlights.map((highlight) => (
                                        <li
                                            key={highlight}
                                            className="text-gray-400 dark:text-gray-400"
                                        >
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {highlight}
                                            </span>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </>
            ) : (
                ""
            )}

            <Footer />
            <ShopCart
                cartOpen={cartOpen}
                setCartOpen={setCartOpen}
                setCountCart={setCountCart}
            />
        </div>
    );
}
export default memo(ProductDetail);
