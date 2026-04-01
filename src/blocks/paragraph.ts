import { setBlockType } from "prosemirror-commands";
import { Block, ToolbarButton, SlashMenuItem } from "../core/block";

/**
 * Retrieves the current block's direction (`rtl` or `ltr`) from the editor state.
 * If no direction is set, defaults to `'rtl'` (the default for Arabic-oriented editors).
 *
 * @param state - The ProseMirror editor state.
 * @returns The current block's direction.
 */
const getCurrentBlockDir = (state: any): "rtl" | "ltr" => {
  const { $from } = state.selection;
  const blockNode = $from.node($from.depth);
  return blockNode?.attrs?.dir || "rtl";
};

/**
 * Slash menu item for the paragraph block.
 */
const slash: SlashMenuItem = {
  label: "فقرة (Paragraph)",
  searchTerms: ["paragraph", "para", "p", "فقرة", "ف"],
};

/**
 * Toolbar button for converting the current block to a paragraph.
 */
const toolbarButton: ToolbarButton = {
  label: "P",
  command: (state, dispatch) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.paragraph, { dir })(state, dispatch);
  },
  isActive: (state) => {
    const { $from } = state.selection;
    const node = $from.node($from.depth);
    return node?.type.name === "paragraph";
  },
};

/**
 * Keyboard shortcut for converting the current block to a paragraph.
 * `Mod+Alt+p` (where `Mod` is `Ctrl` on Windows/Linux and `Cmd` on macOS).
 */
const keymap: Record<string, any> = {
  "Mod-Alt-p": (state: any, dispatch: any) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.paragraph, { dir })(state, dispatch);
  },
};

/**
 * A paragraph block for the Kateb editor.
 *
 * This is the default block type for regular text content. It supports
 * RTL direction, preserves the current text direction when created or modified,
 * and is the fallback block used when no other blocks are provided.
 *
 * The paragraph block appears in the slash menu, has a toolbar button (`P`),
 * and can be created via the keyboard shortcut `Mod+Alt+p`.
 */
export const paragraphBlock = new Block({
  name: "paragraph",
  spec: {
    attrs: { dir: { default: "rtl" } },
    content: "inline*",
    group: "block",
    parseDOM: [
      {
        tag: "p",
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === "string") return { dir: "rtl" };
          return { dir: dom.getAttribute("dir") || "rtl" };
        },
      },
    ],
    toDOM(node) {
      return ["p", { dir: node.attrs.dir }, 0];
    },
  },
  slashMenuItem: slash,
  allowedMarks: ["strong", "em"],
  toolbarButtons: [toolbarButton],
  keymap,
});
