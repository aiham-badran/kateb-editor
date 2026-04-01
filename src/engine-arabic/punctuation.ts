import { Plugin } from "prosemirror-state";

/**
 * Mapping from western punctuation marks to their Arabic equivalents.
 */
const punctuationMap: Record<string, string> = {
  ",": "،",
  "?": "؟",
  ";": "؛",
};

/**
 * ProseMirror plugin that automatically replaces typed western punctuation marks
 * with their Arabic counterparts.
 *
 * When the user types one of the characters in `punctuationMap` (`,` , `?`, `;`),
 * the plugin intercepts the input, creates a transaction that inserts the Arabic
 * equivalent instead, and prevents the original character from being inserted.
 *
 * This provides a seamless Arabic typing experience without requiring the user
 * to switch keyboard layouts.
 */
export const arabicPunctuationPlugin = new Plugin({
  props: {
    /**
     * Handles text input before it is inserted into the document.
     *
     * @param view - The ProseMirror editor view.
     * @param from - The start position of the insertion.
     * @param to - The end position of the insertion (same as `from` for a single character).
     * @param text - The text being inserted (single character in this case).
     * @returns `true` if the input was handled and should be prevented (i.e., the replacement was applied),
     *          or `false` to allow normal insertion.
     */
    handleTextInput(view, from, to, text): boolean {
      const replacement = punctuationMap[text];
      if (replacement) {
        // Replace the typed character with its Arabic equivalent.
        const tr = view.state.tr.insertText(replacement, from, to);
        view.dispatch(tr);
        return true; // Prevent default insertion
      }
      return false; // Allow normal insertion
    },
  },
});
