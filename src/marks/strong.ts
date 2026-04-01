import { toggleMark } from "prosemirror-commands";
import { ToolbarButton } from "../core/block";
import { Mark } from "../core/mark";

/**
 * Toolbar button for applying bold formatting.
 *
 * When clicked, it toggles the `strong` (bold) mark on the current selection.
 * The button is highlighted (active) when the selection or cursor is within bold text.
 */
const toolbarButton: ToolbarButton = {
  label: "B",
  command: (state: any, dispatch: any) => {
    const mark = state.schema.marks.strong;
    if (!mark) return false;
    return toggleMark(mark)(state, dispatch);
  },
  isActive: (state: any) => {
    const { from, to } = state.selection;
    return state.doc.rangeHasMark(from, to, state.schema.marks.strong);
  },
};

/**
 * Keyboard shortcut for toggling bold formatting.
 *
 * - `Mod+b` (Ctrl+B on Windows/Linux, Cmd+B on macOS) toggles the `strong` mark.
 */
const keymap: Record<string, any> = {
  "Mod-b": (state: any, dispatch: any) => {
    const mark = state.schema.marks.strong;
    if (!mark) return false;
    return toggleMark(mark)(state, dispatch);
  },
};

/**
 * Bold (strong) mark for the Kateb editor.
 *
 * This mark corresponds to the `<strong>` HTML element and is typically used to emphasise text.
 * It can be applied via the toolbar button (B) or the keyboard shortcut `Mod+b`.
 *
 * The mark is built using the `Mark` class and includes:
 * - A ProseMirror mark specification that parses `<strong>` and `<b>` tags.
 * - A toolbar button for toggling the mark.
 * - A keyboard shortcut (`Mod+b`) for quick toggling.
 */
export const strongMark = new Mark({
  name: "strong",
  spec: {
    parseDOM: [{ tag: "strong" }, { tag: "b", getAttrs: () => null }],
    toDOM() {
      return ["strong", 0];
    },
  },
  toolbarButtons: [toolbarButton],
  keymap,
});
