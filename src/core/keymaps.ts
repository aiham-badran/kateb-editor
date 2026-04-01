import { keymap } from "prosemirror-keymap";
import { undo, redo } from "prosemirror-history";
import { Schema } from "prosemirror-model";
import { Block } from "./block";
import { Mark } from "./mark";

const insertHardBreak = (state: any, dispatch?: any): boolean => {
  const brNode = state.schema.nodes.hard_break?.create();
  if (!brNode) return false;
  if (dispatch) {
    dispatch(state.tr.replaceSelectionWith(brNode).scrollIntoView());
  }
  return true;
};

export const createKeymapPlugin = (
  blocks: Block[],
  marks: Mark[],
  schema: Schema,
) => {
  const combinedKeymap: Record<string, any> = {
    "Shift-Enter": insertHardBreak,
    "Mod-Enter": insertHardBreak,
    "Mod-z": undo,
    "Mod-y": redo,
    "Mod-Shift-z": redo,
  };

  for (const block of blocks) {
    if (block.keymap) {
      Object.assign(combinedKeymap, block.keymap);
    }
  }
  for (const mark of marks) {
    if (mark.keymap) {
      Object.assign(combinedKeymap, mark.keymap);
    }
  }

  return keymap(combinedKeymap);
};
