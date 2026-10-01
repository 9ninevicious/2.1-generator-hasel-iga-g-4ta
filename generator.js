// ==========================================================================
// Generator Haseł - Core Password Generator & Security Metrics Engine
// Cryptographically secure, multi-mode, supports whatever length
// ==========================================================================

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?~'
};

const AMBIGUOUS_CHARS = /[il1Lo0O]/g;

// NATO Phonetic mapping + Polish descriptions for characters
const PHONETIC_MAP = {
  'A': 'Alpha', 'B': 'Bravo', 'C': 'Charlie', 'D': 'Delta', 'E': 'Echo',
  'F': 'Foxtrot', 'G': 'Golf', 'H': 'Hotel', 'I': 'India', 'J': 'Juliet',
  'K': 'Kilo', 'L': 'Lima', 'M': 'Mike', 'N': 'November', 'O': 'Oscar',
  'P': 'Papa', 'Q': 'Quebec', 'R': 'Romeo', 'S': 'Sierra', 'T': 'Tango',
  'U': 'Uniform', 'V': 'Victor', 'W': 'Whiskey', 'X': 'X-ray', 'Y': 'Yankee',
  'Z': 'Zulu',
  'a': 'alfa', 'b': 'brawo', 'c': 'czarli', 'd': 'delta', 'e': 'echo',
  'f': 'fokstrot', 'g': 'golf', 'h': 'hotel', 'i': 'india', 'j': 'dżuliet',
  'k': 'kilo', 'l': 'lima', 'm': 'majk', 'n': 'nowember', 'o': 'oskar',
  'p': 'papa', 'q': 'kebek', 'r': 'romio', 's': 'siera', 't': 'tango',
  'u': 'uniform', 'v': 'wiktor', 'w': 'łiski', 'x': 'iks-rej', 'y': 'janki',
  'z': 'zulu',
  '0': 'Zero (0)', '1': 'Jeden (1)', '2': 'Dwa (2)', '3': 'Trzy (3)',
  '4': 'Cztery (4)', '5': 'Pięć (5)', '6': 'Sześć (6)', '7': 'Siedem (7)',
  '8': 'Osiem (8)', '9': 'Dziewięć (9)',
  '!': 'Wykrzyknik (!)', '@': 'Małpa (@)', '#': 'Kratka (#)',
  '$': 'Dolar ($)', '%': 'Procent (%)', '^': 'Daszek (^)',
  '&': 'Ampersand (&)', '*': 'Gwiazdka (*)', '(': 'Nawias (',
  ')': 'Nawias )', '-': 'Myślnik (-)', '_': 'Podkreślnik (_)',
  '+': 'Plus (+)', '=': 'Równa się (=)', '[': 'Nawias [',
  ']': 'Nawias ]', '{': 'Klamra {', '}': 'Klamra }',
  '|': 'Pionowa kreska (|)', ';': 'Średnik (;)', ':': 'Dwukropek (:)',
  ',': 'Przecinek (,)', '.': 'Kropka (.)', '<': 'Mniejszy (<)',
  '>': 'Większy (>)', '?': 'Pytajnik (?)', '~': 'Tylda (~)',
  '/': 'Ukośnik (/)'
};

