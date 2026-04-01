/**
 * Injects default CSS styles for the Kateb Editor into the document head.
 *
 * This function ensures that the editor container has proper RTL direction,
 * basic styling (border, padding, font family), and focus effects.
 *
 * The styles are added only once; subsequent calls are ignored because the
 * function checks for an existing `<style>` element with the id `kateb-editor-styles`.
 *
 * The injected styles include:
 * - RTL direction for the editor container.
 * - A default Arabic‑friendly font stack.
 * - Basic block‑level spacing (e.g., paragraph margins).
 * - Focus visual feedback.
 * - A workaround for empty RTL elements to ensure proper cursor placement.
 */
export const injectStyles = (): void => {
  // Check if styles already added to avoid duplication
  if (document.getElementById("kateb-editor-styles")) {
    return;
  }

  const css = `
    .kateb-editor-container {
      direction: rtl;
      border: 1px solid #ddd;
      padding: 20px;
      min-height: 200px;
      border-radius: 8px;
      font-family: 'Noto Naskh Arabic', 'Amiri', 'Scheherazade', 'Lateef', 'Segoe UI', 'Tahoma', 'Roboto', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      outline: none;
      background: white;
    }

    .kateb-editor-container [dir="rtl"]:empty::before {
      content: '';
      display: inline-block;
      width: 0;
    }

    .kateb-editor-container p,
    .kateb-editor-container h1,
    .kateb-editor-container h2,
    .kateb-editor-container h3 {
      // unicode-bidi: plaintext;
    }
    .kateb-editor-container p {
      margin: 0 0 1em;
    }
    .kateb-editor-container:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.1);
    }
  `;

  const style = document.createElement("style");
  style.id = "kateb-editor-styles";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};
