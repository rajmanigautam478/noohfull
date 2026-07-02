import { useEffect, useState } from "react";
import { dashboardApi, activityApi } from "../services/api";
import StatCard from "../components/StatCard";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    dashboardApi.stats().then(setStats);
    activityApi.list().then(setActivity);
  }, []);

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 24 }}>Welcome back</h2>
          <p className="subtitle">Here's what's happening across the NOOH site today.</p>
        </div>
      </div>

      <div className="stat-grid">
        <StatCard icon="✦" value={stats?.services ?? "—"} label="Total Services" />
        <StatCard icon="◧" value={stats?.products ?? "—"} label="Total Products" />
        <StatCard icon="◫" value={stats?.projects ?? "—"} label="Total Projects" />
        <StatCard icon="❝" value={stats?.testimonials ?? "—"} label="Total Testimonials" />
        <StatCard
          icon="✉"
          value={stats?.inquiries ?? "—"}
          label={`Contact Inquiries${stats?.newInquiries ? ` (${stats.newInquiries} new)` : ""}`}
        />
      </div>

      <div className="card card-pad">
        <h3 style={{ fontSize: 17, marginBottom: 18 }}>Recent Activity</h3>
        {activity.length === 0 ? (
          <p style={{ color: "var(--nooh-text-muted)", fontSize: 14 }}>
            No activity yet. Changes you make in the admin panel will show up here.
          </p>
        ) : (
          <div className="activity-list">
            {activity.slice(0, 10).map((item) => (
              <div className="activity-item" key={item.id}>
                <span className="activity-dot" />
                <div>
                  <div>{item.message}</div>
                  <div className="activity-time">{timeAgo(item.date)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
