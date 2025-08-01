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
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#16a34a", // emerald-600
  "#22c55e", // green-500
  "#4ade80", // green-400
  "#86efac", // green-300
  "#bbf7d0", // green-200
  "#dcfce7", // green-100
];

// Group small slices into "Others"
const groupSmallSlices = (data, threshold = 0.03) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const grouped = [];
  let others = 0;

  data.forEach((item) => {
    if (item.count / total < threshold) {
      others += item.count;
    } else {
      grouped.push(item);
    }
  });

  if (others > 0) {
    grouped.push({ name: "Others", count: others });
  }

  return grouped;
};

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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow border transition hover:shadow-md">
            <p className="text-gray-500">Total Visits</p>
            <h3 className="text-xl font-bold">{summary.total_visits}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow border transition hover:shadow-md">
            <p className="text-gray-500">Unique Visitors</p>
            <h3 className="text-xl font-bold">{summary.unique_visitors}</h3>
          </div>
          <div className="bg-white p-4 rounded shadow border transition hover:shadow-md">
            <p className="text-gray-500">Date Range</p>
            <h3 className="text-sm">
              {summary.date_range.start_date} → {summary.date_range.end_date}
            </h3>
          </div>
        </div>

        {/* Top Pages Table */}
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

        {/* Daily Visits Bar Chart (Scrollable with Fixed Axes) */}
        <div>
          <h3 className="text-lg font-semibold mb-2">📆 Daily Visits</h3>
          <div className="overflow-x-auto border rounded bg-white p-4 shadow">
            <div
              style={{
                width: `${Math.max(daily_visits.length * 60, 900)}px`,
                height: "300px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={daily_visits}
                  margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="visit_date"
                    tickFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-GB")
                    }
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    stroke="#888"
                  />
                  <YAxis stroke="#888" />
                  <Tooltip
                    labelFormatter={(d) =>
                      new Date(d).toLocaleDateString("en-GB")
                    }
                  />
                  <Bar dataKey="count" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Pie Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Browsers",
              data: groupSmallSlices(
                groupCounts(browser_statistics, "browser_name")
              ),
            },
            {
              title: "Devices",
              data: groupSmallSlices(
                groupCounts(device_statistics, "device_type")
              ),
            },
            {
              title: "Operating Systems",
              data: groupSmallSlices(
                groupCounts(operating_system_statistics, "operating_system")
              ),
            },
          ].map(({ title, data }, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow border overflow-hidden"
            >
              <h4 className="text-sm font-semibold mb-3">{title}</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    label={({ name }) =>
                      name.length > 12 ? name.slice(0, 12) + "…" : name
                    }
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
