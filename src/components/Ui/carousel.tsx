import { useState, useEffect } from 'react';
import { Carousel } from 'flowbite-react';
import { MdArrowOutward } from "react-icons/md";
import { Link } from 'react-router-dom';
import useInsurance from "@/hooks/UseInsurance";

interface CarouselItem {
    id: number;
    image: string;
    title: string;
    description: string;
    status: boolean | number;  // can be either true/false or 1/0
    created_at: string;
    updated_at: string;
}

export default function CarouselComponent() {
    const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { getCarousel } = useInsurance();  // Changed from getSlider to getCarousel

    // Fetch carousel items on component mount
    useEffect(() => {
        const fetchCarouselItems = async () => {
            try {
                setLoading(true);
                const response = await getCarousel();
                // Filter to only show active items (status is true or 1)
                const activeItems = response.data.filter((item: CarouselItem) => 
                    item.status === true || item.status === 1
                );
                setCarouselItems(activeItems);
            } catch (error) {
                console.error("Error fetching carousel items:", error);
                setCarouselItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCarouselItems();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800"></div>
            </div>
        );
    }

    // If no carousel items are available, don't render the carousel
    if (carouselItems.length === 0) {
        return null;
    }

    return (
        <Carousel slideInterval={5000}>
            {carouselItems.map((item) => {
                const imageUrl = `https://dash.npfinsurance.com/uploads/${item.image}`;

                return (
                    <div key={item.id} className="relative w-full h-screen bg-cover bg-center mt-10"
                        style={{ backgroundImage: `url(${imageUrl})` }}>
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="container mx-auto h-full flex items-center relative z-10 px-8 sm:px-16">
                            <div className="text-left sm:text-center bg-white bg-opacity-85 p-5 md:px-8 rounded-2xl">
                                <div className="text-3xl sm:text-5xl font-bold">
                                    {/* Use the title from carousel item */}
                                    <h1 className='text-2xl md:text-3xl lg:text-5xl xl:text-5xl'>
                                        {item.title || "Your Safety Net for Life's Uncertainties"}
                                    </h1>
                                </div>
                                <div className="my-1 text-lg sm:text-xl py-3">
                                    {/* Use the description from carousel item */}
                                    <p className="text-gray-900">
                                        {item.description || "Protecting you and your loved ones with reliable coverage when you need it most."}
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