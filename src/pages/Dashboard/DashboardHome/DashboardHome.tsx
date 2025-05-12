import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { baseUrl } from "@/services/axios-client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
/* import OverviewCard from "@/components/OverviewCard";
import StatsCard from "@/components/StatsCard";
import TransactionTable from "@/components/TransactionTable"; */

const OverviewCard = ({ title, policies, color, textColor, buttonDesc, onClick, icon }: { title: any, policies: any, color: any, textColor?: any, buttonDesc?: string, onClick?: any, icon: any }) => (
  <div className={`relative p-4 text-white ${color}`}>
    <div className="flex items-center justify-between">
      <img src={icon} alt="fire and special perils" className="w-14 h-14" />
      <div className={`text-center w-fit font-semibold`}>
        <h2 className="leading-3">{policies}</h2>
        <p className="" >Plan(s)</p>
      </div>
    </div>
    {/* <p className="text-[#D3CDCD] text-xs mb-0.5" >3154770389</p> */}
    <h3 className={`text-lg font-semibold mb-1.5 ${textColor}`}>{title}</h3>
    <div className="mb-5">
      <button
        onClick={onClick}
        className="text-[#000000] bg-[#BBBFBD] text-[10px] px-2 py-0.5" >
        Buy New {buttonDesc}
      </button>
    </div>

    <div className="py-2.5 px-3 border-t border-t-[#D3CDCD] -mx-4" >
      <button className="text-sm">
        {`View more details here >>>>>`}
      </button>
    </div>
  </div>
);

const StatsCard = ({ title, value, icon, bgColor }: { title: any, value: any, icon: any, bgColor: any }) => (
  <div className="p-4 bg-white border border-[#D6DDEB] flex items-center space-x-4">
    <div className={`${bgColor} w-[80px] h-[80px] flex items-center justify-center rounded `} >
      <img src={icon} alt="" className="" />
    </div>
    <div>
      <h4 className="font-semibold text-[#7C8493]">{title}</h4>
      <p className="">{value}</p>
    </div>
  </div>
);

/* const TransactionTable = () => (
  <div className="bg-white p-4 rounded-lg shadow overflow-x-scroll">
    <h3 className="text-lg font-semibold mb-4">Recent Online Transactions</h3>
    <table className="w-full text-left border-collapse overflow-x-scroll">
      <thead>
        <tr className="border-b">
          <th className="p-2">Date</th>
          <th className="p-2">Subsidiary</th>
          <th className="p-2">Activity</th>
          <th className="p-2">Amount (₦)</th>
          <th className="p-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="p-2">06 Feb, 2025</td>
          <td className="p-2">Motor Insurance</td>
          <td className="p-2">Premium Payment Travel Insurance</td>
          <td className="p-2">500,000.00</td>
          <td className="p-2 text-green-600">Successful</td>
        </tr>
      </tbody>
    </table>
  </div>
); */



