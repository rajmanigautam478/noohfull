import { useEffect, useState } from "react";
import { heroApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";

const EMPTY = { heading: "", subheading: "", image: [], ctaText: "", ctaLink: "" };

export default function HeroBanner() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    heroApi.list().then((data) => {
      setSlides(data);
      setLoading(false);
    });
  }
  useEffect(refresh, []);

  async function handleSave(form) {
    setSaving(true);
    const payload = { ...form, image: form.image?.[0] || "" };
    if (form.id) await heroApi.update(form.id, payload);
    else await heroApi.create(payload);
    setSaving(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete() {
    await heroApi.remove(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Hero Banner</h2>
          <p className="subtitle">
            Manage the headline, image, and call-to-action shown at the top of your homepage.
            Add multiple slides for a rotating banner.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setEditing({ ...EMPTY, image: [] })}
        >
          + Add Slide
        </button>
      </div>

      {!loading && (
        <DataTable
          columns={[
            {
              key: "heading",
              label: "Slide",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {row.image ? (
                    <img
                      src={row.image}
                      alt=""
                      style={{ width: 50, height: 32, borderRadius: 6, objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: 50, height: 32, borderRadius: 6, background: "var(--nooh-cream)" }} />
                  )}
                  <strong>{row.heading}</strong>
                </div>
              ),
            },
            { key: "subheading", label: "Subheading" },
            { key: "ctaText", label: "CTA" },
          ]}
          rows={slides}
          emptyTitle="No hero slides yet"
          emptyHint='Click "Add Slide" to set what visitors see first on your homepage.'
          actions={(row) => (
            <>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setEditing({ ...row, image: row.image ? [row.image] : [] })}
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
        <HeroForm
          initial={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete slide?"
          message={`The "${deleting.heading}" slide will be permanently removed.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function HeroForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Modal
      title={form.id ? "Edit Slide" : "Add Slide"}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={saving || !form.heading}
            onClick={() => onSave(form)}
          >
            {saving ? "Saving…" : "Save Slide"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-field full">
          <label>Heading</label>
          <input
            className="form-input"
            value={form.heading}
            onChange={(e) => set("heading", e.target.value)}
            placeholder="Living Elevated"
          />
        </div>
        <div className="form-field full">
          <label>Subheading</label>
          <textarea
            className="form-textarea"
            value={form.subheading}
            onChange={(e) => set("subheading", e.target.value)}
            placeholder="Premium interior solutions crafted around you."
          />
        </div>
        <div className="form-field">
          <label>Button Text</label>
          <input
            className="form-input"
            value={form.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
            placeholder="Get Consultation"
          />
        </div>
        <div className="form-field">
          <label>Button Link</label>
          <input
            className="form-input"
            value={form.ctaLink}
            onChange={(e) => set("ctaLink", e.target.value)}
            placeholder="/contact"
          />
        </div>
        <div className="form-field full">
          <label>Background Image</label>
          <ImageUploader images={form.image} onChange={(v) => set("image", v)} multiple={false} />
        </div>
      </div>
    </Modal>
  );
}
