import { NodeSpec, MarkSpec } from "prosemirror-model";
import { Command } from "prosemirror-state";
import { Block, ToolbarButton, SlashMenuItem } from "./block";
import { Mark } from "./mark";

/**
 * Creates a Block instance with simplified options.
 *
 * @param name - Unique block name (e.g., 'paragraph', 'custom').
 * @param spec - ProseMirror node specification (defines content, attributes, and DOM mapping).
 * @param options - Optional settings for the block.
 * @param options.slashLabel - If provided, a slash menu item with this label will be created.
 * @param options.searchTerms - Additional keywords for slash menu search.
 * @param options.toolbarButtons - Array of toolbar buttons associated with this block.
 * @param options.keymap - Keymap object (shortcut → command) specific to this block.
 * @param options.allowedMarks - List of mark names allowed inside this block. If undefined, all marks are allowed.
 * @returns A new Block instance.
 *
 * @example
 * const paragraph = createBlock('paragraph', {
 *   content: 'inline*',
 *   group: 'block',
 *   toDOM: () => ['p', 0]
 * }, {
 *   slashLabel: 'فقرة',
 *   allowedMarks: ['strong', 'em']
 * });
 */
export function createBlock(
  name: string,
  spec: NodeSpec,
  options: {
    slashLabel?: string;
    searchTerms?: string[];
    toolbarButtons?: ToolbarButton[];
    keymap?: Record<string, Command>;
    allowedMarks?: string[];
  } = {},
): Block {
  const slashMenuItem = options.slashLabel
    ? { label: options.slashLabel, searchTerms: options.searchTerms }
    : undefined;
  return new Block({
    name,
    spec,
    slashMenuItem,
    allowedMarks: options.allowedMarks,
    toolbarButtons: options.toolbarButtons,
    keymap: options.keymap,
  });
}

/**
 * Creates a Mark instance with simplified options.
 *
 * @param name - Unique mark name (e.g., 'strong', 'em').
 * @param spec - ProseMirror mark specification (defines DOM parsing and serialization).
 * @param options - Optional settings for the mark.
 * @param options.toolbarButtons - Array of toolbar buttons associated with this mark.
 * @param options.keymap - Keymap object (shortcut → command) specific to this mark.
 * @returns A new Mark instance.
 *
 * @example
 * const bold = createMark('strong', {
 *   parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
 *   toDOM: () => ['strong', 0]
 * }, {
 *   toolbarButtons: [{ label: 'B', command: toggleStrong }],
 *   keymap: { 'Mod-b': toggleStrong }
 * });
 */
export function createMark(
  name: string,
  spec: MarkSpec,
  options: {
    toolbarButtons?: ToolbarButton[];
    keymap?: Record<string, Command>;
  } = {},
): Mark {
  return new Mark({
    name,
    spec,
    toolbarButtons: options.toolbarButtons,
    keymap: options.keymap,
  });
}

/**
 * Creates a toolbar button definition.
 *
 * @param label - Button label (e.g., 'B', 'H1', 'P').
 * @param command - ProseMirror command to execute when the button is clicked.
 * @param isActive - Optional function that returns `true` if the button should be highlighted as active.
 * @returns A ToolbarButton object.
 *
 * @example
 * const boldButton = createToolbarButton('B', toggleStrong, (state) => isMarkActive(state, 'strong'));
 */
export function createToolbarButton(
  label: string,
  command: Command,
  isActive?: (state: any) => boolean,
): ToolbarButton {
  return { label, command, isActive };
}

/**
 * Creates a slash menu item definition.
 *
 * @param label - Display label (can be Arabic or English).
 * @param searchTerms - Optional additional keywords for search filtering (e.g., ['paragraph', 'para']).
 * @returns A SlashMenuItem object.
 *
 * @example
 * const paragraphItem = createSlashMenuItem('فقرة', ['paragraph', 'p']);
 */
export function createSlashMenuItem(
  label: string,
  searchTerms?: string[],
): SlashMenuItem {
  return { label, searchTerms };
}

/**
 * Creates a keymap object (identity function for consistency).
 *
 * This function is provided to align with the helper pattern, allowing
 * developers to define keymaps in a uniform way. It simply returns the input object.
 *
 * @param shortcuts - Object mapping keyboard shortcuts to commands.
 * @returns The same shortcuts object.
 *
 * @example
 * const myKeymap = createKeymap({
 *   'Ctrl-Alt-C': () => console.log('Custom shortcut')
 * });
 */
export function createKeymap(
  shortcuts: Record<string, Command>,
): Record<string, Command> {
  return shortcuts;
}
