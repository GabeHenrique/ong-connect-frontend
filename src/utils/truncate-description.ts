export function truncateAfterTwentyWords(text: string): string {
  const words = text.split(" ");

  if (words.length <= 20) {
    return text;
  } else {
    return words.slice(0, 20).join(" ") + "...";
  }
}
