import { describe, it, expect, beforeEach } from "vitest";
import { EditorState, TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "../src/core/schema";
import { pasteCleanerPlugin } from "../src/engine-arabic/paste-cleaner";
import { JSDOM } from "jsdom";

describe("pasteCleanerPlugin", () => {
  let dom: HTMLDivElement;
  let view: EditorView;

  // Helper to simulate a paste event with given HTML
  function simulatePaste(html: string) {
    const clipboardData = {
      getData: (type: string) => {
        if (type === "text/html") return html;
        return "";
      },
    };
    const pasteEvent = new Event("paste", { bubbles: true }) as any;
    pasteEvent.clipboardData = clipboardData;

    // Select all content to replace (or just the current selection)
    const { state } = view;
    const tr = state.tr.setSelection(
      TextSelection.create(state.doc, 0, state.doc.content.size),
    );
    view.dispatch(tr);

    // Dispatch the paste event
    view.dom.dispatchEvent(pasteEvent);
  }

  // Helper to extract plain text from the document
  function getTextContent(doc: any): string {
    let text = "";
    const traverse = (node: any) => {
      if (node.type === "text") text += node.text || "";
      if (node.content) node.content.forEach(traverse);
    };
    traverse(doc);
    return text;
  }

  // Helper to check if any disallowed node exists
  function hasDisallowedNode(doc: any): boolean {
    const disallowed = [
      "div",
      "span",
      "font",
      "style",
      "script",
      "table",
      "tr",
      "td",
    ];
    let found = false;
    const check = (node: any) => {
      if (disallowed.includes(node.type)) found = true;
      if (node.content) node.content.forEach(check);
    };
    check(doc);
    return found;
  }

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
    global.document = jsdom.window.document;
    dom = document.getElementById("editor") as HTMLDivElement;
    const initialState = EditorState.create({
      schema,
      plugins: [pasteCleanerPlugin],
      doc: schema.node("doc", null, [schema.node("paragraph", { dir: "rtl" })]),
    });
    view = new EditorView(dom, { state: initialState });
  });

  it("should clean simple HTML", () => {
    const html = "<p>Hello <strong>world</strong></p><h1>Title</h1>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    expect(getTextContent(doc)).toContain("Hello world");
    expect(getTextContent(doc)).toContain("Title");
  });

  it("should clean Word-like HTML (with styles, spans, fonts)", () => {
    const wordHtml = `
      <div style="margin:0; padding:0;">
        <p style="font-family:Arial;"><span style="color:red;">Colored</span> text</p>
        <font face="Times New Roman">Font tag</font>
        <p>Normal <b>bold</b> <i>italic</i></p>
      </div>
    `;
    simulatePaste(wordHtml);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const text = getTextContent(doc);
    expect(text).toContain("Colored text");
    expect(text).toContain("Font tag");
    expect(text).toContain("Normal bold italic");
  });

  it("should clean Google Docs HTML (with nested spans, inline styles)", () => {
    const googleHtml = `
      <meta charset="utf-8">
      <b style="font-weight:normal;" id="docs-internal-guid-...">
        <span style="font-size:11pt;font-family:Arial;color:#000000;">Hello</span>
        <span style="font-weight:700;">world</span>
      </b>
      <p dir="ltr"><span>Another paragraph</span></p>
    `;
    simulatePaste(googleHtml);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const text = getTextContent(doc);
    expect(text).toContain("Hello world");
    expect(text).toContain("Another paragraph");
  });

  it("should preserve allowed tags (strong, em, br)", () => {
    const html =
      "<p>Text with <strong>bold</strong> and <em>italic</em><br>new line</p>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const text = getTextContent(doc);
    expect(text).toContain("Text with bold and italic");
    expect(text).toContain("new line");
  });

  it("should strip disallowed inline tags", () => {
    const html =
      "<p><span>keep text</span> <font>remove font</font> <u>underline</u></p>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const text = getTextContent(doc);
    expect(text).toContain("keep text remove font underline");
  });

  it("should convert headings (h1-h3) and keep them", () => {
    const html = "<h1>Heading 1</h1><h2>Heading 2</h2><h3>Heading 3</h3>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const headingTypes = doc.content.map((node: any) => node.type);
    expect(headingTypes).toEqual(["heading", "heading", "heading"]);
  });

  it("should handle nested block elements correctly", () => {
    const html = "<div><p>First</p><div><p>Second</p></div></div>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(hasDisallowedNode(doc)).toBe(false);
    const paragraphCount = doc.content.filter(
      (n: any) => n.type === "paragraph",
    ).length;
    expect(paragraphCount).toBe(2);
    expect(getTextContent(doc)).toContain("FirstSecond");
  });

  it("should handle empty paste gracefully", () => {
    const html = "";
    simulatePaste(html);
    // Should not crash and keep original content
    const doc = view.state.doc.toJSON();
    expect(doc.content.length).toBeGreaterThan(0);
  });

  it("should not introduce extra blank paragraphs", () => {
    const html = "<p>Hello</p><p>World</p>";
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    expect(doc.content.length).toBe(2);
    expect(getTextContent(doc)).toBe("HelloWorld");
  });

  it("should preserve direction (dir) attribute on blocks if present", () => {
    const html = '<p dir="rtl">عربي</p><p dir="ltr">English</p>';
    simulatePaste(html);
    const doc = view.state.doc.toJSON();
    const blocks = doc.content;
    expect(blocks[0].attrs.dir).toBe("rtl");
    expect(blocks[1].attrs.dir).toBe("ltr");
  });
});
