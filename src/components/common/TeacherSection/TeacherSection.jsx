import React, { memo } from "react";

const teachers = [
    {
        name: "Nguyễn Văn A",
        description: "Thạc sĩ Ngôn ngữ",
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png",
        avtDesc: "A Avatar",
    },
    {
        name: "Nguyễn Văn B",
        description: "Thạc sĩ Ngôn ngữ",
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/helene-engels.png",
        avtDesc: "B Avatar",
    },
    {
        name: "Nguyễn Văn C",
        description: "Thạc sĩ Ngôn ngữ",
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png",
        avtDesc: "C Avatar",
    },
    {
        name: "Nguyễn Văn D",
        description: "Thạc sĩ Ngôn ngữ",
        avatar: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png",
        avtDesc: "D Avatar",
    },
];

function TeacherSection() {
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-6 lg:px-6">
                <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
                    <h2 className="mb-4 text-4xl tracking-tight font-semibold text-gray-900 dark:text-white">
                        Đội ngũ giáo viên
                    </h2>
                    <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400">
                        Đội ngũ giáo viên với nhiều năm kinh nghiệm trong việc
                        giảng dạy ngoại ngữ
                    </p>
                </div>
                <div className="grid gap-8 lg:gap-16 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {teachers.map((item, index) => (
                        <div
                            key={index}
                            className="text-center text-gray-500 dark:text-gray-400"
                        >
                            <img
                                className="mx-auto mb-4 w-36 h-36 rounded-full"
                                src={item.avatar}
                                alt={item.avtDesc}
                            />
                            <h3 className="mb-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                <a href="/">{item.name}</a>
                            </h3>
                            <p>{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default memo(TeacherSection);
