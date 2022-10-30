import React, { memo } from "react";

function HeroSection(props) {
    const videoId = props.videoId || "FT3ODSg1GFE";
    return (
        <section className="bg-white dark:bg-gray-900 mt-4">
            <div className="py-4 px-4 mx-auto max-w-screen-xl text-center lg:py-2 lg:px-6">
                <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                    We invest in the world’s potential
                </h1>
                <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
                    Here at Flowbite we focus on markets where technology,
                    innovation, and capital can unlock long-term value and drive
                    economic growth.
                </p>
                <div className="flex flex-col aspect-w-16 aspect-h-9 lg:aspect-none mb-4 lg:mb-8 space-y-2 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                    <iframe
                        className="lg:w-2/3 lg:h-96"
                        src={
                            "https://www.youtube-nocookie.com/embed/" + videoId
                        }
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>
    );
}

export default memo(HeroSection);
