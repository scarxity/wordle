// lib/wordleLogic.ts

export const fetchWords = async (): Promise<string[]> => {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL_PROD ?? "";
    const response = await fetch(url);
    const text = await response.text();
    return text.split("\n").filter((w) => w.length === 5);
  } catch (error) {
    console.error("Failed to fetch words", error);
    return [];
  }
};

export const solveWordle = (
  words: string[],
  pattern: string[],    // Green: ['a', '', '', 'e', '']
  excluded: string,     // Grey: "xyz"
  yellows: string[]     // Yellow: ["r", "d", "", "", "m"] (Letters found at these specific indices)
): string[] => {
  const cleanExcluded = excluded.toLowerCase();
  
  return words.filter((word) => {
    const lowerWord = word.toLowerCase();

    // 1. EXCLUSION CHECK (Greys)
    for (const char of cleanExcluded) {
      if (lowerWord.includes(char)) return false;
    }

    // 2. PATTERN CHECK (Greens)
    for (let i = 0; i < 5; i++) {
      const char = pattern[i]?.toLowerCase();
      if (char && char !== "" && lowerWord[i] !== char) {
        return false;
      }
    }

    // 3. WRONG POSITION CHECK (Yellows)
    // "yellows" is an array of 5 strings. 
    // yellows[0] = "ab" means 'a' and 'b' are in the word, but NOT at index 0.
    for (let i = 0; i < 5; i++) {
      const constraints = yellows[i].toLowerCase();
      if (!constraints) continue;

      for (const char of constraints) {
        // Rule A: The letter MUST exist in the word
        if (!lowerWord.includes(char)) return false;
        // Rule B: The letter CANNOT be at this specific index (i)
        if (lowerWord[i] === char) return false;
      }
    }

    return true;
  });
};