import { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import { MdArrowOutward } from "react-icons/md";
import { Link } from 'react-router-dom';
import useInsurance from "@/hooks/UseInsurance";

interface SliderImage {
    id: number;
    image: string;
    created_at: string;
    updated_at: string;
    is_active: number;
}

export default function CarouselComponent() {
    const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
    const [loading, setLoading] = useState(true);
    const { getSlider } = useInsurance();

    // Fetch slider images on component mount
    useEffect(() => {
        const fetchSliderImages = async () => {
            try {
                setLoading(true);
                const images = await getSlider();
                // Filter to only show active images (is_active = 1)
                const activeImages = images.filter((img: SliderImage) => img.is_active === 1);
                setSliderImages(activeImages);
            } catch (error) {
                console.error("Error fetching slider images:", error);
                setSliderImages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSliderImages();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
            </div>
        );
    }

    // If no slider images are available, don't render the carousel
    if (sliderImages.length === 0) {
        return null;
    }

    return (
        <Carousel slideInterval={5000}>
            {sliderImages.map((image, index) => {
                const imageUrl = `https://dash.npfinsurance.com/uploads/${image.image}`;

                return (
                    <div key={index} className="relative w-full h-screen bg-cover bg-center mt-10"
                        style={{ backgroundImage: `url(${imageUrl})` }}>
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="container mx-auto h-full flex items-center relative z-10 px-8 sm:px-16">
                            <div className="text-left sm:text-center bg-white bg-opacity-85 p-5 md:px-8 rounded-2xl">
                                <div className="text-3xl sm:text-5xl font-bold">
                                    <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'>Your <span className="text-green-800">Safety Net</span> for</h1>
                                    <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'>Life's Uncertainties</h1>
                                </div>
                                <div className="my-1 text-lg sm:text-xl py-3">
                                    <p className="text-gray-900">
                                        Protecting you and your loved ones with reliable
                                    </p>
                                    <p className="text-gray-900">
                                        coverage when you need it most.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 py-2 justify-center">
                                    <Link to={"/services/view/1"}>
                                        <button className="flex items-center justify-center bg-transparent border border-green-800 rounded-full py-2 px-4 text-green-800 hover:bg-green-800 hover:text-white transition duration-300">
                                            Learn more
                                            <MdArrowOutward className="ml-2" />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </Carousel>
    );
}