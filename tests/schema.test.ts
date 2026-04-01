import { describe, it, expect } from "vitest";
import { schema } from "../src/core/schema";

describe("Kateb Editor Schema", () => {
  it("should have doc node", () => {
    expect(schema.nodes.doc).toBeDefined();
  });

  it("should have paragraph node", () => {
    expect(schema.nodes.paragraph).toBeDefined();
  });

  it("should have heading node", () => {
    expect(schema.nodes.heading).toBeDefined();
  });

  it("should have text node", () => {
    expect(schema.nodes.text).toBeDefined();
  });

  it("should have strong and em marks", () => {
    expect(schema.marks.strong).toBeDefined();
    expect(schema.marks.em).toBeDefined();
  });

  it("should allow a document containing a paragraph", () => {
    const doc = schema.node("doc", null, [
      schema.node("paragraph", null, schema.text("Hello world")),
    ]);
    expect(doc.type.name).toBe("doc");
    expect(doc.content.child(0).type.name).toBe("paragraph");
  });

  it("should allow a document containing a heading", () => {
    const doc = schema.node("doc", null, [
      schema.node("heading", { level: 1 }, schema.text("Main Title")),
    ]);
    expect(doc.type.name).toBe("doc");
    expect(doc.content.child(0).type.name).toBe("heading");
  });

  it("should allow mixing headings and paragraphs", () => {
    const doc = schema.node("doc", null, [
      schema.node("heading", { level: 2 }, schema.text("Section")),
      schema.node("paragraph", null, schema.text("Some text")),
    ]);
    expect(doc.content.childCount).toBe(2);
  });

  it("should reject invalid node placement (e.g., heading inside heading)", () => {
    // This test expects an error when constructing invalid document
    expect(() => {
      schema.node("heading", { level: 1 }, [
        schema.node("heading", { level: 2 }, schema.text("Nested heading")),
      ]);
    }).toThrow(); // ProseMirror should throw because content is not inline
  });
});
