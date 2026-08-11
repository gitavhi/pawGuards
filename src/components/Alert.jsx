import { useAlert } from "../context/AlertContext";

export default function Alert() {
  const { alert } = useAlert();

  if (!alert) return null;

  return (
    <div className="container" style={{ paddingTop: "20px" }}>
      <div className={`alert alert-${alert.type}`}>{alert.message}</div>
    </div>
  );
}
