import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import {
  FaUsers,
  FaUserCheck,
  FaArchive,
  FaBan,
  FaCrown,
  FaMoneyBillWave,
  FaHeart,
} from "react-icons/fa";
import adminAxios from "../../Axios Instance/adminAxios";

const STATUS_COLORS = { active: "#2F4A3E", archived: "#C89B3C", blacklisted: "#7A1F2B" };
const GENDER_COLORS = ["#1E90FF", "#FF69B4", "#A67C2E"];
const PLAN_COLORS = { Basic: "#94a3b8", Gold: "#C89B3C", Platinum: "#7A1F2B" };

const StatCard = ({ icon, label, value, tone = "text-maroon", bg = "bg-white" }) => (
  <div className={`${bg} rounded-xl shadow-sm p-5 flex items-center gap-4`}>
    <div className={`w-11 h-11 rounded-full bg-black/5 flex items-center justify-center ${tone} text-lg shrink-0`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500 uppercase tracking-wide truncate">{label}</p>
      <p className="text-2xl font-bold text-ink">{value}</p>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <h3 className="text-sm font-semibold text-gray-700 mb-4">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

const AdminStatsPage = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => (await adminAxios.get("/admin/stats")).data,
    refetchInterval: 60000,
  });

  if (isLoading) return <p className="text-center text-gray-500 py-16">Loading dashboard…</p>;
  if (isError || !data) return <p className="text-center text-red-500 py-16">Failed to load stats.</p>;

  const { profiles, users, premium, engagement, charts } = data;

  const genderData = [
    { name: "Male", value: profiles.male },
    { name: "Female", value: profiles.female },
    { name: "Other/Unspecified", value: profiles.other },
  ].filter((d) => d.value > 0);

  const statusData = [
    { name: "Active", key: "active", value: profiles.active },
    { name: "Archived", key: "archived", value: profiles.archived },
    { name: "Blacklisted", key: "blacklisted", value: profiles.blacklisted },
  ];

  const planData = Object.entries(premium.planCounts).map(([plan, count]) => ({ plan, count }));

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Live overview of the platform.</p>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={<FaUsers />} label="Total Profiles" value={profiles.total} />
        <StatCard icon={<FaUserCheck />} label="Active Profiles" value={profiles.active} tone="text-forest" />
        <StatCard icon={<FaArchive />} label="Archived" value={profiles.archived} tone="text-gold-dark" />
        <StatCard icon={<FaBan />} label="Blacklisted" value={profiles.blacklisted} tone="text-maroon" />
        <StatCard icon={<FaUsers />} label="Registered Accounts" value={users.total} />
        <StatCard icon={<FaCrown />} label="Premium Members" value={premium.total} tone="text-gold-dark" />
        <StatCard
          icon={<FaMoneyBillWave />}
          label="Est. Revenue"
          value={`$${engagement.estimatedRevenue.toLocaleString()}`}
          tone="text-forest"
        />
        <StatCard icon={<FaHeart />} label="Success Stories" value={engagement.successStories} />
      </div>

      {premium.mostCommonPlan && (
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex items-center gap-3">
          <FaCrown className="text-gold-dark text-xl shrink-0" />
          <p className="text-sm text-gray-700">
            Most popular plan among paid members:{" "}
            <span className="font-semibold text-ink">{premium.mostCommonPlan}</span>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Profile Status Breakdown">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Gender Distribution">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" outerRadius={90} label>
                {genderData.map((_, i) => (
                  <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Premium Plan Distribution">
          {planData.length ? (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={planData} dataKey="count" nameKey="plan" outerRadius={90} label>
                  {planData.map((entry) => (
                    <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan] || "#999"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="h-full flex items-center justify-center text-gray-400 text-sm">
              No premium members yet.
            </p>
          )}
        </ChartCard>

        <ChartCard title="New Profiles Per Month">
          <ResponsiveContainer>
            <LineChart data={charts.signupsByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#7A1F2B" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Occupations">
          <ResponsiveContainer>
            <BarChart data={charts.topOccupations} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} fontSize={12} />
              <YAxis type="category" dataKey="occupation" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#C89B3C" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top Locations">
          <ResponsiveContainer>
            <BarChart data={charts.topLocations} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" allowDecimals={false} fontSize={12} />
              <YAxis type="category" dataKey="location" width={100} fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#2F4A3E" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminStatsPage;
