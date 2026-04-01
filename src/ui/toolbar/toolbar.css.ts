/**
 * Injects CSS styles for the floating toolbar into the document head.
 *
 * The styles define the toolbar's appearance, including its fixed positioning,
 * background, borders, shadows, and button styling. The toolbar is initially hidden
 * (`display: none`) and is shown programmatically when needed.
 *
 * This function ensures that the styles are added only once by checking for the
 * existence of an element with the ID `kateb-toolbar-styles` before creating a new
 * `<style>` tag.
 */
export const injectToolbarStyles = (): void => {
  if (document.getElementById("kateb-toolbar-styles")) return;

  const css = `
  .kateb-toolbar {
      position: fixed;
      z-index: 1000;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      padding: 4px 8px;
      display: none;
      gap: 4px;
      font-family: inherit;
      white-space: nowrap;
    }
    .kateb-toolbar button {
      background: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      padding: 4px 8px;
      transition: background 0.2s;
    }
    .kateb-toolbar button:hover {
      background: #f0f0f0;
    }
    .kateb-toolbar button.active {
      background: #e0e0e0;
    }
  `;
  const style = document.createElement("style");
  style.id = "kateb-toolbar-styles";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};
