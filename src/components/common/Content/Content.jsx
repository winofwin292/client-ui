import React, { memo } from "react";

function Content(props) {
    const title = props.title || "We didn't reinvent the wheel";
    const textContent = props.textContent || [
        "We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need. Small enough to be simple and quick, but big enough to deliver the scope you want at the pace you need.",
        "We are strategists, designers and developers. Innovators and problem solvers. Small enough to be simple and quick.",
    ];
    const img = props.img || [
        {
            img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-2.png",
            alt: "office content 1",
        },
        {
            img: "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/content/office-long-1.png",
            alt: "office content 2",
        },
    ];
    return (
        <section className="bg-white dark:bg-gray-900">
            <div className="gap-16 items-center py-8 px-4 mx-auto max-w-screen-xl lg:grid lg:grid-cols-2 lg:py-8 lg:px-6">
                {props.alignRight ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <img
                                className="w-full rounded-lg"
                                src={img[0].img}
                                alt={img[0].alt}
                            />
                            <img
                                className="mt-4 w-full lg:mt-10 rounded-lg"
                                src={img[1].img}
                                alt={img[1].alt}
                            />
                        </div>
                        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="mb-4">{textContent[0]}</p>
                            <p>{textContent[1]}</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                            <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <p className="mb-4">{textContent[0]}</p>
                            <p>{textContent[1]}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <img
                                className="w-full rounded-lg"
                                src={img[0].img}
                                alt={img[0].alt}
                            />
                            <img
                                className="mt-4 w-full lg:mt-10 rounded-lg"
                                src={img[1].img}
                                alt={img[1].alt}
                            />
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default memo(Content);
