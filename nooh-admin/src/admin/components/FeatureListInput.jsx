/**
 * FeatureListInput — editable list of short text items (e.g. service
 * features, product highlights). Used so admins don't write raw JSON.
 */
export default function FeatureListInput({ items = [], onChange, placeholder = "Feature" }) {
  function update(idx, value) {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  }
  function add() {
    onChange([...items, ""]);
  }
  function remove(idx) {
    onChange(items.filter((_, i) => i !== idx));
  }

  return (
    <div>
      {items.map((item, idx) => (
        <div className="feature-row" key={idx}>
          <input
            className="form-input"
            value={item}
            placeholder={placeholder}
            onChange={(e) => update(idx, e.target.value)}
          />
          <button type="button" className="btn btn-outline btn-icon" onClick={() => remove(idx)}>
            ✕
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-outline btn-sm" onClick={add}>
        + Add {placeholder}
      </button>
    </div>
  );
}
