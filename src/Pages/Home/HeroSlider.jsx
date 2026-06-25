import { useEffect, useRef, useState } from "react";

/**
 * HeroSlider — owns the background image + side thumbnail slider.
 * `current` lives entirely inside this component so the slide interval
 * never triggers a re-render of the parent (search card, dropdown, etc).
 */
const HeroSlider = ({ images }) => {
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const intervalRef = useRef(null);

    const next = () => setCurrent((prev) => (prev + 1) % images.length);

    useEffect(() => {
        if (paused) return;

        intervalRef.current = setInterval(next, 4000);

        return () => clearInterval(intervalRef.current);
    }, [paused, images.length, next]);

    return (
        <div
            className="absolute inset-0"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* background */}
            <div
                className="absolute inset-0 transition-all duration-1200 ease-out"
                style={{
                    backgroundImage: `url(${images[current]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            <div className="absolute inset-0 bg-black/50 pointer-events-none" />

            {/* side cards */}
            <div className="hidden md:flex absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 gap-3 lg:gap-4 z-20 overflow-hidden">
                {images.slice(1).map((_, i) => {
                    const index = (current + i + 1) % images.length;

                    return (
                        <div
                            key={i}
                            onClick={() => setCurrent(index)}
                            className="cursor-pointer w-20 sm:w-24 md:w-28 lg:w-32 h-32 sm:h-40 md:h-48 lg:h-56 rounded-2xl bg-cover bg-center shadow-xl transition-all duration-500"
                            style={{
                                backgroundImage: `url(${images[index]})`,
                                transform: `scale(${1 - i * 0.1})`,
                                opacity: 1 - i * 0.3,
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default HeroSlider;