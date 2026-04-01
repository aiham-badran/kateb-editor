import { InputRule, inputRules } from "prosemirror-inputrules";
import { Node as ProseMirrorNode } from "prosemirror-model";
import { Transaction, Selection } from "prosemirror-state";

/**
 * Creates an InputRule that converts a Markdown heading pattern into an actual heading node.
 *
 * The rule matches a string consisting of exactly `level` hash symbols followed by a space
 * (`# `, `## `, or `### `) at the beginning of a block. When triggered, it replaces that
 * pattern with a heading node of the corresponding level.
 *
 * @param level - Heading level (1, 2, or 3).
 * @returns An InputRule that, when applied, transforms the matched text into a heading.
 */
function headingRule(level: number): InputRule {
  const regex = new RegExp(`^(#{${level}})\\s$`);
  return new InputRule(regex, (state, match, start, end) => {
    const headingNode: ProseMirrorNode = state.schema.nodes.heading.create({
      level,
      dir: "rtl",
    });
    const tr = state.tr.replaceRangeWith(start, end, headingNode);
    const newPos = start + 1;
    return tr.setSelection(Selection.near(tr.doc.resolve(newPos)));
  });
}

/**
 * ProseMirror plugin that adds Markdown‑style heading shortcuts.
 *
 * When the user types `# ` (space after one hash), the current paragraph is replaced
 * with an `<h1>` heading. Similarly, `## ` produces an `<h2>` heading, and `### ` produces an `<h3>` heading.
 *
 * The plugin respects the editor's RTL settings by setting `dir: "rtl"` on the newly created heading nodes.
 */
export const markdownInputRulesPlugin = inputRules({
  rules: [headingRule(1), headingRule(2), headingRule(3)],
});
