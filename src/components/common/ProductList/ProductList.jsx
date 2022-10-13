import React, { memo } from "react";
// import { products } from "./productData";
import { alertType } from "utils";

function ProductList(props) {
    const products = props.data;
    const handleAddToCart = (e, product) => {
        e.preventDefault();
        try {
            const { desc, publishingYear, category, ...newProduct } = product;
            const currCart = JSON.parse(localStorage.getItem("myCart")) || {
                cart: [],
            };
            currCart.cart.push(newProduct);
            props.setCountCart((prev) => prev + 1);
            localStorage.setItem("myCart", JSON.stringify(currCart));
            props.setNotify({
                open: true,
                type: alertType.SUCCESS,
                msg: "Đã thêm 1 sản phẩm vào giỏ hàng",
            });
        } catch {
            props.setNotify({
                open: true,
                type: alertType.ERROR,
                msg: "Lỗi khi thêm sản phẩm",
            });
        }
    };
    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="mx-auto max-w-2xl py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8 lg:py-2">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    Danh sách tài liệu
                </h2>

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80 ">
                                <a href={"/shop/" + product.id}>
                                    <img
                                        src={product.imageSrc}
                                        alt={product.imageAlt}
                                        className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                                    />
                                </a>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 dark:text-white">
                                        <a
                                            href={"/shop/" + product.id}
                                            className="font-bold"
                                        >
                                            {/* <span
                                                aria-hidden="true"
                                                className="absolute inset-0"
                                            /> */}
                                            {product.name}
                                        </a>
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-white">
                                        Tác giả: {product.author}
                                    </p>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {product.price}&nbsp;VNĐ
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between">
                                <button
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="text-white text-center w-full bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 ml-2 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
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
                </div>
            </div>
        </div>
    );
}
export default memo(ProductList);