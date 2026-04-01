import { MarkSpec } from "prosemirror-model";
import { Command } from "prosemirror-state";
import { ToolbarButton } from "./block";

/**
 * Represents a custom mark (e.g., bold, italic) that can be added to the Kateb editor.
 *
 * Marks are used for inline formatting (like strong, em, underline) and can be applied
 * to selected text. Each mark encapsulates its own ProseMirror specification, toolbar
 * buttons, and keyboard shortcuts.
 *
 * @example
 * // Create a custom mark for highlighting
 * const highlightMark = new Mark({
 *   name: 'highlight',
 *   spec: {
 *     parseDOM: [{ tag: 'mark' }],
 *     toDOM() { return ['mark', 0]; }
 *   },
 *   toolbarButtons: [{
 *     label: 'H',
 *     command: (state, dispatch) => {
 *       const mark = state.schema.marks.highlight;
 *       if (!mark) return false;
 *       return toggleMark(mark)(state, dispatch);
 *     },
 *     isActive: (state) => isMarkActive(state, 'highlight')
 *   }],
 *   keymap: { 'Mod-Alt-H': (state, dispatch) => { // ...  } }
 * });
 */
export class Mark {
  /** Unique mark name (e.g., 'strong', 'em'). */
  public readonly name: string;
  /** ProseMirror mark specification (defines DOM parsing and serialization). */
  public readonly spec: MarkSpec;
  /** Optional array of toolbar buttons associated with this mark. */
  public readonly toolbarButtons?: ToolbarButton[];
  /** Optional keymap object (shortcut → command) specific to this mark. */
  public readonly keymap?: Record<string, Command>;

  /**
   * Creates a new Mark instance.
   *
   * @param config - The mark configuration.
   * @param config.name - Unique mark name.
   * @param config.spec - ProseMirror mark specification.
   * @param config.toolbarButtons - Optional array of toolbar buttons.
   * @param config.keymap - Optional keymap object.
   */
  constructor(config: {
    name: string;
    spec: MarkSpec;
    toolbarButtons?: ToolbarButton[];
    keymap?: Record<string, Command>;
  }) {
    this.name = config.name;
    this.spec = config.spec;
    this.toolbarButtons = config.toolbarButtons;
    this.keymap = config.keymap;
  }
}
