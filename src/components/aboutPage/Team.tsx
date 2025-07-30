// @ts-ignore
import TeamImageCard from "./TeamImageCard";
import { useEffect, useState } from "react";
import axios from "axios";

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(
          "https://dash.npfinsurance.com/api/team_members"
        );
        setTeamMembers(res.data?.data || []); // Adjust based on actual response structure
      } catch (err: any) {
        setError("Failed to load team members.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return (
    <section className="bg-[#7AB58D0D] py-10 md:py-14 lg:py-20 px-7 flex flex-col items-center">
      <h4 className="text-lg md:text-xl lg:text-3xl font-semibold text-center mb-12 lg:mb-16">
        Our Team
      </h4>

      {loading ? (
        <p className="text-center">Loading team members...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 place-items-center justify-around w-full max-w-4xl">
          {teamMembers.map((member: any, index: number) => (
            <TeamImageCard
              key={index}
              img={member?.image_url}
              name={member?.name}
              position={member?.title}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Team;
