import { NodeSpec } from "prosemirror-model";
import { Command } from "prosemirror-state";

/**
 * Defines an item that appears in the slash menu for a block.
 */
export interface SlashMenuItem {
  /**
   * The display label (can be Arabic or English).
   */
  label: string;
  /**
   * Optional additional keywords for search filtering.
   * Used when the user types additional characters after `/`.
   */
  searchTerms?: string[];
}

/**
 * Defines a button that appears in the floating toolbar.
 * Can be used for both blocks and marks.
 */
export interface ToolbarButton {
  /**
   * Button label (e.g., 'B', 'H1', 'P').
   */
  label: string;
  /**
   * ProseMirror command to execute when the button is clicked.
   */
  command: Command;
  /**
   * Optional function to determine if the button should be highlighted as active.
   * Receives the editor state and returns `true` if the button is active.
   */
  isActive?: (state: any) => boolean;
}

/**
 * Represents a custom block that can be added to the Kateb editor.
 *
 * Each block encapsulates its own ProseMirror node specification, slash menu entry,
 * toolbar buttons, keymap shortcuts, and allowed marks.
 *
 * @example
 * // Create a custom block
 * const customBlock = new Block({
 *   name: 'custom',
 *   spec: {
 *     content: 'inline*',
 *     group: 'block',
 *     toDOM() { return ['div', 0]; }
 *   },
 *   slashMenuItem: { label: 'Custom' },
 *   toolbarButtons: [{ label: 'C', command: myCommand }],
 *   keymap: { 'Ctrl-Alt-C': myCommand },
 *   allowedMarks: ['strong', 'em']
 * });
 */
export class Block {
  /** Unique node name (e.g., 'paragraph', 'heading'). */
  public readonly name: string;
  /** ProseMirror node specification. */
  public readonly spec: NodeSpec;
  /** Optional slash menu item. If undefined, this block is not insertable via slash menu. */
  public readonly slashMenuItem?: SlashMenuItem;
  /** List of mark names allowed inside this block. If undefined, all marks are allowed. */
  public readonly allowedMarks?: string[];
  /** Optional array of toolbar buttons associated with this block. */
  public readonly toolbarButtons?: ToolbarButton[];
  /** Optional keymap object (shortcut → command) specific to this block. */
  public readonly keymap?: Record<string, Command>;

  /**
   * Creates a new Block instance.
   *
   * @param config - The block configuration.
   * @param config.name - Unique node name.
   * @param config.spec - ProseMirror node specification.
   * @param config.slashMenuItem - Optional slash menu item.
   * @param config.allowedMarks - Optional list of allowed mark names.
   * @param config.toolbarButtons - Optional array of toolbar buttons.
   * @param config.keymap - Optional keymap object.
   */
  constructor(config: {
    name: string;
    spec: NodeSpec;
    slashMenuItem?: SlashMenuItem;
    allowedMarks?: string[];
    toolbarButtons?: ToolbarButton[];
    keymap?: Record<string, Command>;
  }) {
    this.name = config.name;
    this.spec = config.spec;
    this.slashMenuItem = config.slashMenuItem;
    this.allowedMarks = config.allowedMarks;
    this.toolbarButtons = config.toolbarButtons;
    this.keymap = config.keymap;
  }
}
