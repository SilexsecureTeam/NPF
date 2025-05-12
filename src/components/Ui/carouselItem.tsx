import React from "react";

interface CarouselItemProps {
  text: string;
  author: string;
  role: string;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ text, author, role }) => {
  return (
    <div className="flex h-full items-center justify-center bg-blue-800 dark:text-white">
      <div className="text-center pt-20 px-20">
        <div className="flex space-x-3">
          {Array(5).fill("").map((_, index) => (
            <img
              key={index}
              src="https://img.icons8.com/?size=100&id=qdQpy48X3Rjv&format=png&color=000000"
              className="w-4 h-5"
              alt=""
            />
          ))}
        </div>
        <p className="sm:text-xl md:text-2xl text-white pb-9">{text}</p>
        <hr className="text-white" />
        <div>
          <p className="text-white">{author}</p>
          <p className="text-white">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;