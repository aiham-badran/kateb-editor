import { describe, it, expect, vi } from "vitest";
import { arabicPunctuationPlugin } from "../src/engine-arabic/punctuation";

describe("arabicPunctuationPlugin", () => {
  it("should replace comma with Arabic comma", () => {
    const view = {
      state: { tr: { insertText: vi.fn().mockReturnThis() } },
      dispatch: vi.fn(),
    } as any;

    const handler = arabicPunctuationPlugin.props.handleTextInput;
    const result = handler(view, 0, 0, ",");

    expect(view.dispatch).toHaveBeenCalled();
    expect(view.state.tr.insertText).toHaveBeenCalledWith("،", 0, 0);
    expect(result).toBe(true);
  });

  it("should replace question mark with Arabic question mark", () => {
    const view = {
      state: { tr: { insertText: vi.fn().mockReturnThis() } },
      dispatch: vi.fn(),
    } as any;

    const handler = arabicPunctuationPlugin.props.handleTextInput;
    const result = handler(view, 0, 0, "?");

    expect(view.dispatch).toHaveBeenCalled();
    expect(view.state.tr.insertText).toHaveBeenCalledWith("؟", 0, 0);
    expect(result).toBe(true);
  });

  it("should replace semicolon with Arabic semicolon", () => {
    const view = {
      state: { tr: { insertText: vi.fn().mockReturnThis() } },
      dispatch: vi.fn(),
    } as any;

    const handler = arabicPunctuationPlugin.props.handleTextInput;
    const result = handler(view, 0, 0, ";");

    expect(view.dispatch).toHaveBeenCalled();
    expect(view.state.tr.insertText).toHaveBeenCalledWith("؛", 0, 0);
    expect(result).toBe(true);
  });

  it("should NOT replace other characters", () => {
    const view = {
      state: { tr: { insertText: vi.fn() } },
      dispatch: vi.fn(),
    } as any;

    const handler = arabicPunctuationPlugin.props.handleTextInput;
    const result = handler(view, 0, 0, "a");

    expect(view.dispatch).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
