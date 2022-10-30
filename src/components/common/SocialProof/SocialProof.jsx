import React, { memo } from "react";

const socials = [
    {
        number: "50+",
        text: "giảng viên",
    },
    {
        number: "70+",
        text: "khóa học",
    },
    {
        number: "1000+",
        text: "học viên",
    },
];

function SocialProof() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="max-w-screen-xl px-4 py-8 mx-auto text-center lg:py-16 lg:px-6">
                <dl className="grid max-w-screen-md gap-8 mx-auto text-gray-900 sm:grid-cols-3 dark:text-white">
                    {socials.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center"
                        >
                            <dt className="mb-2 text-3xl md:text-4xl font-extrabold">
                                {item.number}
                            </dt>
                            <dd className="font-light text-gray-500 dark:text-gray-400">
                                {item.text}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

export default memo(SocialProof);
