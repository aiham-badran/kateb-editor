import { describe, it, expect, beforeEach } from "vitest";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "../src/core/schema";
import { autoDirectionPlugin } from "../src/engine-arabic/auto-direction-plugin";
import { JSDOM } from "jsdom";

describe("autoDirectionPlugin", () => {
  let dom: HTMLDivElement;
  let view: EditorView;

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
    global.document = jsdom.window.document;
    dom = document.getElementById("editor") as HTMLDivElement;
    const state = EditorState.create({
      schema,
      plugins: [autoDirectionPlugin],
    });
    view = new EditorView(dom, { state });
  });

  it("updates direction when typing Arabic text", () => {
    // Insert Arabic text
    const tr = view.state.tr.insertText("مرحبا");
    view.dispatch(tr);
    // Wait for the plugin to react via appendTransaction
    // After dispatch, the new state should have updated dir
    const blockNode = view.state.doc.firstChild;
    expect(blockNode?.attrs.dir).toBe("rtl");
  });

  it("updates direction when typing English text", () => {
    const tr = view.state.tr.insertText("Hello");
    view.dispatch(tr);
    const blockNode = view.state.doc.firstChild;
    expect(blockNode?.attrs.dir).toBe("ltr");
  });

  it("changes direction when text content changes", () => {
    // Start with Arabic
    let tr = view.state.tr.insertText("مرحبا");
    view.dispatch(tr);
    let blockNode = view.state.doc.firstChild;
    expect(blockNode?.attrs.dir).toBe("rtl");

    // Replace with English
    tr = view.state.tr.insertText("Hello", 0, view.state.doc.content.size);
    view.dispatch(tr);
    blockNode = view.state.doc.firstChild;
    expect(blockNode?.attrs.dir).toBe("ltr");
  });
});
