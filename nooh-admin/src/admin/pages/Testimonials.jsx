import { useEffect, useState } from "react";
import { testimonialsApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";

const EMPTY = { name: "", role: "", message: "", rating: 5, avatar: [] };

export default function Testimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    testimonialsApi.list().then((data) => {
      setItems(data);
      setLoading(false);
    });
  }
  useEffect(refresh, []);

  async function handleSave(form) {
    setSaving(true);
    const payload = { ...form, avatar: form.avatar?.[0] || "" };
    if (form.id) await testimonialsApi.update(form.id, payload);
    else await testimonialsApi.create(payload);
    setSaving(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete() {
    await testimonialsApi.remove(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Testimonials</h2>
          <p className="subtitle">Manage client reviews shown on your Testimonials page.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setEditing({ ...EMPTY, avatar: [] })}
        >
          + Add Testimonial
        </button>
      </div>

      {!loading && (
        <DataTable
          columns={[
            {
              key: "name",
              label: "Client",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {row.avatar ? (
                    <img
                      src={row.avatar}
                      alt=""
                      style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "var(--nooh-cream)",
                      }}
                    />
                  )}
                  <div>
                    <strong>{row.name}</strong>
                    <div style={{ fontSize: 12, color: "var(--nooh-text-muted)" }}>{row.role}</div>
                  </div>
                </div>
              ),
            },
            {
              key: "message",
              label: "Review",
              render: (row) => (
                <span style={{ color: "var(--nooh-text-muted)" }}>
                  {row.message?.length > 70 ? row.message.slice(0, 70) + "…" : row.message}
                </span>
              ),
            },
            { key: "rating", label: "Rating", render: (row) => "★".repeat(row.rating || 0) },
          ]}
          rows={items}
          emptyTitle="No testimonials yet"
          emptyHint='Click "Add Testimonial" to feature your first client review.'
          actions={(row) => (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setEditing({ ...row, avatar: row.avatar ? [row.avatar] : [] })}
              >
                Edit
              </button>{" "}
              <button className="btn btn-danger btn-sm" onClick={() => setDeleting(row)}>
                Delete
              </button>
            </>
          )}
        />
      )}

      {editing && (
        <TestimonialForm
          initial={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete testimonial?"
          message={`The review from "${deleting.name}" will be permanently removed.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function TestimonialForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Modal
      title={form.id ? "Edit Testimonial" : "Add Testimonial"}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={saving || !form.name || !form.message}
            onClick={() => onSave(form)}
          >
            {saving ? "Saving…" : "Save Testimonial"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-field">
          <label>Client Name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Aisha Khan"
          />
        </div>
        <div className="form-field">
          <label>Role / Company</label>
          <input
            className="form-input"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            placeholder="Homeowner, Mumbai"
          />
        </div>
        <div className="form-field full">
          <label>Review</label>
          <textarea
            className="form-textarea"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            placeholder="NOOH transformed our living room ceiling into something out of a dream…"
          />
        </div>
        <div className="form-field">
          <label>Rating</label>
          <select
            className="form-select"
            value={form.rating}
            onChange={(e) => set("rating", Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} star{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field full">
          <label>Avatar (optional)</label>
          <ImageUploader images={form.avatar} onChange={(v) => set("avatar", v)} multiple={false} />
        </div>
      </div>
    </Modal>
  );
}
