import React, { memo, useCallback, useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";

import posterApi from "api/Poster/posterApi";

function CarouselImage() {
    const [images, setImages] = useState([]);

    const customRender = (item) => {
        // customize your own slide below
        return (
            <div className="image-gallery-image">
                <img
                    style={{
                        aspectRatio: "16 / 9",
                        objectFit: "cover",
                        objectPosition: "bottom",
                    }}
                    src={item.original}
                    alt={item.originalAlt}
                    srcSet={item.srcSet}
                    sizes={item.sizes}
                    title={item.originalTitle}
                    className="w-full"
                />

                {item.description && (
                    <span className="image-gallery-description">
                        {item.description}
                    </span>
                )}
            </div>
        );
    };

    const getData = useCallback(async () => {
        const response = await posterApi.getAll();
        if (response.status === 200) {
            const temp = response.data.map((item) => ({
                original: item.image_url,
                description: item.content,
                originalClass: "mt-1",
            }));
            setImages(temp);
        }
    }, []);

    useEffect(() => {
        getData();
    }, [getData]);

    return (
        <div
            id="carouselExampleCaptions"
            className="carousel slide relative"
            data-bs-ride="carousel"
        >
            <ImageGallery
                items={images}
                showThumbnails={false}
                showPlayButton={false}
                showFullscreenButton={false}
                showBullets={true}
                autoPlay={true}
                renderItem={customRender}
            />
        </div>
    );
}

export default memo(CarouselImage);
