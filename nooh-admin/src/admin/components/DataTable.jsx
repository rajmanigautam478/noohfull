/**
 * DataTable — a generic, reusable list table.
 *
 * columns: [{ key, label, render?(row) }]
 * rows: array of data objects (each needs an `id`)
 * actions(row): returns JSX for the row's action buttons (edit/delete/etc.)
 */
export default function DataTable({ columns, rows, actions, emptyTitle, emptyHint }) {
  if (!rows || rows.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <h3>{emptyTitle || "Nothing here yet"}</h3>
          <p>{emptyHint || "Items you add will show up in this list."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th style={{ textAlign: "right" }}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
              {actions && (
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{actions(row)}</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
