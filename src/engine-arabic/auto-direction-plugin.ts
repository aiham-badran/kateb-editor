import { Plugin, PluginKey } from "prosemirror-state";
import { detectDirection } from "./direction-detector";

/**
 * Unique key for the auto‑direction plugin.
 */
export const autoDirectionPluginKey = new PluginKey("auto-direction");

/**
 * ProseMirror plugin that automatically updates the `dir` attribute of a block
 * based on its textual content.
 *
 * When the user types or modifies text inside a block that has a `dir` attribute,
 * this plugin uses `detectDirection` to determine the appropriate direction
 * (`rtl` or `ltr`) based on the majority of strong characters in the block's text.
 * If the computed direction differs from the current one, it creates a transaction
 * that updates the block's `dir` attribute.
 *
 * This ensures that the text direction stays consistent with the content,
 * providing a seamless writing experience in mixed Arabic/English contexts.
 */
export const autoDirectionPlugin = new Plugin({
  key: autoDirectionPluginKey,
  appendTransaction(transactions, oldState, newState) {
    // Only react if the document actually changed
    if (!transactions.some((tr) => tr.docChanged)) return null;

    const { $from } = newState.selection;
    const blockNode = $from.node($from.depth);
    if (!blockNode) return null;

    // Only blocks that have a `dir` attribute are candidates for auto‑direction
    if (!blockNode.attrs || !("dir" in blockNode.attrs)) return null;

    const textContent = blockNode.textContent;
    const newDir = detectDirection(textContent);
    const currentDir = blockNode.attrs.dir || "rtl";

    if (newDir !== currentDir) {
      const tr = newState.tr;
      const pos = $from.before($from.depth);
      tr.setNodeAttribute(pos, "dir", newDir);
      return tr;
    }
    return null;
  },
});
