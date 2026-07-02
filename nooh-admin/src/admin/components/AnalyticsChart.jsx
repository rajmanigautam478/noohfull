import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#06b6d4"];

export function ContentDistributionChart({ stats }) {
  const data = [
    { name: "Services", value: stats?.services ?? 0 },
    { name: "Products", value: stats?.products ?? 0 },
    { name: "Projects", value: stats?.projects ?? 0 },
    { name: "Testimonials", value: stats?.testimonials ?? 0 },
    { name: "Inquiries", value: stats?.inquiries ?? 0 },
  ];

  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 17, marginBottom: 18 }}>Content Distribution</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--nooh-border, #e5e7eb)" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function InquiriesTrendChart({ trend }) {
  // trend = [{ date: "2026-06-01", count: 4 }, ...]
  if (!trend || trend.length === 0) {
    return (
      <div className="card card-pad">
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>Inquiries Trend</h3>
        <p style={{ color: "var(--nooh-text-muted)", fontSize: 14 }}>
          Not enough data yet to plot a trend.
        </p>
      </div>
    );
  }
  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 17, marginBottom: 18 }}>Inquiries Trend (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={trend} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--nooh-border, #e5e7eb)" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ActivityBreakdownChart({ activity }) {
  // group activity items by a type field, e.g. "service", "product", "inquiry"
  const counts = (activity || []).reduce((acc, item) => {
    const key = item.type || "other";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  if (data.length === 0) {
    return (
      <div className="card card-pad">
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>Activity Breakdown</h3>
        <p style={{ color: "var(--nooh-text-muted)", fontSize: 14 }}>
          No activity to break down yet.
        </p>
      </div>
    );
  }

  return (
    <div className="card card-pad">
      <h3 style={{ fontSize: 17, marginBottom: 18 }}>Activity Breakdown</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%" 
            outerRadius={90}
            label={({ name, percent }) => ${name} ${(percent * 100).toFixed(0)}%}
          >
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}