import React, { memo, useState, useCallback } from "react";

import reviewApi from "api/Review/reviewApi";

const reviews = [
    {
        name: "Bonnie Green",
        course: "Học viên khóa 1",
        review: "Học hỏi được rất nhiều kỹ năng từ khóa học. Làm quen thêm được nhiều bạn mới.",
        img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
        descAvt: "Bonnie Green",
    },
    {
        name: "Jese Leos",
        course: "Học viên khóa 2",
        review: "Giáo viên thân thiện, nhiệt tình. Trang thiết bị đầy đủ để phục vụ cho việc học tập.",
        img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
        descAvt: "Jese Leos",
    },
    {
        name: "Michael Gouch",
        course: "Học viên khóa 3",
        review: "Học được rất nhiều kỹ năng từ khóa học, không chỉ riêng ngoại ngữ. Môi trường tốt.",
        img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/michael-gouch.png",
        descAvt: "Michael Gouch",
    },
    {
        name: "Sofia Mcguire",
        course: "Học viên khóa 4",
        review: "Cảm thấy rất tự tin vào khả năng ngoại ngữ của bản thân sau khi hoàn tất khóa học.",
        img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/sofia-mcguire.png",
        descAvt: "Sofia Mcguire",
    },
];

function ReviewSection() {
    const [reviews, setReviews] = useState([]);

    const getData = useCallback(async () => {
        const response = await reviewApi.getAll();
        if (response.status === 200) {
            setReviews(response.data);
        }
    }, []);

    useState(() => {
        getData();
    }, [getData]);

    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-6 mx-auto max-w-screen-xl lg:py-4 lg:px-6 ">
                <div className="mx-auto max-w-screen-sm text-center mb-8 lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-bold text-gray-900 dark:text-white">
                        Đánh giá từ học viên
                    </h2>
                    <p className="font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                        Đã có hơn 1000 học viên hoàn thành khóa học và nhận được
                        chứng chỉ từ trung tâm
                    </p>
                </div>
                <div className="grid gap-8 mb-6 lg:mb-4 md:grid-cols-2">
                    {reviews.map((item, index) => (
                        <div
                            key={index}
                            className="items-center bg-gray-50 rounded-lg shadow sm:flex dark:bg-gray-800 dark:border-gray-700"
                        >
                            <img
                                className="w-1/3 rounded-lg sm:rounded-none sm:rounded-l-lg"
                                style={{
                                    aspectRatio: "1 / 1",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                }}
                                src={item.image_url}
                                alt={item.name}
                            />
                            <div className="p-5">
                                <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {item.name}
                                </h3>
                                <span className="text-gray-500 dark:text-gray-400">
                                    {item.info}
                                </span>
                                <p
                                    className="line-clamp-3 mt-3 mb-4 font-light text-gray-500 dark:text-gray-400"
                                    title={item.content}
                                >
                                    &quot;{item.content}&quot;
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(ReviewSection);
