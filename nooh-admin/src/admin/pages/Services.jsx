import { useEffect, useState } from "react";
import { servicesApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";
import FeatureListInput from "../components/FeatureListInput";

const EMPTY = {
  title: "",
  category: "",
  description: "",
  features: [],
  images: [],
  ctaText: "Get Quote",
  ctaLink: "/contact",
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, {...} = edit
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    servicesApi.list().then((data) => {
      setServices(data);
      setLoading(false);
    });
  }

  useEffect(refresh, []);

  async function handleSave(form) {
    setSaving(true);
    if (form.id) await servicesApi.update(form.id, form);
    else await servicesApi.create(form);
    setSaving(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete() {
    await servicesApi.remove(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Services</h2>
          <p className="subtitle">Manage the services shown on your Services page.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + Add Service
        </button>
      </div>

      {!loading && (
        <DataTable
          columns={[
            {
              key: "title",
              label: "Service",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {row.images?.[0] ? (
                    <img
                      src={row.images[0]}
                      alt=""
                      style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 8,
                        background: "var(--nooh-cream)",
                      }}
                    />
                  )}
                  <strong>{row.title}</strong>
                </div>
              ),
            },
            { key: "category", label: "Category" },
            {
              key: "features",
              label: "Features",
              render: (row) => `${row.features?.length || 0} listed`,
            },
            { key: "ctaText", label: "CTA Button" },
          ]}
          rows={services}
          emptyTitle="No services yet"
          emptyHint='Click "Add Service" to create your first one.'
          actions={(row) => (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => setEditing(row)}>
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
        <ServiceForm
          initial={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete service?"
          message={`"${deleting.title}" will be permanently removed from your Services page.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ServiceForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Modal
      title={form.id ? "Edit Service" : "Add Service"}
      onClose={onCancel}
      wide
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={saving || !form.title}
            onClick={() => onSave(form)}
          >
            {saving ? "Saving…" : "Save Service"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-field">
          <label>Service Title</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Stretch Ceiling Solutions"
          />
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            className="form-input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Ceilings"
          />
        </div>

        <div className="form-field full">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Premium stretch ceiling systems with endless design possibilities…"
          />
        </div>

        <div className="form-field full">
          <label>Features</label>
          <FeatureListInput
            items={form.features}
            onChange={(v) => set("features", v)}
            placeholder="Feature"
          />
        </div>

        <div className="form-field">
          <label>CTA Button Text</label>
          <input
            className="form-input"
            value={form.ctaText}
            onChange={(e) => set("ctaText", e.target.value)}
            placeholder="Get Quote"
          />
        </div>
        <div className="form-field">
          <label>CTA Button Link</label>
          <input
            className="form-input"
            value={form.ctaLink}
            onChange={(e) => set("ctaLink", e.target.value)}
            placeholder="/contact"
          />
        </div>

        <div className="form-field full">
          <label>Images</label>
          <ImageUploader images={form.images} onChange={(v) => set("images", v)} />
        </div>
      </div>
    </Modal>
  );
}
