import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { history } from "prosemirror-history";
import { Plugin } from "prosemirror-state";
import { injectStyles } from "../ui/styles";
import { arabicPunctuationPlugin } from "../engine-arabic/punctuation";
import { rtlPlugin } from "../engine-arabic/rtl";
import { autoDirectionPlugin } from "../engine-arabic/auto-direction-plugin";
import { pasteCleanerPlugin } from "../engine-arabic/paste-cleaner";
import { markdownInputRulesPlugin } from "../engine-arabic/markdown-inputrules";
import { ToolbarManager } from "../ui/toolbar/toolbar";
import { SlashMenuManager } from "../ui/slash-menu/slash-menu";
import { createKeymapPlugin } from "./keymaps";
import { SchemaBuilder } from "./schema-builder";
import { Block } from "./block";
import { Mark } from "./mark";
import { paragraphBlock } from "../blocks/paragraph";
import { emMark, strongMark } from "../marks";

/**
 * Configuration options for the Kateb editor.
 */
export interface KatebEditorOptions {
  /** Whether to show the floating toolbar. Default: `true`. */
  enableToolbar?: boolean;
  /** Whether to enable the slash menu (triggered by `/`). Default: `true`. */
  enableSlashMenu?: boolean;
  /** Custom blocks to be available in the editor. Paragraph is automatically added if missing. */
  blocks?: Block[];
  /** Custom marks (e.g., strong, em) to be available. Strong and em are automatically added if missing. */
  marks?: Mark[];
}

/**
 * Main class for the Kateb Editor.
 *
 * Provides a ProseMirror-based editor with Arabic language enhancements,
 * block-based structure, floating toolbar, slash menu, and keyboard shortcuts.
 */
export class KatebEditor {
  private view: EditorView | null = null;
  private toolbarManager: ToolbarManager | null = null;
  private slashMenuManager: SlashMenuManager | null = null;
  private blocks: Block[];
  private marks: Mark[];

  /**
   * Creates a new Kateb Editor instance.
   *
   * @param target - The DOM element where the editor will be mounted.
   * @param options - Configuration options (see {@link KatebEditorOptions}).
   */
  constructor(target: HTMLElement, options: KatebEditorOptions = {}) {
    const {
      enableToolbar = true,
      enableSlashMenu = true,
      blocks = [],
      marks = [],
    } = options;
    this.blocks = blocks;
    this.marks = marks;

    // Build schema from blocks and marks
    // Ensure paragraph block is always present (as required by ProseMirror)
    if (!blocks.some((block) => block.name === "paragraph")) {
      blocks.unshift(paragraphBlock);
    }
    // Add default marks if missing to maintain consistent toolbar and keyboard shortcuts
    if (!marks.some((mark) => mark.name === "strong")) {
      marks.unshift(strongMark);
    }
    if (!marks.some((mark) => mark.name === "em")) {
      marks.unshift(emMark);
    }
    const schema = SchemaBuilder.build(blocks, marks);

    injectStyles();

    // Core plugins: RTL, punctuation, auto-direction, paste cleaning, Markdown headings, history, and keymaps
    const corePlugins = [
      rtlPlugin,
      arabicPunctuationPlugin,
      autoDirectionPlugin,
      pasteCleanerPlugin,
      markdownInputRulesPlugin,
      history(),
      createKeymapPlugin(blocks, marks, schema),
      keymap(baseKeymap),
    ];

    // Create initial document with a paragraph block (or the first available block)
    const firstBlock = blocks.find((b) => b.name === "paragraph") || blocks[0];
    const initialDoc = firstBlock
      ? schema.node("doc", null, [
          schema.nodes[firstBlock.name]?.create({ dir: "rtl" }),
        ])
      : schema.node("doc", null, [
          schema.nodes.paragraph?.create({ dir: "rtl" }),
        ]);

    const state = EditorState.create({
      schema,
      plugins: corePlugins,
      doc: initialDoc,
    });

    this.view = new EditorView(target, {
      state,
      attributes: { class: "kateb-editor-container" },
    });

    // UI managers (toolbar and slash menu)
    if (enableToolbar) {
      this.toolbarManager = new ToolbarManager(
        this.view,
        this.blocks,
        this.marks,
      );
    }

    if (enableSlashMenu) {
      this.slashMenuManager = new SlashMenuManager(this.view, this.blocks);
      // Plugin that shows the slash menu when `/` is typed at the start of a block
      const slashPlugin = new Plugin({
        props: {
          handleTextInput: (view, from, to, text) => {
            if (text !== "/") return false;
            const { state } = view;
            const { $from } = state.selection;
            const blockStart = $from.before($from.depth);
            const textBeforeSlash = state.doc.textBetween(blockStart, from);
            const shouldShow = /^\s*$/.test(textBeforeSlash);
            if (shouldShow) {
              setTimeout(() => {
                this.slashMenuManager?.show(from);
              }, 0);
            }
            return false;
          },
        },
      });
      // Plugin that updates the slash menu filter while typing after `/`
      const filterUpdatePlugin = new Plugin({
        props: {
          handleTextInput: (view, from, to, text) => {
            if (this.slashMenuManager?.isVisible) {
              setTimeout(() => this.slashMenuManager?.updateFilter(), 0);
            }
            return false;
          },
        },
      });
      const newState = this.view.state.reconfigure({
        plugins: [...this.view.state.plugins, slashPlugin, filterUpdatePlugin],
      });
      this.view.updateState(newState);
    }
  }

  /**
   * Returns the current editor content as a JSON‑serializable object.
   *
   * @returns The document content in ProseMirror JSON format.
   * @throws If the editor has been destroyed.
   */
  public getContent(): Record<string, unknown> {
    if (!this.view) throw new Error("Editor is destroyed");
    return this.view.state.doc.toJSON();
  }

  /**
   * Destroys the editor and cleans up all resources.
   *
   * Removes the editor view, unregisters event listeners, and destroys UI components.
   */
  public destroy(): void {
    if (this.view) {
      this.view.destroy();
      this.view = null;
    }
    if (this.toolbarManager) {
      this.toolbarManager.destroy();
      this.toolbarManager = null;
    }
    if (this.slashMenuManager) {
      this.slashMenuManager.destroy();
      this.slashMenuManager = null;
    }
  }
}