// Curated Polish and English wordlist for memorable passphrases
const DICEWARE_WORDS = [
  'bursztyn', 'chmura', 'diament', 'echo', 'fala', 'gwiazda', 'horyzont', 'iskra',
  'jezioro', 'kamien', 'las', 'ksiezyc', 'most', 'niebo', 'ocean', 'potok', 'radar',
  'slonce', 'tarcza', 'wiatr', 'zagiel', 'zorza', 'orzel', 'sokol', 'bizon', 'wilk',
  'atlas', 'bateria', 'cyber', 'delta', 'enigma', 'flota', 'galaktyka', 'heksagon',
  'impuls', 'jon', 'kryształ', 'laser', 'magma', 'neutron', 'orbita', 'piksel',
  'kwant', 'reaktor', 'satelita', 'tytan', 'uran', 'wektor', 'zenit', 'koral',
  'safir', 'topaz', 'rubin', 'kwarc', 'bursztynowy', 'szmaragd', 'piryt', 'agat',
  'orkan', 'tajfun', 'lawina', 'wulkan', 'gejzer', 'arktyka', 'pustynia', 'kanion',
  'feniks', 'gryf', 'smok', 'pegaz', 'centaur', 'hydra', 'kraken', 'chimera',
  'matrix', 'neon', 'kod', 'bajt', 'bit', 'serwer', 'wezel', 'procesor', 'rdzen',
  'shield', 'falcon', 'galaxy', 'nexus', 'vortex', 'shadow', 'zenith', 'beacon',
  'aurora', 'comet', 'meteor', 'pulsar', 'nebula', 'quasars', 'cosmos', 'stellar'
];

// Consonants and vowels for pronounceable passwords
const CONSONANTS = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'w', 'z'];
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'y'];

