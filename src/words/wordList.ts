const WORD_URLS = {
  common: 'https://raw.githubusercontent.com/jlumbroso/wordle-react-clone/refs/heads/main/src/wordle-nytimes-acceptable-bank.txt',
  allowed: 'https://raw.githubusercontent.com/jlumbroso/wordle-react-clone/refs/heads/main/src/wordle-nytimes-main-bank.txt'
};

async function generateWordSetFromWordBank(url: string): Promise<string[]> {
  const response = await fetch(url);
  const text = await response.text();
  return text.toLowerCase()
    .split(/\r?\n/)
    .map(w => w.trim())
    .filter(w => w.length === 5 && /^[a-z]{5}$/.test(w));
}

export async function loadWordList(): Promise<string[]> {
  try {
    const [common, allowed] = await Promise.all([
      generateWordSetFromWordBank(WORD_URLS.common),
      generateWordSetFromWordBank(WORD_URLS.allowed)
    ]);
    const unique = Array.from(new Set([...common, ...allowed]));
    console.log(`Loaded ${unique.length} words from CDN`);
    return unique;
  } catch (e) {
    console.warn('CDN failed, using fallback');
    return [];
  }
}
