import { FaCheckCircle, FaPlus, FaEllipsisV } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
export default function ModuleControlButtons({
  moduleId,
  deleteModule,
  editModule,
}: {
  moduleId: string;
  deleteModule: (moduleId: string) => void;
  editModule: (moduleId: string) => void;
}) {
  return (
    <span className="float-end d-flex align-items-center gap-3 text-success">
      <button
        type="button"
        className="p-0 border-0 bg-transparent"
        onClick={() => editModule(moduleId)}
        aria-label="Edit module"
      >
        <FaPencil className="text-primary" />
      </button>
      <button
        type="button"
        className="p-0 border-0 bg-transparent"
        onClick={() => deleteModule(moduleId)}
        aria-label="Delete module"
      >
        <FaTrash className="text-danger" />
      </button>
      <FaCheckCircle />
      <FaPlus className="text-muted" />
      <FaEllipsisV className="text-muted" />
    </span>
  );
}
