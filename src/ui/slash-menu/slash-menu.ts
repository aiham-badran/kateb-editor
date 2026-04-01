import { EditorView } from "prosemirror-view";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Selection } from "prosemirror-state";
import { Block } from "../../core/block";
import { injectSlashMenuStyles } from "./slash-menu.css";

/**
 * Manages the slash menu that appears when the user types `/` at the beginning of a block.
 *
 * The menu displays a list of blocks (those with a `slashMenuItem` defined) and allows the user to filter
 * them by typing additional characters after the slash. Navigation is possible with arrow keys, and selection
 * is made with Enter or mouse click. The menu is automatically hidden when the slash is deleted or when an
 * item is selected.
 */
export class SlashMenuManager {
  private view: EditorView;
  private menu: HTMLElement | null = null;
  public isVisible: boolean = false;
  private blocks: Block[];
  private filteredBlocks: Block[];
  private selectedIndex: number = 0;
  private keydownHandler: ((e: KeyboardEvent) => void) | null = null;
  private slashPos: number = 0;

  /**
   * Creates a new slash menu manager.
   *
   * @param view - The ProseMirror editor view.
   * @param blocks - The list of blocks that can be inserted via the slash menu.
   *                 Only blocks with a defined `slashMenuItem` are considered.
   */
  constructor(view: EditorView, blocks: Block[]) {
    this.view = view;
    this.blocks = blocks.filter((b) => b.slashMenuItem);
    this.filteredBlocks = [...this.blocks];
    injectSlashMenuStyles();
    this.createMenu();
    this.hide();
    this.attachGlobalEvents();
  }

  /**
   * Creates the DOM element for the slash menu and appends it to the document body.
   */
  private createMenu(): void {
    this.menu = document.createElement("div");
    this.menu.className = "kateb-slash-menu";
    document.body.appendChild(this.menu);
  }

  /**
   * Renders the current filtered list of blocks into the menu.
   * If no results, displays a "no results" message.
   */
  private renderMenu(): void {
    if (!this.menu) return;
    this.menu.innerHTML = "";
    if (this.filteredBlocks.length === 0) {
      const emptyMsg = document.createElement("div");
      emptyMsg.className = "kateb-slash-menu-empty";
      emptyMsg.textContent = "لا توجد نتائج";
      emptyMsg.style.padding = "6px 12px";
      emptyMsg.style.color = "#888";
      this.menu.appendChild(emptyMsg);
      return;
    }
    this.filteredBlocks.forEach((block, idx) => {
      const div = document.createElement("div");
      div.className = "kateb-slash-menu-item";
      if (idx === this.selectedIndex) div.classList.add("selected");
      div.textContent = block.slashMenuItem!.label;
      div.addEventListener("click", () => this.selectBlock(block));
      this.menu!.appendChild(div);
    });
  }

  /**
   * Inserts the selected block at the position where the slash was typed.
   *
   * The slash and any following query text are removed, then the new block is created
   * (with `dir="rtl"` by default) and inserted. The cursor is placed at the beginning of the new block.
   *
   * @param block - The selected block instance to insert.
   */
  private selectBlock(block: Block): void {
    const { state } = this.view;
    const queryEnd = state.selection.from;
    const tr = state.tr.delete(this.slashPos, queryEnd);

    const nodeSpec = state.schema.nodes[block.name];
    if (!nodeSpec) return;

    const node = nodeSpec.create({ dir: "rtl" });
    tr.replaceRangeWith(this.slashPos, this.slashPos, node);
    const newPos = this.slashPos + 1;
    tr.setSelection(Selection.near(tr.doc.resolve(newPos)));
    this.view.dispatch(tr);
    this.hide();
  }

  /**
   * Shows the slash menu at the given document position.
   *
   * The menu is positioned below the cursor using ProseMirror's coordinate system.
   * The filter list is reset to all available blocks and the first item is selected by default.
   *
   * @param atPos - The document position where the slash was typed.
   */
  public show(atPos: number): void {
    if (!this.menu) return;
    this.slashPos = atPos;
    this.filteredBlocks = [...this.blocks];
    this.selectedIndex = 0;
    const coords = this.view.coordsAtPos(atPos);
    this.menu.style.top = `${coords.bottom + 5}px`;
    this.menu.style.left = `${coords.left - 190}px`;
    this.menu.style.display = "block";
    this.isVisible = true;
    this.renderMenu();
  }

