import React, { memo } from "react";
function CallToAction() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-4 px-4 mx-auto max-w-screen-xl sm:py-4 lg:px-6">
                <div className="mx-auto max-w-screen-sm text-center">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold leading-tight text-gray-900 dark:text-white">
                        Đăng ký học ngay hôm nay
                    </h2>
                    <p className="mb-6 font-light text-gray-500 dark:text-gray-400 md:text-lg">
                        Nhấn vào nút bên dưới và điền thông tin, nhân viên của
                        chúng tôi sẽ liên hệ và tư vấn về các khóa học cho bạn.
                    </p>
                    <a
                        href="/"
                        className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-indigo-600 dark:hover:bg-indigo-700 focus:outline-none dark:focus:ring-indigo-800"
                    >
                        Để lại thông tin
                    </a>
                </div>
            </div>
        </section>
    );
}

export default memo(CallToAction);
