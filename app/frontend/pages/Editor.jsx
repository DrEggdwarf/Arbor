import { usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter, pointerWithin, rectIntersection, DragOverlay } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEditorStore } from "../stores/editorStore";
import { getBlockType } from "../stores/blockRegistry";
import { useAutosave } from "../hooks/useAutosave";
import { Topbar } from "../components/Editor/Topbar";
import { ComponentDrawer } from "../components/Editor/ComponentDrawer";
import { TreeDrawer } from "../components/Editor/TreeDrawer";
import { Canvas } from "../components/Editor/Canvas";
import { PropertiesPanel } from "../components/Editor/PropertiesPanel";
import { EditorModal, useEditorModal } from "../components/Editor/EditorModal";
import { ExportModal } from "../components/Editor/ExportModal";
import { InlineSnippetFab } from "../components/Editor/InlineSnippetFab";
import { colors, typography, radii } from "../styles/tokens";
import "../styles/editor.css";

function DragGhost({ activeId }) {
  if (!activeId) return null;
  const isDrawer = String(activeId).startsWith("drawer-");

  if (isDrawer) {
    const typeId = String(activeId).replace("drawer-", "");
    const spec = getBlockType(typeId);
    if (!spec) return null;
    return (
      <div style={{
        padding: "10px 16px",
        background: colors.surface,
        border: `1.5px solid ${colors.accentBright}`,
        borderRadius: radii.lg,
        boxShadow: colors.shadow.elevated,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: typography.fontFamily.body,
        fontSize: typography.fontSize.md,
        color: colors.text.primary,
        pointerEvents: "none",
        minWidth: 160,
      }}>
        <FontAwesomeIcon icon={spec.icon} style={{ color: colors.accentBright }} />
        {spec.label}
      </div>
    );
  }

  // Canvas block ghost — show block type + icon
  const report = useEditorStore.getState().report;
  const block = report?.content?.blocks?.find((b) => b.id === activeId);
  const spec = block ? getBlockType(block.type) : null;

  return (
    <div style={{
      padding: "10px 16px",
      background: colors.surface,
      border: `1.5px solid ${colors.blockHover}`,
      borderRadius: radii.md,
      boxShadow: colors.shadow.elevated,
      opacity: 0.92,
      fontFamily: typography.fontFamily.body,
      fontSize: typography.fontSize.md,
      color: colors.text.primary,
      pointerEvents: "none",
      minWidth: 200,
      maxWidth: 400,
      display: "flex",
      alignItems: "center",
      gap: 8,
    }}>
      <FontAwesomeIcon icon={spec?.icon || "cube"} style={{ color: colors.blockHover, fontSize: 12 }} />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {spec?.label || "Bloc"}
      </span>
    </div>
  );
}

export default function Editor() {
  const { report } = usePage().props;
  const setReport = useEditorStore((s) => s.setReport);
  const storeReport = useEditorStore((s) => s.report);
  const addBlock = useEditorStore((s) => s.addBlock);
  const moveBlock = useEditorStore((s) => s.moveBlock);
  const [activeId, setActiveId] = useState(null);
  const { modal, openModal, closeModal } = useEditorModal();

  useAutosave(report?.id);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  useEffect(() => {
    if (report && (!storeReport || storeReport.id !== report.id)) {
      setReport({
        ...report,
        content: report.content?.blocks ? report.content : { version: "1.0", meta: {}, blocks: [] },
      });
    }
  }, [report, storeReport?.id, setReport]);

  // Global click-to-copy for cartouches
  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest(".arbor-cartouche");
      if (el) {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard?.writeText(el.textContent);
        el.style.background = "rgba(26,26,24,0.16)";
        setTimeout(() => { el.style.background = ""; }, 300);
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  if (!storeReport) return null;

  const handleDragStart = (event) => setActiveId(event.active.id);

  // Use pointerWithin for drawer->canvas drops, closestCenter for canvas reorder
  const collisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);
    if (pointerCollisions.length > 0) return pointerCollisions;
    return closestCenter(args);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeData = active.data?.current;

    // Drawer -> Canvas: add new block
    if (activeData?.type === "component") {
      const spec = activeData.block || getBlockType(active.id);
      if (!spec) return;

      addBlock(spec.type, { ...spec.defaultData });
      return;
    }

    // Canvas reorder: sortable block moved
    if (activeData?.type === "block" && active.id !== over.id) {
      const blocks = storeReport.content.blocks;
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        moveBlock(oldIndex, newIndex);
      }
    }
  };

  const handleDragCancel = () => setActiveId(null);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: colors.bg }}>
        <Topbar />
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          <ComponentDrawer />
          <TreeDrawer />
          <Canvas />
          <PropertiesPanel onOpenModal={openModal} />
        </div>
      </div>
      <DragOverlay dropAnimation={null}>
        <DragGhost activeId={activeId} />
      </DragOverlay>
      {modal && modal.blockType !== "export" && <EditorModal blockId={modal.blockId} blockType={modal.blockType} onClose={closeModal} />}
      {modal && modal.blockType === "export" && <ExportModal onClose={closeModal} />}
      <InlineSnippetFab onExport={() => openModal("__export__", "export")} />
    </DndContext>
  );
}
