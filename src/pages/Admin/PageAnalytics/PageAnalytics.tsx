import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboardLayout from "@/components/Layout/AdminLayout/AdminLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = [
  "#16a34a", // emerald-600
  "#22c55e", // green-500
  "#4ade80", // green-400
  "#86efac", // green-300
  "#bbf7d0", // green-200
  "#dcfce7", // green-100
];

const AnalyticsDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://dash.npfinsurance.com/api/page-visits/analytics")
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Analytics fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  const groupCounts = (arr: any[], key: string) => {
    const grouped: Record<string, number> = {};
    arr.forEach((item) => {
      const name = item[key] || "Unknown";
      grouped[name] = (grouped[name] || 0) + item.count;
    });
    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  };

  const cleanUrl = (url: string) => {
    try {
      const u = new URL(url, "http://localhost");
      return u.pathname;
    } catch {
      return url;
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-gray-500">Loading analytics...</div>
      </AdminDashboardLayout>
    );
  }

  const {
    summary,
    top_pages,
    daily_visits,
    browser_statistics,
    device_statistics,
    operating_system_statistics,
  } = data;

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-8">
        <h2 className="text-2xl font-bold">📊 Website Analytics</h2>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow border">
            <p className="text-gray-500">Total Visits</p>
            <h3 className="text-xl font-bold">{summary.total_visits}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <p className="text-gray-500">Unique Visitors</p>
            <h3 className="text-xl font-bold">{summary.unique_visitors}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow border">
            <p className="text-gray-500">Date Range</p>
            <h3 className="text-sm">
              {summary.date_range.start_date} → {summary.date_range.end_date}
            </h3>
          </div>
        </div>

        {/* Top Pages */}
        <div>
          <h3 className="text-lg font-semibold mb-2">🏆 Top Pages</h3>
          <div className="overflow-x-auto border rounded">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                <tr>
                  <th className="p-3 border">Title</th>
                  <th className="p-3 border">URL</th>
                  <th className="p-3 border">Views</th>
                </tr>
              </thead>
              <tbody>
                {top_pages.map((page: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-3 border">{page.page_title}</td>
                    <td className="p-3 border text-green-600 break-all">
                      {cleanUrl(page.page_url)}
                    </td>
                    <td className="p-3 border">{page.visit_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Daily Visits Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2">📆 Daily Visits</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={daily_visits}>
              <XAxis
                dataKey="visit_date"
                tickFormatter={(d) => new Date(d).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Browsers",
              data: groupCounts(browser_statistics, "browser_name"),
            },
            {
              title: "Devices",
              data: groupCounts(device_statistics, "device_type"),
            },
            {
              title: "Operating Systems",
              data: groupCounts(
                operating_system_statistics,
                "operating_system"
              ),
            },
          ].map(({ title, data }, index) => (
            <div key={index} className="bg-white p-4 rounded shadow border">
              <h4 className="text-sm font-semibold mb-3">{title}</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label
                  >
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AnalyticsDashboard;
