import { useEffect, useMemo, useState } from "react";
import { projectsApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";

const EMPTY = { title: "", category: "", location: "", description: "", gallery: [] };

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    projectsApi.list().then((data) => {
      setProjects(data);
      setLoading(false);
    });
  }
  useEffect(refresh, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category).filter(Boolean)))],
    [projects]
  );
  const filtered = projects.filter(
    (p) => categoryFilter === "All" || p.category === categoryFilter
  );

  async function handleSave(form) {
    setSaving(true);
    if (form.id) await projectsApi.update(form.id, form);
    else await projectsApi.create(form);
    setSaving(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete() {
    await projectsApi.remove(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Projects</h2>
          <p className="subtitle">Manage completed/featured projects shown on your Projects page.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + Add Project
        </button>
      </div>

      <div className="toolbar">
        <select
          className="select-filter"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {!loading && (
        <DataTable
          columns={[
            {
              key: "title",
              label: "Project",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {row.gallery?.[0] ? (
                    <img
                      src={row.gallery[0]}
                      alt=""
                      style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--nooh-cream)" }} />
                  )}
                  <strong>{row.title}</strong>
                </div>
              ),
            },
            { key: "category", label: "Category" },
            { key: "location", label: "Location" },
            {
              key: "gallery",
              label: "Gallery",
              render: (row) => `${row.gallery?.length || 0} images`,
            },
          ]}
          rows={filtered}
          emptyTitle="No projects yet"
          emptyHint='Click "Add Project" to feature your first project.'
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
        <ProjectForm
          initial={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete project?"
          message={`"${deleting.title}" will be permanently removed from your Projects page.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ProjectForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Modal
      title={form.id ? "Edit Project" : "Add Project"}
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
            {saving ? "Saving…" : "Save Project"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-field">
          <label>Project Title</label>
          <input
            className="form-input"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Coastal Villa Renovation"
          />
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            className="form-input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Residential"
          />
        </div>
        <div className="form-field full">
          <label>Location</label>
          <input
            className="form-input"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="Goa, India"
          />
        </div>
        <div className="form-field full">
          <label>Description</label>
          <textarea
            className="form-textarea"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </div>
        <div className="form-field full">
          <label>Gallery Images</label>
          <ImageUploader images={form.gallery} onChange={(v) => set("gallery", v)} />
        </div>
      </div>
    </Modal>
  );
}
