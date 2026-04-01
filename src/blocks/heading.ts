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
 * Slash menu item for the heading block.
 */
const slash: SlashMenuItem = {
  label: "عنوان (Heading)",
  searchTerms: ["heading", "h1", "h2", "h3", "title", "عنوان", "ع"],
};

/**
 * Creates a toolbar button for a specific heading level.
 *
 * @param level - The heading level (1, 2, or 3).
 * @returns A toolbar button definition that, when clicked, converts the current block to a heading of the given level.
 */
const createHeadingButton = (level: number): ToolbarButton => ({
  label: `H${level}`,
  command: (state, dispatch) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.heading, { level, dir })(
      state,
      dispatch,
    );
  },
  isActive: (state) => {
    const { $from } = state.selection;
    const node = $from.node($from.depth);
    return node?.type.name === "heading" && node?.attrs.level === level;
  },
});

/**
 * Toolbar buttons for heading levels 1, 2, and 3.
 */
const toolbarButtons: ToolbarButton[] = [
  createHeadingButton(1),
  createHeadingButton(2),
  createHeadingButton(3),
];

/**
 * Keyboard shortcuts for converting the current block to a heading.
 * - `Mod+Alt+1` → Heading 1
 * - `Mod+Alt+2` → Heading 2
 * - `Mod+Alt+3` → Heading 3
 *
 * `Mod` represents `Ctrl` on Windows/Linux and `Cmd` on macOS.
 */
const keymap: Record<string, any> = {
  "Mod-Alt-1": (state: any, dispatch: any) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.heading, { level: 1, dir })(
      state,
      dispatch,
    );
  },
  "Mod-Alt-2": (state: any, dispatch: any) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.heading, { level: 2, dir })(
      state,
      dispatch,
    );
  },
  "Mod-Alt-3": (state: any, dispatch: any) => {
    const dir = getCurrentBlockDir(state);
    return setBlockType(state.schema.nodes.heading, { level: 3, dir })(
      state,
      dispatch,
    );
  },
};

/**
 * A heading block for the Kateb editor.
 *
 * Supports three heading levels (1–3). It is inserted via the slash menu,
 * converted via toolbar buttons, and can be created using keyboard shortcuts.
 * The block preserves the current text direction (RTL/LTR) when created or modified.
 */
export const headingBlock = new Block({
  name: "heading",
  spec: {
    attrs: { level: { default: 1 }, dir: { default: "rtl" } },
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [
      {
        tag: "h1",
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === "string") return { level: 1, dir: "rtl" };
          return { level: 1, dir: dom.getAttribute("dir") || "rtl" };
        },
      },
      {
        tag: "h2",
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === "string") return { level: 2, dir: "rtl" };
          return { level: 2, dir: dom.getAttribute("dir") || "rtl" };
        },
      },
      {
        tag: "h3",
        getAttrs: (dom: HTMLElement | string) => {
          if (typeof dom === "string") return { level: 3, dir: "rtl" };
          return { level: 3, dir: dom.getAttribute("dir") || "rtl" };
        },
      },
    ],
    toDOM(node) {
      return [`h${node.attrs.level}`, { dir: node.attrs.dir }, 0];
    },
  },
  slashMenuItem: slash,
  allowedMarks: ["strong", "em"],
  toolbarButtons,
  keymap,
});
