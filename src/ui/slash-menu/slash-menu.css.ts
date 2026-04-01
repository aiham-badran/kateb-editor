/**
 * Injects CSS styles for the slash menu into the document head.
 *
 * The styles define the appearance of the slash menu, including its position,
 * background, borders, shadows, scroll behavior, and RTL direction support.
 *
 * This function ensures that the styles are added only once by checking for the
 * existence of an element with the ID `kateb-slash-menu-styles` before creating
 * a new `<style>` tag.
 */
export const injectSlashMenuStyles = (): void => {
  if (document.getElementById("kateb-slash-menu-styles")) return;

  const css = `
    .kateb-slash-menu {
      position: fixed;
      z-index: 1000;
      background: #fff;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      min-width: 180px;
      max-height: 200px;
      overflow-y: auto;
      font-family: inherit;
      direction: rtl; 
      text-align: right;
    }
    .kateb-slash-menu-item {
      padding: 6px 12px;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }
    .kateb-slash-menu-item:hover,
    .kateb-slash-menu-item.selected {
      background: #f0f0f0;
    }
  `;
  const style = document.createElement("style");
  style.id = "kateb-slash-menu-styles";
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
};
