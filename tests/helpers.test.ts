import { describe, it, expect } from "vitest";
import {
  createBlock,
  createMark,
  createToolbarButton,
  createSlashMenuItem,
  createKeymap,
} from "../src/core/helpers";
import { Block } from "../src/core/block";
import { Mark } from "../src/core/mark";

describe("helpers", () => {
  describe("createBlock", () => {
    it("creates a basic block", () => {
      const block = createBlock("test", { content: "inline*" });
      expect(block).toBeInstanceOf(Block);
      expect(block.name).toBe("test");
      expect(block.spec).toEqual({ content: "inline*" });
      expect(block.slashMenuItem).toBeUndefined();
      expect(block.allowedMarks).toBeUndefined();
    });

    it("creates block with slashMenuItem when slashLabel provided", () => {
      const block = createBlock(
        "test",
        { content: "inline*" },
        { slashLabel: "Test Block" },
      );
      expect(block.slashMenuItem).toBeDefined();
      expect(block.slashMenuItem!.label).toBe("Test Block");
      expect(block.slashMenuItem!.searchTerms).toBeUndefined();
    });

    it("creates block with searchTerms", () => {
      const block = createBlock(
        "test",
        {},
        { slashLabel: "Test", searchTerms: ["t1", "t2"] },
      );
      expect(block.slashMenuItem!.searchTerms).toEqual(["t1", "t2"]);
    });

    it("creates block with toolbarButtons", () => {
      const buttons = [createToolbarButton("X", () => true)];
      const block = createBlock("test", {}, { toolbarButtons: buttons });
      expect(block.toolbarButtons).toBe(buttons);
    });

    it("creates block with keymap", () => {
      const keymap = { "Ctrl-X": () => true };
      const block = createBlock("test", {}, { keymap });
      expect(block.keymap).toBe(keymap);
    });

    it("creates block with allowedMarks", () => {
      const block = createBlock("test", {}, { allowedMarks: ["strong", "em"] });
      expect(block.allowedMarks).toEqual(["strong", "em"]);
    });
  });

  describe("createMark", () => {
    it("creates a basic mark", () => {
      const mark = createMark("test", {});
      expect(mark).toBeInstanceOf(Mark);
      expect(mark.name).toBe("test");
      expect(mark.spec).toEqual({});
    });

    it("creates mark with toolbarButtons", () => {
      const buttons = [createToolbarButton("X", () => true)];
      const mark = createMark("test", {}, { toolbarButtons: buttons });
      expect(mark.toolbarButtons).toBe(buttons);
    });

    it("creates mark with keymap", () => {
      const keymap = { "Ctrl-X": () => true };
      const mark = createMark("test", {}, { keymap });
      expect(mark.keymap).toBe(keymap);
    });
  });

  describe("createToolbarButton", () => {
    it("creates a toolbar button with label and command", () => {
      const cmd = () => true;
      const btn = createToolbarButton("B", cmd);
      expect(btn.label).toBe("B");
      expect(btn.command).toBe(cmd);
      expect(btn.isActive).toBeUndefined();
    });

    it("creates toolbar button with isActive function", () => {
      const isActive = () => true;
      const btn = createToolbarButton("B", () => true, isActive);
      expect(btn.isActive).toBe(isActive);
    });
  });

  describe("createSlashMenuItem", () => {
    it("creates slash menu item with label", () => {
      const item = createSlashMenuItem("Paragraph");
      expect(item.label).toBe("Paragraph");
      expect(item.searchTerms).toBeUndefined();
    });

    it("creates slash menu item with searchTerms", () => {
      const item = createSlashMenuItem("Paragraph", ["p", "para"]);
      expect(item.searchTerms).toEqual(["p", "para"]);
    });
  });

  describe("createKeymap", () => {
    it("returns the same object", () => {
      const shortcuts = { "Mod-b": () => true };
      const result = createKeymap(shortcuts);
      expect(result).toBe(shortcuts);
    });
  });
});
