import { Schema, NodeSpec, MarkSpec } from "prosemirror-model";
import { Block } from "./block";
import { Mark } from "./mark";

/**
 * Base ProseMirror nodes required for any valid document.
 */
const BASE_NODES: Record<string, NodeSpec> = {
  doc: { content: "block+" },
  text: { group: "inline" },
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return ["br"];
    },
  },
};

/**
 * Base ProseMirror marks (initially empty; can be extended in future versions).
 */
const BASE_MARKS: Record<string, MarkSpec> = {};

/**
 * A builder class for constructing a ProseMirror schema from blocks and marks.
 *
 * It ensures that base nodes (doc, text, hard_break) are always present,
 * validates block specifications, and prevents duplicate names.
 *
 * @example
 * const schema = new SchemaBuilder()
 *   .addBlock(paragraphBlock)
 *   .addMark(strongMark)
 *   .build();
 *
 * // Or use the static helper:
 * const schema = SchemaBuilder.build([paragraphBlock], [strongMark]);
 */
export class SchemaBuilder {
  private nodes: Map<string, NodeSpec> = new Map();
  private marks: Map<string, MarkSpec> = new Map();

  /**
   * Creates a new SchemaBuilder instance with base nodes and marks preloaded.
   */
  constructor() {
    // Add base nodes
    for (const [name, spec] of Object.entries(BASE_NODES)) {
      this.nodes.set(name, spec);
    }
    // Add base marks
    for (const [name, spec] of Object.entries(BASE_MARKS)) {
      this.marks.set(name, spec);
    }
  }

  /**
   * Adds a block to the schema.
   *
   * @param block - The Block instance to add.
   * @returns The current builder instance for chaining.
   * @throws {Error} If a block with the same name already exists.
   *
   * @example
   * builder.addBlock(paragraphBlock);
   */
  addBlock(block: Block): this {
    if (this.nodes.has(block.name)) {
      throw new Error(`Duplicate block name: "${block.name}"`);
    }
    this.nodes.set(block.name, block.spec);
    return this;
  }

  /**
   * Adds a mark to the schema.
   *
   * @param mark - The Mark instance to add.
   * @returns The current builder instance for chaining.
   * @throws {Error} If a mark with the same name already exists.
   *
   * @example
   * builder.addMark(strongMark);
   */
  addMark(mark: Mark): this {
    if (this.marks.has(mark.name)) {
      throw new Error(`Duplicate mark name: "${mark.name}"`);
    }
    this.marks.set(mark.name, mark.spec);
    return this;
  }

  /**
   * Validates all added blocks and marks.
   *
   * Currently checks that each block’s spec is a valid object (not null/undefined).
   * Base nodes are skipped as they are guaranteed to be valid.
   *
   * @throws {Error} If any block has an invalid spec.
   */
  private validate(): void {
    for (const [name, spec] of this.nodes) {
      // Skip base nodes (they are guaranteed valid)
      if (BASE_NODES[name]) continue;
      if (!spec || typeof spec !== "object") {
        throw new Error(`Block "${name}" has an invalid spec: ${spec}`);
      }
    }
    // Marks validation: we trust the developer; no additional checks needed.
  }

  /**
   * Builds the final ProseMirror schema.
   *
   * This method validates the accumulated blocks and marks, then constructs the schema.
   *
   * @returns The ProseMirror Schema instance.
   * @throws {Error} If any block has an invalid spec (caught during validation).
   *
   * @example
   * const schema = builder.build();
   */
  build(): Schema {
    this.validate();
    const nodes: Record<string, NodeSpec> = {};
    for (const [name, spec] of this.nodes) {
      nodes[name] = spec;
    }
    const marks: Record<string, MarkSpec> = {};
    for (const [name, spec] of this.marks) {
      marks[name] = spec;
    }
    return new Schema({ nodes, marks });
  }

  /**
   * Static convenience method to build a schema directly from arrays of blocks and marks.
   *
   * @param blocks - Array of Block instances to include.
   * @param marks - Array of Mark instances to include.
   * @returns The ProseMirror Schema instance.
   *
   * @example
   * const schema = SchemaBuilder.build([paragraphBlock, headingBlock], [strongMark]);
   */
  static build(blocks: Block[], marks: Mark[]): Schema {
    const builder = new SchemaBuilder();
    for (const block of blocks) builder.addBlock(block);
    for (const mark of marks) builder.addMark(mark);
    return builder.build();
  }
}
