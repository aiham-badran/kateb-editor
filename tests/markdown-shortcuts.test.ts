import { describe, it, expect, beforeEach } from "vitest";
import { EditorState, Selection, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { schema } from "../src/core/schema";
import { markdownInputRulesPlugin } from "../src/engine-arabic/markdown-inputrules";
import { JSDOM } from "jsdom";

describe("markdownInputRulesPlugin", () => {
  let dom: HTMLDivElement;
  let view: EditorView;

  beforeEach(() => {
    const jsdom = new JSDOM('<!DOCTYPE html><div id="editor"></div>');
    global.document = jsdom.window.document;
    dom = document.getElementById("editor") as HTMLDivElement;

    const initialState = EditorState.create({
      schema,
      plugins: [markdownInputRulesPlugin],
      doc: schema.node("doc", null, [schema.node("paragraph", { dir: "rtl" })]),
    });

    view = new EditorView(dom, { state: initialState });
  });

  // Helper to simulate typing a sequence and handling space via the plugin
  function typeAndTriggerSpace(sequence: string): void {
    // Type all characters except the final space
    for (let i = 0; i < sequence.length - 1; i++) {
      const ch = sequence[i];
      const { state } = view;
      const { from } = state.selection;
      const tr = state.tr.insertText(ch, from, from);
      view.dispatch(tr);
    }

    // Now handle the final space via the plugin's handleTextInput
    const { state } = view;
    const { from } = state.selection;
    const plugin = markdownInputRulesPlugin;
    const handler = plugin.props.handleTextInput;

    if (handler) {
      // Call handler with proper 'this' context
      const handled = handler.call(
        plugin,
        view,
        from,
        from,
        " ",
        () => state.tr,
      );

      // If handled is true, the space was consumed and not inserted
      if (!handled) {
        // If not handled, we need to insert the space normally
        const tr = state.tr.insertText(" ", from, from);
        view.dispatch(tr);
      }
    }
  }

  it('should convert "# " to heading 1', () => {
    typeAndTriggerSpace("# ");
    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("heading");
    expect(docNode?.attrs.level).toBe(1);
    expect(docNode?.attrs.dir).toBe("rtl");
  });

  it('should convert "## " to heading 2', () => {
    typeAndTriggerSpace("## ");
    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("heading");
    expect(docNode?.attrs.level).toBe(2);
    expect(docNode?.attrs.dir).toBe("rtl");
  });

  it('should convert "### " to heading 3', () => {
    typeAndTriggerSpace("### ");
    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("heading");
    expect(docNode?.attrs.level).toBe(3);
    expect(docNode?.attrs.dir).toBe("rtl");
  });

  it('should not convert "#" without space', () => {
    // Type '#' without space
    const { state } = view;
    const { from } = state.selection;
    const tr = state.tr.insertText("#", from, from);
    view.dispatch(tr);

    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("paragraph");
  });

  it('should not convert " # " (with leading space)', () => {
    // Start with a space
    let { state } = view;
    let { from } = state.selection;
    let tr = state.tr.insertText(" ", from, from);
    view.dispatch(tr);

    // Then type '#'
    const plugin = markdownInputRulesPlugin;
    const handler = plugin.props.handleTextInput;
    if (handler) {
      const newFrom = view.state.selection.from;
      handler.call(plugin, view, newFrom, newFrom, "#", () => view.state.tr);
    }
    // Now type space
    if (handler) {
      const newFrom = view.state.selection.from;
      handler.call(plugin, view, newFrom, newFrom, " ", () => view.state.tr);
    }

    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("paragraph");
  });

  it('should not convert "#text" without space', () => {
    // Type '#text' without space
    const { state } = view;
    const { from } = state.selection;
    const tr = state.tr.insertText("#text", from, from);
    view.dispatch(tr);

    const docNode = view.state.doc.firstChild;
    expect(docNode?.type.name).toBe("paragraph");
  });
});
