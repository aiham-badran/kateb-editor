import { Plugin } from "prosemirror-state";

/**
 * ProseMirror plugin that ensures the editor container has the `dir="rtl"` attribute.
 *
 * When the editor is created, this plugin sets `dir="rtl"` on the editor's root DOM element.
 * It also observes and reapplies the attribute in case any external code modifies it.
 *
 * This provides explicit RTL direction for the editor, which is essential for Arabic
 * text display and cursor movement.
 */
export const rtlPlugin = new Plugin({
  /**
   * Called when the editor view is initialized.
   *
   * @param editorView - The ProseMirror editor view instance.
   * @returns An object containing lifecycle methods for the plugin's view.
   */
  view(editorView) {
    // Set the dir attribute when the view is created
    const dom = editorView.dom;
    dom.setAttribute("dir", "rtl");

    return {
      /**
       * Called when the editor state updates.
       * Re‑applies the `dir="rtl"` attribute if it has been changed (defensive).
       *
       * @param view - The current editor view.
       */
      update(view) {
        if (view.dom.getAttribute("dir") !== "rtl") {
          view.dom.setAttribute("dir", "rtl");
        }
      },
    };
  },
});
