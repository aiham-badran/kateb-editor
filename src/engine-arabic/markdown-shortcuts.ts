import { Plugin } from "prosemirror-state";
import { Selection } from "prosemirror-state";
import { Node as ProseMirrorNode } from "prosemirror-model";

/**
 * ProseMirror plugin that converts Markdown heading shortcuts (e.g., `# `, `## `, `### `)
 * into actual heading nodes when the user types a space after the hash symbols.
 *
 * When the user types a space after a sequence of 1–3 hash symbols at the beginning of a paragraph,
 * the plugin replaces the entire paragraph with a heading node of the corresponding level,
 * preserving the current text direction (`dir` attribute).
 *
 * **Note**: This plugin is intended for debugging/development and includes console logs.
 * For production, consider removing or disabling the logs.
 */
export const markdownShortcutsPlugin = new Plugin({
  props: {
    /**
     * Handles text input and triggers heading conversion when a space is typed
     * after 1–3 hash symbols at the beginning of a paragraph.
     *
     * @param view - The ProseMirror editor view.
     * @param from - The start position of the insertion.
     * @param to - The end position of the insertion.
     * @param text - The text being inserted.
     * @param deflt - The default transaction creator (unused).
     * @returns `true` if the input was handled (space consumed), otherwise `false`.
     */
    handleTextInput(view, from, to, text, deflt): boolean {
      // Only handle space character
      if (text !== " ") return false;

      const { state } = view;
      const { $from } = state.selection;

      console.log("=== Markdown handler triggered for space ===");
      console.log("Selection depth:", $from.depth);
      console.log("Parent node type:", $from.node($from.depth)?.type.name);
      console.log(
        "Grandparent node type:",
        $from.node($from.depth - 1)?.type.name,
      );
      console.log("from position:", from);
      console.log(
        "doc text around cursor:",
        state.doc.textBetween(from - 2, from + 2),
      );

      // Get the parent block node (paragraph)
      const blockDepth = $from.depth - 1; // because cursor is inside text node
      const parentNode = $from.node(blockDepth);

      if (!parentNode || parentNode.type.name !== "paragraph") {
        console.log("Not inside paragraph (or parent not found)");
        return false;
      }

      const blockStart = $from.start(blockDepth);
      const blockEnd = $from.end(blockDepth);
      console.log("blockStart:", blockStart, "blockEnd:", blockEnd);

      // Get text from block start to the cursor (before space insertion)
      const textBefore = state.doc.textBetween(blockStart, from);
      console.log("textBefore (raw):", JSON.stringify(textBefore));
      console.log("textBefore length:", textBefore.length);
      console.log(
        "Characters:",
        [...textBefore].map((ch) => ({ char: ch, code: ch.charCodeAt(0) })),
      );

      // Check regex
      const regex = /^(#{1,3})$/;
      const match = regex.test(textBefore);
      console.log("Regex match result:", match);
      if (!match) return false;

      const level = textBefore.length;
      console.log("Converting to heading level:", level);

      const headingNode = state.schema.nodes.heading.create({
        level,
        dir: parentNode.attrs.dir || "rtl",
      });

      const tr = state.tr.replaceRangeWith(blockStart, blockEnd, headingNode);
      const newPos = blockStart + 1;
      tr.setSelection(Selection.near(tr.doc.resolve(newPos)));
      view.dispatch(tr);
      console.log("Dispatch completed");
      return true;
    },
  },
});
