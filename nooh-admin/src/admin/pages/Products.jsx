import { useEffect, useMemo, useState } from "react";
import { productsApi } from "../services/api";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import ImageUploader from "../components/ImageUploader";

const EMPTY = { name: "", category: "", price: "", description: "", images: [] };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  function refresh() {
    setLoading(true);
    productsApi.list().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }
  useEffect(refresh, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))],
    [products]
  );

  const filtered = products.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  async function handleSave(form) {
    setSaving(true);
    if (form.id) await productsApi.update(form.id, form);
    else await productsApi.create(form);
    setSaving(false);
    setEditing(null);
    refresh();
  }

  async function handleDelete() {
    await productsApi.remove(deleting.id);
    setDeleting(null);
    refresh();
  }

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Products</h2>
          <p className="subtitle">Manage the products shown on your Products page.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...EMPTY })}>
          + Add Product
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search products…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
              key: "name",
              label: "Product",
              render: (row) => (
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {row.images?.[0] ? (
                    <img
                      src={row.images[0]}
                      alt=""
                      style={{ width: 38, height: 38, borderRadius: 8, objectFit: "cover" }}
                    />
                  ) : (
                    <div style={{ width: 38, height: 38, borderRadius: 8, background: "var(--nooh-cream)" }} />
                  )}
                  <strong>{row.name}</strong>
                </div>
              ),
            },
            { key: "category", label: "Category" },
            { key: "price", label: "Price", render: (row) => row.price || "—" },
          ]}
          rows={filtered}
          emptyTitle="No products found"
          emptyHint="Try a different search or add a new product."
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
        <ProductForm
          initial={editing}
          saving={saving}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${deleting.name}" will be permanently removed from your Products page.`}
          onCancel={() => setDeleting(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}

function ProductForm({ initial, onCancel, onSave, saving }) {
  const [form, setForm] = useState(initial);
  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <Modal
      title={form.id ? "Edit Product" : "Add Product"}
      onClose={onCancel}
      wide
      footer={
        <>
          <button className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={saving || !form.name}
            onClick={() => onSave(form)}
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div className="form-field">
          <label>Product Name</label>
          <input
            className="form-input"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="NOOHSTAR Fiber Optic Kit"
          />
        </div>
        <div className="form-field">
          <label>Category</label>
          <input
            className="form-input"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            placeholder="Lighting"
          />
        </div>
        <div className="form-field">
          <label>Price (optional)</label>
          <input
            className="form-input"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="On request"
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
          <label>Images</label>
          <ImageUploader images={form.images} onChange={(v) => set("images", v)} />
        </div>
      </div>
    </Modal>
  );
}
