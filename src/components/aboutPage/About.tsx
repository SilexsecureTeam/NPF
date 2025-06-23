import heroImg from "../../assets/about/hero2.png";
//import missionImg from "../../assets/about/mission.png"
import visionImg from "../../assets/about/vision2.png";
import Team from "./Team";
import objectiveImg from "../../assets/about/objective.png";
import regulatorImg from "../../assets/about/regulator.svg";
import customersImg from "../../assets/about/customers.svg";
import staffImg from "../../assets/about/staff.svg";
import shareholdersImg from "../../assets/about/shareholders.svg";
import insuranceImg from "../../assets/about/insurance.svg";
import communityImg from "../../assets/about/community.svg";
import governmentImg from "../../assets/about/government.svg";
import coreValuesImg from "../../assets/about/core-values.png";
import settingsImg from "../../assets/about/settings.svg";

export default function About() {
  return (
    <>
      {/* <!-- Hero section --> */}
      <div className="w-full">
        <img
          src={heroImg}
          alt="Hero img"
          className="w-full min-h-[250px] max-h-[500px] md:max-h-[700px] object-cover"
        />
      </div>

      <section className="bg-white py-10 md:pt-14 lg:pt-16 px-7 md:px-20 xl:px-[140px] 2xl:px-[170px]">
        <div className="mb-7 flex gap-3 items-center">
          <div className="h-[29px] flex">
            <div className="w-2 bg-[#141B34]"></div>
            <div className="w-2 bg-[#EFEB05]"></div>
            <div className="w-2 bg-[#1F8340]"></div>
          </div>
          <h2 className="font-semibold text-lg md:text-xl lg:text-3xl">
            About NPF INSURANCE
          </h2>
        </div>

        <section className="flex flex-col md:flex-row w-full gap-8 ">
          <div className="w-full">
            <p className=" text-justify text-lg">
              NPF Insurance Company Limited is a general business insurance
              company, licensed by the National Insurance Commission{" "}
              <span className="font-bold">(NAICOM)</span>. As a privately-owned
              company, we are dedicated to contributing to Nigeria's GDP by
              providing comprehensive insurance and risk management solutions.
              Our experienced leadership team, headed by the Chairman,{" "}
              <span className="font-bold">Mr. Olufemi Adenaike</span> and
              <span className="font-bold"> MD/CEO, Mr. Temitayo Oke,</span>{" "}
              brings a combined experience of over 200 years in Human Resources,
              Risk, and Asset management across various sectors of the Nigerian
              economy. We are committed to providing innovative and
              customer-focused insurance solutions at competitive rates. Our
              team of experts offer exceptional services, expert risk management
              advice, and tailored insurance products to meet your specific
              needs. As a trusted insurance partner, NPF Insurance is poised to
              become a leader in the industry. Our emphasis is on empowering our
              clients through continuous improvement, risk management, capacity
              building and ensuring optimal value from our relationships.
            </p>
          </div>
          <div className="w-full md:w-3/5 md:min-w-[250px]">
            <div className="bg-[#3C8725] p-5 flex gap-5 items-start mb-1">
              <img
                src={visionImg}
                alt=""
                className="w-10 h-10 xl:w-12 xl:h-12"
              />
              <div className="text-white">
                <h3 className="font-semibold text-lg md:text-xl mb-1">
                  Vision
                </h3>
                <p className="text-sm">
                  We envision becoming a leading insurance provider known for
                  our integrity, reliability and superior customer experience.
                </p>
              </div>
            </div>
            <div className="bg-[#141B34] p-5 flex gap-5 items-start mb-1">
              <img
                src={visionImg}
                alt=""
                className="w-10 h-10 xl:w-12 xl:h-12"
              />
              <div className="text-white">
                <h3 className="font-semibold text-lg md:text-xl mb-1">
                  Our Mission
                </h3>
                <p className="text-sm">
                  To protect our customers’ financial wellbeing by offering
                  innovative insurance products, exceptional customer service
                  and a commitment to long term relationships
                </p>
              </div>
            </div>
            <div className="bg-[#EFEB05] p-5 flex gap-5 items-start">
              <img
                src={objectiveImg}
                alt=""
                className="w-10 h-10 xl:w-12 xl:h-12"
              />
              <div className="text-[#000000]">
                <h3 className="font-semibold text-lg md:text-xl mb-1">
                  Objective
                </h3>
                <p className="text-sm">
                  Provide ultimate security for customers’ assets and welfare
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="bg-[#7AB58D0D] py-10 md:pt-14 lg:pt-16 px-7 md:px-20 xl:px-[140px] 2xl:px-[170px]">
        <h2 className="text-[#000000] font-semibold text-2xl md:text-3xl mb-[73px] text-center">
          Our Priority is to exceed the <br className="hidden md:block" />
          expectations of all our Stakeholders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5">
          {/* Display first 6 priority cards (all except government) */}
          {priorityData.slice(0, 6).map((data, index) => (
            <PriorityCard
              key={`priority-${index}`}
              img={data.img}
              title={data.title}
              description={data.description}
            />
          ))}

          {/* Add a centered container for the government card */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 2xl:col-span-4 flex justify-center mt-6">
            <div className="max-w-sm">
              <PriorityCard
                img={governmentImg}
                title="GOVERNMENT"
                description="Contribute to GDP and economic growth"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 md:py-14 lg:py-16 px-7 md:px-20 xl:px-[140px] 2xl:px-[170px]">
        <div className="mb-10 lg:mb-16 flex gap-3 items-center">
          <div className="h-[29px] flex">
            <div className="w-2 bg-[#141B34]"></div>
            <div className="w-2 bg-[#EFEB05]"></div>
            <div className="w-2 bg-[#1F8340]"></div>
          </div>
          <h2 className="font-semibold text-lg md:text-xl lg:text-3xl">
            Benefits of Partnering With us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 gap-y-20 ">
          {benefitData.map((data, index) => (
            <BenefitCard
              key={index}
              title={data.title}
              description={data.description}
            />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3">
        <img
          src={coreValuesImg}
          alt="core-values"
          className="object-cover w-full h-full"
        />

        <div className="grid grid-cols-2 bg-[#141B34] py-12 px-6 md:py-7 md:px-4 lg:py-16 lg:px-7 min-h-[400px]">
          <div className="text-[#F4F4F4] h-fit">
            <h4 className="underline text-lg lg:text-xl font-semibold mb-2">
              Integrity
            </h4>
            <p className="text-xs">Our word is our bond</p>
          </div>
          <div className="text-[#F4F4F4] h-fit">
            <h4 className="underline text-lg lg:text-xl font-semibold mb-2">
              Articulacy
            </h4>
            <p className="text-xs">Simple process, timely delivery</p>
          </div>
          <div className="text-[#F4F4F4] h-fit">
            <h4 className="underline text-lg lg:text-xl font-semibold mb-2">
              Tenacity
            </h4>
            <p className="text-xs">We follow through</p>
          </div>
          <div className="text-[#F4F4F4] h-fit">
            <h4 className="underline text-lg lg:text-xl font-semibold mb-2">
              Excellence
            </h4>
            <p className="text-xs">We guarantee the best</p>
          </div>
          <div className="text-[#F4F4F4] h-fit">
            <h4 className="underline text-lg lg:text-xl font-semibold mb-2">
              Meticulousness
            </h4>
            <p className="text-xs">Zero tolerance for error</p>
          </div>
        </div>

        <div className="bg-[#1F834026] py-8 px-5 md:py-4 md:px-2.5 lg:py-10 lg:px-5">
          <h5 className="font-semibold text-xl lg:text-2xl mb-8 lg:mb-11">
            Value Proposition
          </h5>
          <div className="pl-1.5 space-y-5">
            <div className="flex items-center gap-4">
              <img src={settingsImg} alt="settings" />
              <p className="text-[#1F8340] text-sm">
                Competitive premium rates
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img src={settingsImg} alt="settings" />
              <p className="text-[#1F8340] text-sm">Personalized services</p>
            </div>
            <div className="flex items-center gap-4">
              <img src={settingsImg} alt="settings" />
              <p className="text-[#1F8340] text-sm">
                Realtime online relationship management
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img src={settingsImg} alt="settings" />
              <p className="text-[#1F8340] text-sm">
                Easy and timely claims settlement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <img src={settingsImg} alt="settings" />
              <p className="text-[#1F8340] text-sm">
                Seamless risk management solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <Team />

      {/* <!-- Core Values section --> */}
    </>
  );
}

const PriorityCard = ({
  img,
  title,
  description,
}: {
  img: string;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-[#FFFFFF] p-5 text-center rounded-2xl">
      <img src={img} alt="" className="block mx-auto mb-10" />
      <div className="text-[#000000]">
        <h3 className="font-semibold text-base md:text-lg mb-3">{title}</h3>
        <p className="text-sm md:text-base text-[#00000080]">{description}</p>
      </div>
    </div>
  );
};

const priorityData = [
  {
    title: "REGULATOR",
    description: "Committed to corporate governance and compliance",
    img: regulatorImg,
  },
  {
    title: "CUSTOMERS",
    description:
      "Provide efficient and courteous customer service, data privacy & security and fair practices",
    img: customersImg,
  },
  {
    title: "STAFF",
    description:
      "Ensure a safe and healthy work environment, ethical treatment",
    img: staffImg,
  },
  {
    title: "SHAREHOLDERS",
    description:
      "Deliver strong financial performance and maximize shareholder value",
    img: shareholdersImg,
  },
  {
    title: "INSURANCE INDUSTRY",
    description:
      "Be a responsible player, enhancing the penetration of insurance and contribute to the growth of the industry",
    img: insuranceImg,
  },
  {
    title: "COMMUNITY",
    description:
      "Contribute to social responsibility (CSR), environmental sustainability and economic growth",
    img: communityImg,
  },
  // {
  //     title: "GOVERNMENT",
  //     description: "Contribute to GDP and economic growth",
  //     img: governmentImg
  // }
];

const BenefitCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => {
  return (
    <div className="flex gap-7 items-center">
      <div className="border-[3px] border-[#D9D9D9] rounded-lg px-5 py-3.5 text-[#949494] font-semibold text-xl">
        {title}
      </div>
      <div>
        <p className="text-[#000000] text-base xl:text-xl font-medium mb-1.5">
          {description}
        </p>
        <div className="flex">
          <div className="w-6 h-0.5 bg-[#D9D9D9]"></div>
          <div className="w-full h-0.5 bg-[#141B34]"></div>
        </div>
      </div>
    </div>
  );
};

const benefitData = [
  {
    title: "1",
    description: "We are customer centric and flexible",
  },
  {
    title: "2",
    description: "We offer valued personalized services",
  },
  {
    title: "3",
    description: "We give value for your money",
  },
  {
    title: "4",
    description: "We are committed to the ultimate security of our customers",
  },
];
