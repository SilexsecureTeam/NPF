import { useState, useEffect } from 'react';
import useInsurance from "@/hooks/UseInsurance";

export default function SuperBoard() {
    const [boardMembers, setBoardMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Get the getBoard function from useInsurance hook
    const { getBoard } = useInsurance();

    // Fetch board members when component mounts
    useEffect(() => {
        const fetchBoardMembers = async () => {
            try {
                const data = await getBoard();
                if (data) {
                    setBoardMembers(data);
                }
            } catch (error) {
                console.error("Error fetching board members:", error);
                setError("Failed to load board members");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBoardMembers();
    }, []);


    return (
        <>
            {/* <!-- Hero section --> */}
            <div className="w-full">
                <div className="bg-[#141B34] w-full min-h-[300px] sm:min-h-[361px] flex flex-col items-center justify-center text-[#F4F4F4]" >
                    <h1 className="text-3xl md:text-4xl xl:text-5xl font-light mb-5">
                        Our Super <span className="font-medium">Board & Team</span>
                    </h1>
                    <p className="text-sm md:text-base lg:text-lg" >
                        {`Home -> About Us -> Board of Directors`}
                    </p>
                </div>
            </div>
            <div className="py-4">
                <h1 className='text-center font-bold text-3xl'>Board of Directors</h1>
            </div>

            <section className="py-10 md:py-14 lg:py-16 px-7 md:px-20 lg:px-[160px] xl:px-[200px]">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1F8340]"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-10 text-red-600">
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-center">
                        {boardMembers.length > 0 ? (
                            boardMembers.map((member, index) => (
                                <BoardImageCard
                                    key={member.id}
                                    img={`https://dash.npfinsurance.com/uploads/${member.image}`}
                                    name={member.name}
                                    position={member.title}
                                    border={index % 6 === 0 || index % 6 === 5} // Apply border to first and sixth items
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                <p>No board members available at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </>
    )
}

interface BoardImageCardProps {
    img: string;
    name: string;
    position: string;
    border?: boolean;
}

const BoardImageCard: React.FC<BoardImageCardProps> = ({ img, name, position, border }) => {
    return (
        <div className="">
            <div className="relative w-full max-w-[400px] text-center">
                <div className="absolute bottom-0 -right-2 w-2 h-[95%] bg-[#EFEB05]"></div>
                <div className="absolute -bottom-2 -right-2 h-2 w-[95%] bg-[#1F8340]"></div>
                <img
                    src={img}
                    alt={name}
                    className={`w-full max-h-[350px] lg:max-h-[400px] object-cover ${border ? "border border-[#000000]" : ""}`}
                />
            </div>
            <div className="mt-3 lg:mt-4">
                <h4 className="text-lg lg:text-xl font-bold">{name}</h4>
                <p className="text-gray-600 text-sm lg:text-base">{position}</p>
            </div>
        </div>
    );
};