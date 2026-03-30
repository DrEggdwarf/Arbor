import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";

const createId = () => `b_${uuid().slice(0, 8)}`;

export const useEditorStore = create(
  immer((set, get) => ({
    report: null,
    selectedBlockId: null,
    isDirty: false,

    setReport: (report) =>
      set((state) => {
        state.report = report;
        state.selectedBlockId = null;
        state.isDirty = false;
      }),

    setSelectedBlock: (blockId) =>
      set((state) => {
        state.selectedBlockId = blockId;
      }),

    addBlock: (type, data, index) =>
      set((state) => {
        if (!state.report?.content?.blocks) return;
        const newBlock = { id: createId(), type, data: data || {}, children: [] };
        const { blocks } = state.report.content;
        index !== undefined ? blocks.splice(index, 0, newBlock) : blocks.push(newBlock);
        state.selectedBlockId = newBlock.id;
        state.isDirty = true;
      }),

    updateBlock: (id, data) =>
      set((state) => {
        const block = findBlock(state.report?.content?.blocks, id);
        if (block) {
          Object.assign(block.data, data);
          state.isDirty = true;
        }
      }),

    deleteBlock: (id) =>
      set((state) => {
        if (!state.report?.content?.blocks) return;
        state.report.content.blocks = removeBlock(state.report.content.blocks, id);
        if (state.selectedBlockId === id) state.selectedBlockId = null;
        state.isDirty = true;
      }),

    moveBlock: (fromIndex, toIndex) =>
      set((state) => {
        if (!state.report?.content?.blocks) return;
        const { blocks } = state.report.content;
        if (fromIndex < 0 || toIndex < 0 || fromIndex >= blocks.length) return;
        const [block] = blocks.splice(fromIndex, 1);
        blocks.splice(toIndex, 0, block);
        state.isDirty = true;
      }),

    duplicateBlock: (id) =>
      set((state) => {
        if (!state.report?.content?.blocks) return;
        const { blocks } = state.report.content;
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) return;
        const clone = JSON.parse(JSON.stringify(blocks[index]));
        clone.id = createId();
        blocks.splice(index + 1, 0, clone);
        state.selectedBlockId = clone.id;
        state.isDirty = true;
      }),

    addChildBlock: (parentId, type, data) =>
      set((state) => {
        const parent = findBlock(state.report?.content?.blocks, parentId);
        if (!parent) return;
        if (!parent.children) parent.children = [];
        const newBlock = { id: createId(), type, data: data || {}, children: [] };
        parent.children.push(newBlock);
        state.selectedBlockId = newBlock.id;
        state.isDirty = true;
      }),

    removeChildBlock: (parentId, childId) =>
      set((state) => {
        const parent = findBlock(state.report?.content?.blocks, parentId);
        if (!parent?.children) return;
        parent.children = parent.children.filter((c) => c.id !== childId);
        if (state.selectedBlockId === childId) state.selectedBlockId = parentId;
        state.isDirty = true;
      }),

    updateMeta: (key, value) =>
      set((state) => {
        if (!state.report) return;
        state.report[key] = value;
        state.isDirty = true;
      }),

    markClean: () =>
      set((state) => {
        state.isDirty = false;
      }),
  }))
);

// Pure helpers
function findBlock(blocks, id) {
  if (!blocks) return null;
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.children?.length) {
      const found = findBlock(b.children, id);
      if (found) return found;
    }
  }
  return null;
}

function removeBlock(blocks, id) {
  return blocks
    .filter((b) => b.id !== id)
    .map((b) => ({
      ...b,
      children: b.children ? removeBlock(b.children, id) : [],
    }));
}
