import { FaCheckCircle, FaPlus, FaEllipsisV } from "react-icons/fa";

export default function ModuleControlButtons() {
  return (
    <span className="float-end d-flex align-items-center gap-3 text-success">
      <FaCheckCircle />
      <FaPlus className="text-muted" />
      <FaEllipsisV className="text-muted" />
    </span>
  );
}
