const TeamImageCard = ({ img, name, position, border = true }) => {
  return (
    <div className="flex flex-col justify-between items-center w-[180px] sm:w-[150px] md:w-[160px] lg:w-[200px] min-h-[300px] sm:min-h-[280px] lg:min-h-[320px] text-center">
      <img
        src={img}
        alt={name}
        className={`w-full h-[200px] sm:h-[180px] md:h-[180px] lg:h-[200px] xl:h-[200px] rounded-lg object-cover object-top mb-3 ${
          border ? "border border-[#1F8340]" : ""
        }`}
      />
      <div className="flex flex-col flex-grow gap-1">
        <h4 className="text-sm sm:text-base font-semibold mb-1">{name}</h4>
        <p className="text-[#00000080] text-xs sm:text-sm">{position}</p>
      </div>
    </div>
  );
};

export default TeamImageCard;
