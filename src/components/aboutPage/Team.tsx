// @ts-ignore
import TeamImageCard from "./TeamImageCard";
// @ts-ignore
import { teamMembers } from "../../utils/dummies";

const Team = () => {
  return (
    <section className="bg-[#7AB58D0D] py-10 md:py-14 lg:py-20 px-7 md:px-20 xl:px-[140px] 2xl:px-[170px] flex flex-col items-center">
      <h4 className="text-lg md:text-xl lg:text-3xl font-semibold text-center mb-12 lg:mb-16">
        Our Team
      </h4>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center justify-center max-w-4xl">
        {teamMembers?.map((member: any, index: any) => (
          <TeamImageCard
            key={index}
            img={member.img}
            name={member.name}
            position={member.position}
            border={member.border}
          />
        ))}
      </div>
    </section>
  );
};

export default Team;