const TransactionTable = ({ transactions }: { transactions: any }) => {
  console.log(transactions);
  return (
    <div className="bg-white p-4 rounded-lg shadow overflow-x-scroll">
      <h3 className="text-lg font-semibold mb-4">Recent Online Transactions</h3>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Date</th>
            <th className="p-2">Subsidiary</th>
            <th className="p-2">Activity</th>
            <th className="p-2">Amount (₦)</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction: any) => (
            <tr key={transaction.id} className="border-b">
              <td className="p-2">
                {format(new Date(transaction.payment.created_at), "dd MMM, yyyy")}
              </td>
              <td className="p-2">{transaction.sub_category}</td>
              <td className="p-2 capitalize">{transaction.insurance_package}</td>
              <td className="p-2">
                {parseFloat(transaction.payment.amount).toLocaleString("en-NG", {
                  minimumFractionDigits: 2,
                })}
              </td>
              <td
                className={`py-2 flex items-center gap-1 lg:gap-2 ${transaction.payment.status === "successful"
                    ? "text-green-600"
                    : "text-yellow-600"
                  }`}
              >
                {transaction.payment.status.charAt(0).toUpperCase() +
                  transaction.payment.status.slice(1)}

                {
                  transaction.payment.status == "pending" && (
                    //navigate to motor-insurance-quote-form to reverify payemnt
                    <Link
                      className="p-1 bg-blue-500 block text-white text-sm rounded"
                      to={`/motor-insurance-quote-form?reference=${transaction.payment.reference}`} >
                      Reverify Payment
                    </Link>
                  )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default function DashboardHomePage() {

  const userData = JSON.parse(sessionStorage.getItem("userData") || "{}");
  const token = sessionStorage.getItem("authToken");
  //console.log(token)
  //Fetch the transaction history from the API
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {

    const fetchTransactionHistory = async () => {
      try {
        const response = await fetch(`${baseUrl}/payments/${userData.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "accept": "application/json",
          },
        });
        //setTransactionHistory(response.data);
        const result = await response.json();
        console.log(result);

        if (response.ok) {
          setTransactionHistory(result.payments.filter((item: any) => item.payment != null && item.payment));
        }
        //setTransactionHistory(result.data);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    }

    fetchTransactionHistory();
  }, [])

  const navigate = useNavigate();

  const handleShowPurchaseOptions = () => {
    setShowModal(true);
  };

  const handleBuyForSelf = () => {
    // Remove vehicleData and documentData from session storage so you can add new vehicle
    sessionStorage.removeItem("vehicleData");
    sessionStorage.removeItem("documentData");
    // Navigate to motor insurance quote landing page
    navigate("/motor-insurance-quote-form");
    setShowModal(false);
  };

  const handleBuyForOthers = () => {
    // Remove vehicleData and documentData from session storage so you can add new vehicle
    sessionStorage.removeItem("vehicleData");
    sessionStorage.removeItem("documentData");
    // Navigate to motor insurance quote landing page with query param for others
    navigate("/motor-insurance-quote-form");
    setShowModal(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="">
          <h2 className="text-2xl font-semibold text-[#374557]">Overview</h2>
          <p className="text-[#374557] " >Find all your updates here</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <OverviewCard
            title="Motor Insurance"
            icon={"/assets/images/car-02.svg"}
            //Currently using all transaction history because we only have motor insurance policy but request dashboard detail from backend later
            policies={transactionHistory.length > 0 ? transactionHistory.length : 0}
            color="bg-[#AFB50F]"
            textColor={"text-[#000000]"}
            buttonDesc="Motor Insurance"
            onClick={handleShowPurchaseOptions}
          />

          <OverviewCard
            title="Fire & Special Perils"
            icon={"/assets/images/fire-02.svg"}
            policies={0}
            color="bg-[#095A39]"
            buttonDesc="Fire & Special Policy"
          />

          <OverviewCard
            title="Occupiers Liability"
            icon={"/assets/images/traffic-02.svg"}
            policies={0}
            color="bg-[#3C8725]"
            buttonDesc="Occupiers Liability Policy"
          />
          <OverviewCard
            title="Burglary/Theft"
            icon={"/assets/images/gun-02.svg"}
            policies={0}
            color="bg-[#141B34]"
            buttonDesc="Burglary/Theft Policy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          <StatsCard
            title="Upcoming Renewal"
            value={transactionHistory.length > 0 ? transactionHistory.length : 0} /* icon="📅" */
            icon="/assets/images/material-symbols_quiz.svg"
            bgColor={"bg-[#687AE8]"}
          />
          <StatsCard
            title="Total Insurance"
            value={transactionHistory.length > 0 ? transactionHistory.length : 0} /* icon="📊" */
            icon="/assets/images/codicon_vm-active.svg"
            bgColor={"bg-[#F3A746]"}
          />
          <StatsCard
            title="Expiry Date"
            value={356} /* icon="⏳" */
            icon="/assets/images/hugeicons_student-card.svg"
            bgColor={"bg-[#5FB9EF]"}
          />
          <StatsCard
            title="Total Passed"
            value={1} /* icon="✅" */
            icon="/assets/images/covid_social-distancing-correct-4.svg"
            bgColor={"bg-[#47AA49]"}
          />
        </div>

        <TransactionTable transactions={transactionHistory} />

        {/* Purchase Options Modal */}
        {showModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)} // Close modal when clicking the background
          >
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
            >
              <h3 className="text-lg font-semibold mb-4 text-center">Purchase Options</h3>
              <p className="text-sm text-gray-600 mb-4 text-center">Please select who you want to purchase motor insurance for</p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleBuyForSelf}
                  className="bg-[#095A39] hover:bg-[#074b2f] text-white py-2 px-4 rounded-md transition-colors"
                >
                  Buy for Self
                </button>
                <button
                  onClick={handleBuyForOthers}
                  className="bg-[#AFB50F] hover:bg-[#909609] text-white py-2 px-4 rounded-md transition-colors"
                >
                  Buy for Others
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}