import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { JSDOM } from "jsdom";
import { KatebEditor } from "../src/core/editor";
import { paragraphBlock, headingBlock } from "../src/blocks";
import { strongMark, emMark } from "../src/marks";

describe("KatebEditor", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
    global.document = jsdom.window.document;
    container = document.getElementById("editor") as HTMLDivElement;
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it("should create an editor instance", () => {
    const editor = new KatebEditor(container);
    expect(editor).toBeInstanceOf(KatebEditor);
    editor.destroy();
  });

  it("should insert editor view into the container", () => {
    const editor = new KatebEditor(container);
    const editorViewElement = container.querySelector(
      ".kateb-editor-container",
    );
    expect(editorViewElement).toBeTruthy();
    editor.destroy();
  });

  it("should return content as JSON", () => {
    const editor = new KatebEditor(container);
    const content = editor.getContent();
    // ProseMirror schema basic gives a doc with a paragraph by default
    expect(content).toHaveProperty("type", "doc");
    expect(content).toHaveProperty("content");
    editor.destroy();
  });

  it("should destroy the editor cleanly", () => {
    const editor = new KatebEditor(container);
    editor.destroy();
    // After destroy, the editor view should be removed from the container?
    // Actually ProseMirror's destroy() removes the view's DOM but leaves the container.
    // We can check that container still exists (it does), but we can check that editor methods no longer work.
    // For simplicity, we check that the view is no longer accessible.
    expect(() => editor.getContent()).toThrow(); // After destroy, state is null?
    // But in our implementation, destroy() just calls view.destroy(), so getContent() will throw.
    // We'll adjust later if needed.
  });
  it("automatically adds paragraph block when none provided", () => {
    const editor = new KatebEditor(container);
    const content = editor.getContent();
    expect(content).toMatchObject({
      type: "doc",
      content: [{ type: "paragraph" }],
    });
    editor.destroy();
  });
});
