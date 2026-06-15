export function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);

    if (!match) {
      throw new Error("No valid JSON found in model response");
    }

    return JSON.parse(match[0]);
  }
}