class PasswordGenerator {
  /**
   * Cryptographically secure random integer in range [0, max)
   */
  static secureRandomInt(max) {
    if (max <= 0) return 0;
    const array = new Uint32Array(1);
    const cryptoObj = (typeof globalThis !== 'undefined' && globalThis.crypto) ? globalThis.crypto : window.crypto;
    cryptoObj.getRandomValues(array);
    return array[0] % max;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm with crypto randomness
   */
  static secureShuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.secureRandomInt(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Generate password based on options
   */
  static generate(options = {}) {
    const {
      length = 16,
      mode = 'random', // 'random' | 'diceware' | 'pronounceable' | 'pin'
      includeUpper = true,
      includeLower = true,
      includeNumbers = true,
      includeSymbols = true,
      excludeAmbiguous = false,
      separator = '-',
      capitalizeWords = true,
      includeNumberInDiceware = true
    } = options;

    const safeLength = Math.max(1, parseInt(length, 10) || 16);

    let password = '';

    switch (mode) {
      case 'diceware':
        password = this.generateDiceware(safeLength, separator, capitalizeWords, includeNumberInDiceware);
        break;
      case 'pronounceable':
        password = this.generatePronounceable(safeLength, includeUpper, includeNumbers, includeSymbols);
        break;
      case 'pin':
        password = this.generatePIN(safeLength);
        break;
      case 'random':
      default:
        password = this.generateRandom(safeLength, {
          includeUpper,
          includeLower,
          includeNumbers,
          includeSymbols,
          excludeAmbiguous
        });
        break;
    }

    const metrics = this.calculateMetrics(password, options);

    return {
      password,
      length: password.length,
      mode,
      metrics,
      timestamp: Date.now()
    };
  }

  /**
   * Generate standard random password of whatever length
   */
  static generateRandom(length, opts) {
    let pool = '';
    const activeSets = [];

    let upperSet = CHAR_SETS.uppercase;
    let lowerSet = CHAR_SETS.lowercase;
    let numSet = CHAR_SETS.numbers;
    let symSet = CHAR_SETS.symbols;

    if (opts.excludeAmbiguous) {
      upperSet = upperSet.replace(AMBIGUOUS_CHARS, '');
      lowerSet = lowerSet.replace(AMBIGUOUS_CHARS, '');
      numSet = numSet.replace(AMBIGUOUS_CHARS, '');
    }

    if (opts.includeUpper) { pool += upperSet; activeSets.push(upperSet); }
    if (opts.includeLower) { pool += lowerSet; activeSets.push(lowerSet); }
    if (opts.includeNumbers) { pool += numSet; activeSets.push(numSet); }
    if (opts.includeSymbols) { pool += symSet; activeSets.push(symSet); }

    // Fallback if user unchecks everything
    if (pool.length === 0) {
      pool = lowerSet;
      activeSets.push(lowerSet);
    }

    const chars = [];

    // Ensure at least one character from each chosen set if length permits
    if (length >= activeSets.length) {
      activeSets.forEach(set => {
        chars.push(set[this.secureRandomInt(set.length)]);
      });
    }

    // Fill remaining length
    while (chars.length < length) {
      chars.push(pool[this.secureRandomInt(pool.length)]);
    }

    // Shuffle characters so guaranteed sets aren't at the beginning
    this.secureShuffle(chars);
    return chars.join('');
  }

  /**
   * Generate Diceware passphrase
   */
  static generateDiceware(desiredLength, separator = '-', capitalize = true, appendNumber = true) {
    // If length <= 10, generate 2-3 words; if length > 10, calculate approximate word count
    let wordCount = Math.max(3, Math.round(desiredLength / 6));
    if (desiredLength <= 10) wordCount = 2;
    if (desiredLength >= 40) wordCount = Math.round(desiredLength / 5);

    const words = [];
    for (let i = 0; i < wordCount; i++) {
      let word = DICEWARE_WORDS[this.secureRandomInt(DICEWARE_WORDS.length)];
      if (capitalize) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }

    let result = words.join(separator);

    if (appendNumber) {
      const num = this.secureRandomInt(900) + 100;
      result += separator + num;
    }

    return result;
  }

  /**
   * Generate pronounceable syllables of whatever length
   */
  static generatePronounceable(length, includeUpper, includeNumbers, includeSymbols) {
    let result = '';
    let isConsonant = true;

    while (result.length < length) {
      let char = isConsonant
        ? CONSONANTS[this.secureRandomInt(CONSONANTS.length)]
        : VOWELS[this.secureRandomInt(VOWELS.length)];

      // Capitalize first letter of syllables occasionally if uppercase enabled
      if (includeUpper && isConsonant && (result.length === 0 || this.secureRandomInt(3) === 0)) {
        char = char.toUpperCase();
      }

      result += char;
      isConsonant = !isConsonant;
    }

    // Trim to exact length
    result = result.substring(0, length);

    // Optionally inject a number or symbol if desired
    if (includeNumbers && length > 3) {
      const pos = this.secureRandomInt(length - 1) + 1;
      const num = String(this.secureRandomInt(10));
      result = result.substring(0, pos) + num + result.substring(pos + 1);
    }

    if (includeSymbols && length > 5) {
      const pos = this.secureRandomInt(length - 1) + 1;
      const sym = CHAR_SETS.symbols[this.secureRandomInt(CHAR_SETS.symbols.length)];
      result = result.substring(0, pos) + sym + result.substring(pos + 1);
    }

    return result;
  }

  /**
   * Generate numeric PIN of whatever length
   */
  static generatePIN(length) {
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += this.secureRandomInt(10);
    }
    return pin;
  }

  /**
   * Calculate security metrics: Entropy, crack time, character distribution
   */
  static calculateMetrics(password) {
    const len = password.length;
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    let upperCount = 0;
    let lowerCount = 0;
    let numCount = 0;
    let symCount = 0;

    for (let i = 0; i < len; i++) {
      const ch = password[i];
      if (/[A-Z]/.test(ch)) { hasUpper = true; upperCount++; }
      else if (/[a-z]/.test(ch)) { hasLower = true; lowerCount++; }
      else if (/[0-9]/.test(ch)) { hasNum = true; numCount++; }
      else { hasSym = true; symCount++; }
    }

    // Calculate pool size
    let poolSize = 0;
    if (hasLower) poolSize += 26;
    if (hasUpper) poolSize += 26;
    if (hasNum) poolSize += 10;
    if (hasSym) poolSize += 32;
    if (poolSize === 0) poolSize = 26;

    // Shannon entropy in bits
    const entropy = Math.round(len * Math.log2(poolSize));

    // Strength categorization
    let strengthLevel = 0; // 0: Very Weak, 1: Weak, 2: Medium, 3: Strong, 4: Unbreakable
    let strengthLabelPL = 'Bardzo słabe';
    let strengthLabelEN = 'Very Weak';
    let strengthColor = '#f43f5e'; // red

    if (entropy < 28 || len < 6) {
      strengthLevel = 0;
      strengthLabelPL = 'Bardzo słabe';
      strengthLabelEN = 'Very Weak';
      strengthColor = '#f43f5e';
    } else if (entropy < 45 || len < 9) {
      strengthLevel = 1;
      strengthLabelPL = 'Słabe';
      strengthLabelEN = 'Weak';
      strengthColor = '#f97316';
    } else if (entropy < 65 || len < 12) {
      strengthLevel = 2;
      strengthLabelPL = 'Średnie';
      strengthLabelEN = 'Fair';
      strengthColor = '#f59e0b';
    } else if (entropy < 85 || len < 16) {
      strengthLevel = 3;
      strengthLabelPL = 'Silne';
      strengthLabelEN = 'Strong';
      strengthColor = '#10b981';
    } else {
      strengthLevel = 4;
      strengthLabelPL = 'Niezłomne (Maksimum)';
      strengthLabelEN = 'Unbreakable (Max)';
      strengthColor = '#00f0ff';
    }

    // Estimated crack time based on 100 billion guesses / second (high-end GPU farm)
    const crackTime = this.estimateCrackTime(entropy);

    // Phonetic list (first 32 characters for flashcard back)
    const phoneticList = [];
    const maxPhonetic = Math.min(len, 32);
    for (let i = 0; i < maxPhonetic; i++) {
      const ch = password[i];
      const desc = PHONETIC_MAP[ch] || ch;
      phoneticList.push({ char: ch, desc: desc });
    }

    return {
      entropy,
      poolSize,
      strengthLevel,
      strengthLabelPL,
      strengthLabelEN,
      strengthColor,
      crackTimePL: crackTime.pl,
      crackTimeEN: crackTime.en,
      upperCount,
      lowerCount,
      numCount,
      symCount,
      phoneticList,
      hasMorePhonetics: len > 32
    };
  }

  /**
   * Human readable crack time estimation
   */
  static estimateCrackTime(entropyBits) {
    if (entropyBits < 20) return { pl: 'Natychmiast (ułamki sekund)', en: 'Instantly (< 1 sec)' };
    if (entropyBits < 32) return { pl: 'Kilka sekund', en: 'A few seconds' };
    if (entropyBits < 42) return { pl: 'Kilka minut do godzin', en: 'Minutes to hours' };
    if (entropyBits < 52) return { pl: 'Kilka dni lub tygodni', en: 'Days to weeks' };
    if (entropyBits < 64) return { pl: 'Kilka miesięcy lub lat', en: 'Months to years' };
    if (entropyBits < 75) return { pl: 'Setki lat', en: 'Centuries' };
    if (entropyBits < 90) return { pl: 'Miliony lat', en: 'Millions of years' };
    if (entropyBits < 120) return { pl: 'Miliardy lat', en: 'Billions of years' };
    return { pl: 'Dłużej niż wiek wszechświata', en: 'Longer than universe age' };
  }

  /**
   * Calculate SHA-256 hash using Web Crypto API
   */
  static async getSHA256(str) {
    try {
      const msgUint8 = new TextEncoder().encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      return '';
    }
  }

  /**
   * Format password string with HTML syntax highlighting spans
   */
  static formatPasswordHTML(password) {
    let html = '';
    for (let i = 0; i < password.length; i++) {
      const ch = password[i];
      let charClass = 'char-lower';
      if (/[A-Z]/.test(ch)) charClass = 'char-upper';
      else if (/[0-9]/.test(ch)) charClass = 'char-number';
      else if (/[^a-zA-Z0-9]/.test(ch)) charClass = 'char-symbol';

      // Escape HTML entities for & < > "
      let safeCh = ch;
      if (ch === '&') safeCh = '&amp;';
      else if (ch === '<') safeCh = '&lt;';
      else if (ch === '>') safeCh = '&gt;';
      else if (ch === '"') safeCh = '&quot;';

      html += `<span class="${charClass}">${safeCh}</span>`;
    }
    return html;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PasswordGenerator };
}