  /**
   * Hides the slash menu.
   */
  public hide(): void {
    if (this.menu) {
      this.menu.style.display = "none";
      this.isVisible = false;
    }
  }

  /**
   * Checks whether the slash character still exists at the stored position.
   *
   * This is used to close the menu if the slash was deleted (e.g., by Backspace).
   *
   * @returns `true` if the character at `slashPos` is `/`, otherwise `false`.
   */
  private isSlashStillPresent(): boolean {
    if (!this.menu) return false;
    try {
      const char = this.view.state.doc.textBetween(
        this.slashPos,
        this.slashPos + 1,
      );
      return char === "/";
    } catch {
      return false;
    }
  }

  /**
   * Updates the filtered list of blocks based on the current query text.
   *
   * The query is the text typed after the slash. Blocks whose label or search terms
   * contain the query (case‑insensitive) are kept. If the slash is no longer present,
   * the menu is hidden.
   */
  public updateFilter(): void {
    if (!this.isVisible) return;

    if (!this.isSlashStillPresent()) {
      this.hide();
      return;
    }

    const { state } = this.view;
    const from = this.slashPos + 1;
    const to = state.selection.from;
    const query = state.doc.textBetween(from, to);
    const lowerQuery = query.toLowerCase().trim();

    this.filteredBlocks = this.blocks.filter((block) => {
      const item = block.slashMenuItem!;
      if (item.label.toLowerCase().includes(lowerQuery)) return true;
      if (
        item.searchTerms &&
        item.searchTerms.some((term) => term.toLowerCase().includes(lowerQuery))
      ) {
        return true;
      }
      return false;
    });
    this.selectedIndex = 0;
    this.renderMenu();
  }

  /**
   * Moves the selection highlight up or down within the menu.
   *
   * @param direction - `"up"` or `"down"`.
   */
  public navigate(direction: "up" | "down"): void {
    if (!this.isVisible || this.filteredBlocks.length === 0) return;
    if (direction === "up") {
      this.selectedIndex =
        (this.selectedIndex - 1 + this.filteredBlocks.length) %
        this.filteredBlocks.length;
    } else {
      this.selectedIndex =
        (this.selectedIndex + 1) % this.filteredBlocks.length;
    }
    this.renderMenu();
  }

  /**
   * Selects the currently highlighted block.
   */
  public selectCurrent(): void {
    if (!this.isVisible || this.filteredBlocks.length === 0) return;
    const block = this.filteredBlocks[this.selectedIndex];
    if (block) this.selectBlock(block);
  }

  /**
   * Attaches global keyboard event listeners for menu navigation and selection.
   *
   * Listens for:
   * - ArrowUp / ArrowDown → navigate
   * - Enter → select current
   * - Escape → hide
   * - Backspace / Delete → update filter after deletion (using `requestAnimationFrame`).
   */
  private attachGlobalEvents(): void {
    let filterRafId: number | null = null;

    this.keydownHandler = (e: KeyboardEvent) => {
      if (!this.isVisible) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        this.navigate("up");
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.navigate("down");
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        this.selectCurrent();
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        this.hide();
        return;
      }
      if (e.key === "Backspace" || e.key === "Delete") {
        if (filterRafId) cancelAnimationFrame(filterRafId);
        filterRafId = requestAnimationFrame(() => {
          this.updateFilter();
          filterRafId = null;
        });
        return;
      }
    };
    document.addEventListener("keydown", this.keydownHandler);
  }

  /**
   * Destroys the slash menu, removing its DOM element and removing global event listeners.
   */
  public destroy(): void {
    if (this.keydownHandler) {
      document.removeEventListener("keydown", this.keydownHandler);
      this.keydownHandler = null;
    }
    if (this.menu) {
      this.menu.remove();
      this.menu = null;
    }
  }
}
