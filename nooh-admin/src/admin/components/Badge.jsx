export default function Badge({ status }) {
  const cls = status === "resolved" ? "badge-resolved" : "badge-new";
  return <span className={`badge ${cls}`}>{status}</span>;
}
