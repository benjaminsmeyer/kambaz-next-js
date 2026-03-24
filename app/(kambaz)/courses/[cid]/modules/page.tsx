/* eslint-disable @next/next/no-assign-module-variable */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useParams } from "next/navigation";
import { FormControl, ListGroup, ListGroupItem } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import ModulesControls from "./ModulesControls";
import ModuleControlButtons from "./ModuleControlButtons";
import LessonControlButtons from "./LessonControlButtons";
import { useState, useEffect } from "react";
import { setModules, editModule, updateModule } from "./reducer";
import { useSelector, useDispatch } from "react-redux";
import * as client from "../../client";
import { RootState } from "../../../store";
export default function Modules() {
  const { cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector(
    (state: RootState) => state.accountReducer,
  ) as any;
  const canEditModules = ["FACULTY", "ADMIN", "TA"].includes(currentUser?.role);

  const onCreateModuleForCourse = async () => {
    if (!canEditModules) return;
    if (!cid) return;
    const newModule = { name: moduleName, course: cid };
    const module = await client.createModuleForCourse(cid as string, newModule);
    dispatch(setModules([...modules, module]));
  };
  const onRemoveModule = async (moduleId: string) => {
    if (!canEditModules) return;
    await client.deleteModule(moduleId);
    dispatch(setModules(modules.filter((m: any) => m._id !== moduleId)));
  };

  const onUpdateModule = async (module: any) => {
    if (!canEditModules) return;
    await client.updateModule(module);
    const newModules = modules.map((m: any) =>
      m._id === module._id ? module : m,
    );
    dispatch(setModules(newModules));
  };

  useEffect(() => {
    const fetchModules = async () => {
      const modules = await client.findModulesForCourse(cid as string);
      dispatch(setModules(modules));
    };
    fetchModules();
  }, [cid, dispatch]);
  const [moduleName, setModuleName] = useState("");
  const { modules } = useSelector((state: RootState) => state.modulesReducer);
  return (
    <div>
      <>
        <ModulesControls
          canManageModules={canEditModules}
          setModuleName={setModuleName}
          moduleName={moduleName}
          addModule={() => {
            onCreateModuleForCourse();
          }}
        />
        <br />
        <br />
        <br />
        <br />
      </>
      <ListGroup id="wd-modules" className="rounded-0">
        {modules.map((module: any) => (
          <ListGroupItem
            key={module._id}
            className="wd-module p-0 mb-5 fs-5 border-gray"
          >
            <div className="wd-title p-3 ps-2 bg-secondary d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <span className="flex-grow-1">
                {(!module.editing || !canEditModules) && module.name}
              </span>
              {module.editing && canEditModules && (
                <FormControl
                  className="d-inline-block"
                  onChange={(e) =>
                    dispatch(updateModule({ ...module, name: e.target.value }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onUpdateModule({ ...module, editing: false });
                    }
                  }}
                  defaultValue={module.name}
                />
              )}

              {canEditModules && (
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={(moduleId) => onRemoveModule(moduleId)}
                  editModule={(moduleId) => dispatch(editModule(moduleId))}
                />
              )}
            </div>
            {module.lessons && (
              <ListGroup className="wd-lessons rounded-0">
                {module.lessons.map((lesson: any) => (
                  <ListGroupItem
                    key={lesson._id}
                    className="wd-lesson p-3 ps-1"
                  >
                    <BsGripVertical className="me-2 fs-3" /> {lesson.name}
                    {canEditModules && <LessonControlButtons />}
                  </ListGroupItem>
                ))}
              </ListGroup>
            )}
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
}
