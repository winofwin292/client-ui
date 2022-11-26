import React, { memo } from "react";
import {
    BoltIcon,
    ChatBubbleBottomCenterTextIcon,
    GlobeAltIcon,
    ScaleIcon,
} from "@heroicons/react/24/outline";

const features = [
    {
        name: "Đội ngũ giáo viên giàu kinh nghiệm",
        description:
            "Chúng tôi có một đội ngũ giáo viên giàu kinh nghiệm trong việc giảng dạy ngoại ngữ, bao gồm cà người bản xứ.",
        icon: GlobeAltIcon,
    },
    {
        name: "Môi trường thân thiện, năng động",
        description:
            "Môi trường học tập được chúng tôi chú trọng nhằm nâng cao trải nghiệm cho học viên, giúp học viên có thể học tập một các thoải mái.",
        icon: ScaleIcon,
    },
    {
        name: "Cơ sở vật chất hiện đại",
        description:
            "Trung tâm được đầu tư các trang thiết bị và vật chất hiện đại, nhằm phục mục đích năng cao chất lượng của các buổi học.",
        icon: BoltIcon,
    },
    {
        name: "Đa dạng khóa học cho từng nhu cầu",
        description:
            "Các khóa học được chúng tôi xây dựng theo nhiều nhu cầu khác nhau, phù hợp cho mọi đối tượng.",
        icon: ChatBubbleBottomCenterTextIcon,
    },
];

function Feature() {
    return (
        <div className="bg-white dark:bg-gray-900 py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                    {/* <h2 className="text-lg font-semibold text-indigo-600">
                        Transactions
                    </h2> */}
                    <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                        Nơi tốt nhất để đầu tư cho tương lai
                    </p>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
                        Hơn 1.000 học viên đã tin tưởng và chọn chúng tôi
                    </p>
                </div>

                <div className="mt-10">
                    <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative">
                                <dt>
                                    <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white ">
                                        <feature.icon
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <p className="ml-16 text-lg font-medium leading-6 text-gray-900 dark:text-white">
                                        {feature.name}
                                    </p>
                                </dt>
                                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}

export default memo(Feature);
