import { MdKeyboardArrowRight } from "react-icons/md";

const statistics = [
  {
    title: "All Time Strategies",
    count: "0",
    bg: "bg-[#0C21C1]",
    text: "text-white",
  },

  {
    title: "Live Matches today",
    count: "0",
    bg: "bg-[#97060B]",
    text: "text-white",
  },
  {
    title: "Picks Today",
    count: "0",
    bg: "bg-[#1F1F21]",
    text: "text-white",
  },
];
const GroupCard = () => {
  return (
    <>
      {statistics.map((item, i) => (
        <div
          key={i}
          className={`${item.bg} flex w-full justify-between gap-5 items-center text-white  p-4 `}
        >
            <span className="block mb-6 text-4xl   text-white font-medium">
              {item.count}
            </span>
          <div className=" flex justify-between gap-5">
            <span className="block mb- text-xs shrink-0  text-white font-medium mb-6">
              {item.title}
            </span>

            <div className={`  text-xl text-white  `}>
              <MdKeyboardArrowRight />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default GroupCard;
