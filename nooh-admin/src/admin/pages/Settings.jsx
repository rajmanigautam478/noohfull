import { useEffect, useState } from "react";
import { settingsApi } from "../services/api";

export default function Settings() {
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  useEffect(() => {
    settingsApi.get().then(setForm);
  }, []);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }
  function setSocial(field, value) {
    setForm((f) => ({ ...f, social: { ...f.social, [field]: value } }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    await settingsApi.update(form);
    setSaving(false);
    setSavedMsg("Settings saved.");
    setTimeout(() => setSavedMsg(""), 2500);
  }

  if (!form) return null;

  return (
    <div>
      <div className="page-head">
        <div>
          <h2 style={{ fontSize: 22 }}>Settings</h2>
          <p className="subtitle">Company information, contact details, and social links.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="card card-pad" style={{ maxWidth: 720 }}>
        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Company Information</h3>
        <div className="form-grid" style={{ marginBottom: 24 }}>
          <div className="form-field">
            <label>Company Name</label>
            <input
              className="form-input"
              value={form.companyName}
              onChange={(e) => set("companyName", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Tagline</label>
            <input
              className="form-input"
              value={form.tagline}
              onChange={(e) => set("tagline", e.target.value)}
              placeholder="Living Elevated"
            />
          </div>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Contact Details</h3>
        <div className="form-grid" style={{ marginBottom: 24 }}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              className="form-input"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Phone</label>
            <input
              className="form-input"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
          <div className="form-field full">
            <label>Address</label>
            <input
              className="form-input"
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </div>

        <h3 style={{ fontSize: 16, marginBottom: 16 }}>Social Media Links</h3>
        <div className="form-grid" style={{ marginBottom: 8 }}>
          <div className="form-field">
            <label>Facebook</label>
            <input
              className="form-input"
              value={form.social.facebook}
              onChange={(e) => setSocial("facebook", e.target.value)}
              placeholder="https://facebook.com/…"
            />
          </div>
          <div className="form-field">
            <label>Instagram</label>
            <input
              className="form-input"
              value={form.social.instagram}
              onChange={(e) => setSocial("instagram", e.target.value)}
              placeholder="https://instagram.com/…"
            />
          </div>
          <div className="form-field">
            <label>LinkedIn</label>
            <input
              className="form-input"
              value={form.social.linkedin}
              onChange={(e) => setSocial("linkedin", e.target.value)}
              placeholder="https://linkedin.com/company/…"
            />
          </div>
          <div className="form-field">
            <label>WhatsApp Number</label>
            <input
              className="form-input"
              value={form.social.whatsapp}
              onChange={(e) => setSocial("whatsapp", e.target.value)}
              placeholder="+91 00000 00000"
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 18 }}>
          <button className="btn btn-primary" disabled={saving} type="submit">
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {savedMsg && (
            <span style={{ color: "var(--nooh-success)", fontSize: 13.5 }}>{savedMsg}</span>
          )}
        </div>
      </form>
    </div>
  );
}
