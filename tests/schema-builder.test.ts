import { describe, it, expect, beforeEach } from "vitest";
import { SchemaBuilder } from "../src/core/schema-builder";
import { Block } from "../src/core/block";
import { Mark } from "../src/core/mark";

describe("SchemaBuilder", () => {
  let builder: SchemaBuilder;

  beforeEach(() => {
    builder = new SchemaBuilder();
  });

  describe("addBlock", () => {
    it("adds a block", () => {
      const block = new Block({
        name: "p",
        spec: { content: "inline*", group: "block" },
      });
      builder.addBlock(block);
      const schema = builder.build();
      expect(schema.nodes.p).toBeDefined();
    });

    it("throws when adding duplicate block name", () => {
      const block1 = new Block({ name: "p", spec: {} });
      const block2 = new Block({ name: "p", spec: {} });
      builder.addBlock(block1);
      expect(() => builder.addBlock(block2)).toThrow(
        'Duplicate block name: "p"',
      );
    });
  });

  describe("addMark", () => {
    it("adds a mark", () => {
      const mark = new Mark({ name: "strong", spec: {} });
      const block = new Block({
        name: "p",
        spec: { content: "inline*", group: "block" },
      });
      builder.addBlock(block);
      builder.addMark(mark);
      const schema = builder.build();
      expect(schema.marks.strong).toBeDefined();
    });

    it("throws when adding duplicate mark name", () => {
      const mark1 = new Mark({ name: "strong", spec: {} });
      const mark2 = new Mark({ name: "strong", spec: {} });
      builder.addMark(mark1);
      expect(() => builder.addMark(mark2)).toThrow(
        'Duplicate mark name: "strong"',
      );
    });
  });

  describe("validate", () => {
    it("throws when block spec is invalid", () => {
      const invalidBlock = new Block({ name: "bad", spec: null as any });
      builder.addBlock(invalidBlock);
      expect(() => builder.build()).toThrow('Block "bad" has an invalid spec');
    });
  });

  describe("static build", () => {
    it("builds schema from blocks and marks", () => {
      const block = new Block({
        name: "p",
        spec: { content: "inline*", group: "block" },
      });
      const mark = new Mark({ name: "strong", spec: {} });
      const schema = SchemaBuilder.build([block], [mark]);
      expect(schema.nodes.p).toBeDefined();
      expect(schema.marks.strong).toBeDefined();
      // base nodes should be present
      expect(schema.nodes.doc).toBeDefined();
      expect(schema.nodes.text).toBeDefined();
      expect(schema.nodes.hard_break).toBeDefined();
    });

    it("throws on duplicate names", () => {
      const block1 = new Block({ name: "p", spec: {} });
      const block2 = new Block({ name: "p", spec: {} });
      expect(() => SchemaBuilder.build([block1, block2], [])).toThrow(
        'Duplicate block name: "p"',
      );
    });

    it("throws on invalid block spec", () => {
      const invalidBlock = new Block({ name: "bad", spec: null as any });
      expect(() => SchemaBuilder.build([invalidBlock], [])).toThrow(
        'Block "bad" has an invalid spec',
      );
    });
  });
});
