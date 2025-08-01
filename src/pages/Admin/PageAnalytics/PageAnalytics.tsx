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
  "#16a34a",
  "#22c55e",
  "#4ade80",
  "#86efac",
  "#bbf7d0",
  "#dcfce7",
];

// Types
interface Summary {
  total_visits: number;
  unique_visitors: number;
  date_range: {
    start_date: string;
    end_date: string;
  };
}

interface Page {
  page_title: string;
  page_url: string;
  visit_count: number;
}

interface Visit {
  visit_date: string;
  count: number;
}

interface StatItem {
  [key: string]: string | number;
  count: number;
}

interface AnalyticsData {
  summary: Summary;
  top_pages: Page[];
  daily_visits: Visit[];
  browser_statistics: StatItem[];
  device_statistics: StatItem[];
  operating_system_statistics: StatItem[];
}

// Utils
const groupCounts = (arr: StatItem[], key: string) => {
  const grouped: Record<string, number> = {};
  arr.forEach((item) => {
    const name = (item[key] as string) || "Unknown";
    grouped[name] = (grouped[name] || 0) + item.count;
  });
  return Object.entries(grouped).map(([name, count]) => ({ name, count }));
};

const groupSmallSlices = (
  data: { name: string; count: number }[],
  threshold = 0.03
) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const grouped: { name: string; count: number }[] = [];
  let others = 0;

  data.forEach((item) => {
    if (item.count / total < threshold) {
      others += item.count;
    } else {
      grouped.push(item);
    }
  });

  if (others > 0) grouped.push({ name: "Others", count: others });
  return grouped;
};

const cleanUrl = (url: string) => {
  try {
    const u = new URL(url, "http://localhost");
    return u.pathname;
  } catch {
    return url;
  }
};

// Component
export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://dash.npfinsurance.com/api/page-visits/analytics")
      .then((res) => setData(res.data.data))
      .catch((err) => console.error("Analytics fetch failed", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex justify-center items-center h-[300px] text-gray-500 text-sm">
          Loading analytics...
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!data) return null;

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
          {[
            { label: "Total Visits", value: summary.total_visits },
            { label: "Unique Visitors", value: summary.unique_visitors },
            {
              label: "Date Range",
              value: `${summary.date_range.start_date} → ${summary.date_range.end_date}`,
            },
          ].map(({ label, value }, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded shadow border transition hover:shadow-md"
            >
              <p className="text-gray-500">{label}</p>
              <h3 className="text-lg font-bold break-words">{value}</h3>
            </div>
          ))}
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
                {top_pages.map((page, i) => (
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

        {/* Daily Visits Bar Chart */}
        <div>
          <h3 className="text-lg font-semibold mb-2">📆 Daily Visits</h3>
          <div className="overflow-x-auto border rounded bg-white p-4 shadow scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-green-100">
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
}
