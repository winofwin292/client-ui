import React, { memo, lazy } from "react";

const TopNav = lazy(() => import("components/common/TopNav/TopNav"));
const Footer = lazy(() => import("components/common/Footer/Footer"));

function NotFound() {
    return (
        <>
            <TopNav />
            <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
                <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex-shrink-0 flex justify-center">
                        <a href="/" className="inline-flex">
                            <span className="sr-only">Workflow</span>
                            <img
                                className="h-12 w-auto"
                                src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=600"
                                alt=""
                            />
                        </a>
                    </div>
                    <div className="py-16">
                        <div className="text-center">
                            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
                                Lỗi 404
                            </p>
                            <h1 className="mt-2 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl">
                                Không tìm thấy trang.
                            </h1>
                            <p className="mt-2 text-base text-gray-500">
                                Opss :((, đường dẫn không tồn tại hoặc bạn không
                                có quyền truy cập, vui lòng nhấn vào bên dưới để
                                quay lại trang chủ.
                            </p>
                            <div className="mt-6">
                                <a
                                    href="/"
                                    className="text-base font-medium text-indigo-600 hover:text-indigo-500"
                                >
                                    Quay lại trang chủ
                                    <span aria-hidden="true"> &rarr;</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}

export default memo(NotFound);
