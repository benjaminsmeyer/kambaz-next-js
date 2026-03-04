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
      <FaPencil onClick={() => editModule(moduleId)} className="text-primary" />
      <FaTrash className="text-danger" onClick={() => deleteModule(moduleId)} />
      <FaCheckCircle />
      <FaPlus className="text-muted" />
      <FaEllipsisV className="text-muted" />
    </span>
  );
}
