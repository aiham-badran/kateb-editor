import { toggleMark } from "prosemirror-commands";
import { ToolbarButton } from "../core/block";
import { Mark } from "../core/mark";

/**
 * Toolbar button for applying italic formatting.
 *
 * When clicked, it toggles the `em` (italic) mark on the current selection.
 * The button is highlighted (active) when the selection or cursor is within italic text.
 */
const toolbarButton: ToolbarButton = {
  label: "I",
  command: (state, dispatch) => {
    const mark = state.schema.marks.em;
    if (!mark) return false;
    return toggleMark(mark)(state, dispatch);
  },
  isActive: (state) => {
    const { from, to } = state.selection;
    return state.doc.rangeHasMark(from, to, state.schema.marks.em);
  },
};

/**
 * Keyboard shortcut for toggling italic formatting.
 *
 * - `Mod+i` (Ctrl+I on Windows/Linux, Cmd+I on macOS) toggles the `em` mark.
 */
const keymap: Record<string, any> = {
  "Mod-i": (state: any, dispatch: any) => {
    const mark = state.schema.marks.em;
    if (!mark) return false;
    return toggleMark(mark)(state, dispatch);
  },
};

/**
 * Italic (emphasis) mark for the Kateb editor.
 *
 * This mark corresponds to the `<em>` HTML element and is typically used to emphasize text.
 * It can be applied via the toolbar button (I) or the keyboard shortcut `Mod+i`.
 *
 * The mark is built using the `Mark` class and includes:
 * - A ProseMirror mark specification that parses `<em>` and `<i>` tags.
 * - A toolbar button for toggling the mark.
 * - A keyboard shortcut (`Mod+i`) for quick toggling.
 */
export const emMark = new Mark({
  name: "em",
  spec: {
    parseDOM: [{ tag: "em" }, { tag: "i", getAttrs: () => null }],
    toDOM() {
      return ["em", 0];
    },
  },
  toolbarButtons: [toolbarButton],
  keymap,
});
