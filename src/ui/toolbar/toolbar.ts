import { EditorView } from "prosemirror-view";
import { Block, ToolbarButton } from "../../core/block";
import { Mark } from "../../core/mark";
import { injectToolbarStyles } from "./toolbar.css";

/**
 * Manages a floating toolbar that appears when text is selected within a single block.
 *
 * The toolbar dynamically displays buttons collected from the `toolbarButtons` properties
 * of the provided blocks and marks. It is positioned above the selection, and its active
 * state (highlighting) is updated based on the current editor state.
 *
 * The toolbar is automatically shown after a selection is made (via mouse or keyboard)
 * and hidden when the selection is cleared, the editor loses focus, or the user clicks outside.
 */
export class ToolbarManager {
  private view: EditorView;
  private toolbarElement: HTMLElement | null = null;
  private editorDom: HTMLElement;
  private blocks: Block[];
  private marks: Mark[];
  private buttons: {
    element: HTMLButtonElement;
    command: any;
    isActive?: (state: any) => boolean;
  }[] = [];
  private isVisible: boolean = false;
  private clickOutsideHandler: ((e: MouseEvent) => void) | null = null;
  private blurHandler: (() => void) | null = null;

  /**
   * Creates a new toolbar manager.
   *
   * @param view - The ProseMirror editor view.
   * @param blocks - The list of blocks that may provide toolbar buttons.
   * @param marks - The list of marks that may provide toolbar buttons.
   */
  constructor(view: EditorView, blocks: Block[], marks: Mark[]) {
    this.view = view;
    this.editorDom = view.dom;
    this.blocks = blocks;
    this.marks = marks;
    injectToolbarStyles();
    this.createToolbar();
    this.attachEventListeners();
    this.hide();
  }

  /**
   * Creates the toolbar DOM element, populates it with buttons from blocks and marks,
   * and appends it to the document body.
   */
  private createToolbar(): void {
    this.toolbarElement = document.createElement("div");
    this.toolbarElement.className = "kateb-toolbar";

    // Collect all toolbar buttons from blocks and marks
    const allButtons: ToolbarButton[] = [];
    for (const block of this.blocks) {
      if (block.toolbarButtons) allButtons.push(...block.toolbarButtons);
    }
    for (const mark of this.marks) {
      if (mark.toolbarButtons) allButtons.push(...mark.toolbarButtons);
    }

    // Create DOM buttons and store their metadata
    for (const btnDef of allButtons) {
      const button = document.createElement("button");
      button.textContent = btnDef.label;
      button.addEventListener("mousedown", (e) => {
        e.preventDefault();
        btnDef.command(this.view.state, this.view.dispatch);
        this.view.focus();
      });
      this.toolbarElement.appendChild(button);
      this.buttons.push({
        element: button,
        command: btnDef.command,
        isActive: btnDef.isActive,
      });
    }

    document.body.appendChild(this.toolbarElement);
  }

  /**
   * Positions the toolbar above the current selection using ProseMirror's coordinate system.
   *
   * The toolbar is centered horizontally over the selection and placed 40px above it.
   */
  private positionToolbar(): void {
    if (!this.toolbarElement) return;
    const { state } = this.view;
    const { from, to } = state.selection;
    if (from === to) return;

    const startCoords = this.view.coordsAtPos(from);
    const endCoords = this.view.coordsAtPos(to);
    const left = startCoords.left + (endCoords.right - startCoords.left) / 2;
    const top = startCoords.top - 40;

    this.toolbarElement.style.top = `${top}px`;
    this.toolbarElement.style.left = `${left - 50}px`;
  }

  /**
   * Updates the active (highlighted) state of all toolbar buttons based on the current editor state.
   *
   * For each button that has an `isActive` predicate, it evaluates the predicate and applies or removes the `active` CSS class accordingly.
   */
  private updateActiveStates(): void {
    const { state } = this.view;
    for (const btn of this.buttons) {
      if (btn.isActive) {
        const active = btn.isActive(state);
        if (active) {
          btn.element.classList.add("active");
        } else {
          btn.element.classList.remove("active");
        }
      }
    }
  }

  /**
   * Shows the toolbar if the selection is non‑empty and confined to a single block.
   *
   * The toolbar is only displayed when the selection is entirely within one block.
   * If the selection spans multiple blocks or the selection is empty, the toolbar is hidden.
   */
  public show(): void {
    if (!this.toolbarElement) return;
    const { state } = this.view;
    const { from, to, $from, $to } = state.selection;
    if (from === to) {
      if (this.isVisible) this.hide();
      return;
    }

    // Selection must be inside a block (not at top-level document)
    if ($from.depth === 0 || $to.depth === 0) {
      if (this.isVisible) this.hide();
      return;
    }

    // Check if selection is within a single block
    const blockStartFrom = $from.before($from.depth);
    const blockStartTo = $to.before($to.depth);
    if (blockStartFrom !== blockStartTo) {
      if (this.isVisible) this.hide();
      return;
    }

    this.positionToolbar();
    this.toolbarElement.style.display = "flex";
    this.isVisible = true;
    this.updateActiveStates();
  }

  /**
   * Hides the toolbar.
   */
  public hide(): void {
    if (this.toolbarElement && this.isVisible) {
      this.toolbarElement.style.display = "none";
      this.isVisible = false;
    }
  }

  /**
   * Attaches event listeners for showing and hiding the toolbar.
   *
   * - `mouseup` on the editor triggers an immediate show (after selection is finished).
   * - `selectionchange` triggers a delayed show (to accommodate keyboard selection) with a 200ms timeout.
   * - Clicking outside the editor or the toolbar hides it.
   * - Losing focus on the editor also hides it.
   */
  private attachEventListeners(): void {
    let rafId: number | null = null;
    let keyboardTimeout: number | null = null;

    const scheduleShow = (): void => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        this.show();
        rafId = null;
      });
    };

    // Mouseup: immediate show (after selection is finished)
    this.editorDom.addEventListener("mouseup", () => {
      if (keyboardTimeout) {
        clearTimeout(keyboardTimeout);
        keyboardTimeout = null;
      }
      scheduleShow();
    });

    // Selection change: delayed show (for keyboard selection)
    document.addEventListener("selectionchange", () => {
      if (keyboardTimeout) clearTimeout(keyboardTimeout);
      keyboardTimeout = window.setTimeout(() => {
        scheduleShow();
        keyboardTimeout = null;
      }, 200);
    });

    this.clickOutsideHandler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !this.editorDom.contains(target) &&
        !this.toolbarElement?.contains(target)
      ) {
        this.hide();
      }
    };
    document.addEventListener("click", this.clickOutsideHandler);

    this.blurHandler = () => {
      this.hide();
    };
    this.editorDom.addEventListener("blur", this.blurHandler);
  }

  /**
   * Destroys the toolbar, removing its DOM element and cleaning up event listeners.
   */
  public destroy(): void {
    if (this.clickOutsideHandler) {
      document.removeEventListener("click", this.clickOutsideHandler);
      this.clickOutsideHandler = null;
    }
    if (this.blurHandler) {
      this.editorDom.removeEventListener("blur", this.blurHandler);
      this.blurHandler = null;
    }
    if (this.toolbarElement) {
      this.toolbarElement.remove();
      this.toolbarElement = null;
    }
  }
}
