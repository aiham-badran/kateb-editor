/**
 * Detects the text direction (RTL or LTR) based on the first **strong** character.
 *
 * The function scans the input string character by character, ignoring weak characters:
 * - Whitespace
 * - Punctuation (including symbols like `,`, `?`, `;`)
 * - Digits (0‑9)
 *
 * The first character that is neither weak nor a digit determines the direction:
 * - If that character belongs to an RTL script (Arabic, Persian, Urdu, etc.), the function returns `'rtl'`.
 * - Otherwise (e.g., a Latin letter), it returns `'ltr'`.
 *
 * If no strong character is found (the string contains only weak characters or is empty), it defaults to `'rtl'`,
 * which is appropriate for an Arabic‑oriented editor.
 *
 * @param text - The text to analyze.
 * @returns `'rtl'` if the first strong character is RTL, `'ltr'` if it is LTR, or `'rtl'` as fallback.
 *
 * @example
 * detectDirection('مرحبا');       // 'rtl'
 * detectDirection('Hello');       // 'ltr'
 * detectDirection('123');         // 'rtl' (only digits → fallback)
 * detectDirection('...');         // 'rtl' (only punctuation → fallback)
 * detectDirection('1 مرحبا');     // 'rtl' (digit skipped, first strong is Arabic)
 * detectDirection('مرحبا Hello'); // 'rtl' (first strong is Arabic)
 */
export function detectDirection(text: string): "rtl" | "ltr" {
  if (!text) return "rtl";

  // Unicode ranges for RTL scripts (Arabic, Persian, Urdu, etc.)
  const rtlRegex =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

  for (const char of text) {
    // Skip whitespace, punctuation, and digits (0-9)
    if (
      /\s/.test(char) ||
      /[^\w\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(
        char,
      ) ||
      /[0-9]/.test(char)
    ) {
      continue;
    }
    if (rtlRegex.test(char)) {
      return "rtl";
    }
    // If we reach here, it's a strong LTR character (letter, number)
    return "ltr";
  }
  // No strong character found (e.g., only punctuation)
  return "rtl";
}
