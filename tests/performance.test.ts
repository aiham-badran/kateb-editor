import { describe, it, expect, beforeEach } from "vitest";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "../src/core/schema";
import { JSDOM } from "jsdom";

describe("Performance", () => {
  let dom: HTMLDivElement;
  let view: EditorView;

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
    global.document = jsdom.window.document;
    dom = document.getElementById("editor") as HTMLDivElement;
  });

  it("should handle 1000 paragraphs", () => {
    // Create a document with 1000 paragraphs
    const paragraphs = [];
    for (let i = 0; i < 1000; i++) {
      paragraphs.push(
        schema.node(
          "paragraph",
          { dir: "rtl" },
          schema.text(`Paragraph ${i + 1}`),
        ),
      );
    }
    const doc = schema.node("doc", null, paragraphs);
    const start = performance.now();
    const state = EditorState.create({ schema, doc });
    view = new EditorView(dom, { state });
    const end = performance.now();
    console.log(
      `Time to create editor with 1000 paragraphs: ${(end - start).toFixed(2)} ms`,
    );
    expect(view).toBeDefined();
    // Check that scrolling and basic interactions are possible (optional)
    // This test is mostly for measuring, not for assertion
  });
});
