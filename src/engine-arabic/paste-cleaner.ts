import { Plugin } from "prosemirror-state";
import { DOMParser as ProseMirrorDOMParser } from "prosemirror-model";

/**
 * Set of HTML block tags that are allowed to remain in the pasted content.
 */
const ALLOWED_BLOCK_TAGS = new Set(["p", "h1", "h2", "h3"]);

/**
 * Set of HTML inline tags that are allowed (and mapped to ProseMirror marks where appropriate).
 * - `<b>` is mapped to `<strong>`
 * - `<i>` is mapped to `<em>`
 * - `<br>` is preserved as a hard break
 */
const ALLOWED_INLINE_TAGS = new Set(["strong", "b", "em", "i", "br"]);

/**
 * Cleans pasted HTML by stripping unwanted tags, attributes, and formatting.
 *
 * Only the following elements are preserved:
 * - Block tags: `p`, `h1`, `h2`, `h3` (their `dir` attribute is kept).
 * - Inline tags: `strong`, `b` (converted to `strong`), `em`, `i` (converted to `em`), `br`.
 * All other elements (e.g., `div`, `span`, `font`, `style`) are removed, but their text content is kept.
 *
 * @param html - The raw HTML string from the clipboard.
 * @returns A cleaned HTML string containing only allowed tags and their text content.
 */
function cleanPastedHTML(html: string): string {
  const parser = new globalThis.DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const body = doc.body;

  const cleanNode = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) return node.cloneNode(true);
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node as Element;
    const tagName = element.tagName.toLowerCase();

    // Allowed block tags: keep the tag and copy the `dir` attribute if present
    if (ALLOWED_BLOCK_TAGS.has(tagName)) {
      const newEl = doc.createElement(tagName);
      // Copy dir attribute if exists
      const dir = element.getAttribute("dir");
      if (dir) newEl.setAttribute("dir", dir);
      for (const child of Array.from(element.childNodes)) {
        const cleaned = cleanNode(child);
        if (cleaned) newEl.appendChild(cleaned);
      }
      return newEl;
    }

    // Allowed inline tags: map b->strong, i->em, copy dir? (usually not needed)
    if (ALLOWED_INLINE_TAGS.has(tagName)) {
      let newTag = tagName;
      if (tagName === "b") newTag = "strong";
      if (tagName === "i") newTag = "em";
      const newEl = doc.createElement(newTag);
      // Optionally copy dir if needed (inline tags rarely have dir)
      const dir = element.getAttribute("dir");
      if (dir) newEl.setAttribute("dir", dir);
      for (const child of Array.from(element.childNodes)) {
        const cleaned = cleanNode(child);
        if (cleaned) newEl.appendChild(cleaned);
      }
      return newEl;
    }

    // For other tags, just recurse and keep children
    const fragment = doc.createDocumentFragment();
    for (const child of Array.from(element.childNodes)) {
      const cleaned = cleanNode(child);
      if (cleaned) fragment.appendChild(cleaned);
    }
    return fragment;
  };

  const cleanedBody = doc.createElement("body");
  for (const child of Array.from(body.childNodes)) {
    const cleaned = cleanNode(child);
    if (cleaned) cleanedBody.appendChild(cleaned);
  }

  const wrapper = doc.createElement("div");
  wrapper.appendChild(cleanedBody);
  return wrapper.innerHTML;
}

/**
 * ProseMirror plugin that cleans pasted content before it is inserted into the editor.
 *
 * When the user pastes HTML (e.g., from Word, Google Docs, or a web page), this plugin:
 * - Reads the raw HTML from the clipboard.
 * - Removes disallowed tags and inline styles.
 * - Preserves only allowed block tags (`p`, `h1`, `h2`, `h3`), inline tags (`strong`, `em`, `br`), and text.
 * - Converts `<b>` to `<strong>` and `<i>` to `<em>`.
 * - Retains the `dir` attribute on allowed block elements to preserve RTL/LTR direction.
 * - Parses the cleaned HTML using the editor's current schema (obtained from `view.state.schema`).
 * - Replaces the current selection with the parsed content.
 *
 * If the clipboard contains plain text (no HTML), the plugin does nothing, allowing ProseMirror's default
 * plain‑text handling to take over.
 */
export const pasteCleanerPlugin = new Plugin({
  props: {
    handlePaste(view, event): boolean {
      const clipboardData = event.clipboardData;
      if (!clipboardData) return false;
      const html = clipboardData.getData("text/html");
      if (!html) return false;

      const cleanedHtml = cleanPastedHTML(html);
      if (!cleanedHtml) return false;

      // Use the schema from the current editor view
      const parser = ProseMirrorDOMParser.fromSchema(view.state.schema);
      const dom = new globalThis.DOMParser().parseFromString(
        cleanedHtml,
        "text/html",
      );
      const docFragment = parser.parse(dom.body);

      const tr = view.state.tr.replaceSelectionWith(docFragment, false);
      view.dispatch(tr);
      return true;
    },
  },
});
