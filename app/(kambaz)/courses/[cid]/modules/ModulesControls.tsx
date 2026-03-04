import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "react-bootstrap";
import ModuleEditor from "./ModuleEditor";
import { FaBan, FaPlus } from "react-icons/fa6";
import GreenCheckmark from "./GreenCheckmark";
import { useState } from "react";
export default function ModulesControls({
  moduleName,
  setModuleName,
  addModule,
  canManageModules = true,
}: {
  moduleName: string;
  setModuleName: (title: string) => void;
  addModule: () => void;
  canManageModules?: boolean;
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div id="wd-modules-controls" className="text-nowrap">
      {canManageModules && (
        <>
          <Button
            variant="danger"
            size="lg"
            className="me-1 float-end"
            id="wd-add-module-btn"
            onClick={handleShow}
          >
            <FaPlus
              className="position-relative me-2"
              style={{ bottom: "1px" }}
            />
            Module
          </Button>
          <ModuleEditor
            show={show}
            handleClose={handleClose}
            dialogTitle="Add Module"
            moduleName={moduleName}
            setModuleName={setModuleName}
            addModule={addModule}
          />
          <Dropdown className="float-end me-2">
            <DropdownToggle
              variant="secondary"
              size="lg"
              id="wd-publish-all-btn"
            >
              <GreenCheckmark /> Publish All
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem id="wd-publish-all">
                <GreenCheckmark /> Publish All
              </DropdownItem>
              <DropdownItem id="wd-publish-all-modules-and-items">
                <GreenCheckmark /> Publish all modules and items
              </DropdownItem>
              <DropdownItem id="wd-publish-modules-only">
                <GreenCheckmark /> Publish modules only
              </DropdownItem>
              <DropdownItem id="wd-unpublish-all-modules-and-items">
                <FaBan className="text-muted" /> Unpublish all modules and items
              </DropdownItem>
              <DropdownItem id="wd-unpublish-modules-only">
                <FaBan className="text-muted" /> Unpublish modules only
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </>
      )}
      <Button
        variant="secondary"
        size="lg"
        className="float-end me-2"
        id="wd-view-progress"
      >
        View Progress
      </Button>
      <Button
        variant="secondary"
        size="lg"
        className="float-end me-2"
        id="wd-collapse-all"
      >
        Collapse All
      </Button>
    </div>
  );
}
