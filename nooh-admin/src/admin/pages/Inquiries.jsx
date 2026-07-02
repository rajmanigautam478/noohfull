import { useEffect, useMemo, useState } from "react";
import { inquiriesApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import Badge from "../components/Badge";

export default function Inquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewing, setViewing] = useState(null);

  function refresh() {
    setLoading(true);
    inquiriesApi.list().then((data) => {
      setInquiries(data);
      setLoading(false);
    });
  }
  useEffect(refresh, []);

  const filtered = useMemo(
    () =>
      inquiries.filter((i) => {
        const matchesSearch =
          i.name?.toLowerCase().includes(search.toLowerCase()) ||
          i.email?.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === "All" || i.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [inquiries, search, statusFilter]
  );

  async function toggleStatus(row) {
    const next = row.status === "resolved" ? "new" : "resolved";
    await inquiriesApi.markStatus(row.id, next);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Contact Inquiries</h2>
          <p className="subtitle">Messages submitted through your website's contact form.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="new">New</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {!loading && (
        <DataTable
          columns={[
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "service", label: "Interested In", render: (row) => row.service || "—" },
            {
              key: "date",
              label: "Received",
              render: (row) => new Date(row.date).toLocaleDateString(),
            },
            { key: "status", label: "Status", render: (row) => <Badge status={row.status} /> },
          ]}
          rows={filtered}
          emptyTitle="No inquiries"
          emptyHint="When visitors submit your contact form, they'll show up here."
          actions={(row) => (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setViewing(row)}>
                View
              </button>{" "}
              <button className="btn btn-outline btn-sm" onClick={() => toggleStatus(row)}>
                {row.status === "resolved" ? "Mark New" : "Mark Resolved"}
              </button>
            </>
          )}
        />
      )}

      {viewing && (
        <Modal title="Inquiry Details" onClose={() => setViewing(null)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 14 }}>
            <div><strong>Name:</strong> {viewing.name}</div>
            <div><strong>Email:</strong> {viewing.email}</div>
            {viewing.phone && <div><strong>Phone:</strong> {viewing.phone}</div>}
            {viewing.service && <div><strong>Interested In:</strong> {viewing.service}</div>}
            <div><strong>Received:</strong> {new Date(viewing.date).toLocaleString()}</div>
            <div>
              <strong>Message:</strong>
              <p style={{ marginTop: 6, color: "var(--nooh-text-muted)" }}>{viewing.message}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
