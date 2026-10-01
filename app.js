// ==========================================================================
// Generator Haseł - Core Application Controller
// Flashcard Desktop Password Generator
// ==========================================================================

const TRANSLATIONS = {
  pl: {
    appTitle: 'Generator haseł',
    badgeMode: 'FISZKA PRO',
    appTagline: 'Inteligentne generowanie bezpiecznych haseł i fiszek',
    badgeCrypto: 'KRYPTOGRAFICZNE',
    badgeDiceware: 'FRAZA / DICEWARE',
    badgePronounceable: 'WYMOWNE',
    badgePin: 'KOD PIN',
    badgeBack: 'ANALIZA & QR KOD',
    cardLengthLabel: 'Długość:',
    flipPrompt: 'Odwróć fiszkę (NATO / QR)',
    flipBackPrompt: 'Pokaż hasło (Przód)',
    phoneticTitle: 'Pisownia fonetyczna (NATO / Opis):',
    qrCaption: 'Zeskanuj telefonem',
    btnGenerate: 'GENERUJ NOWE HASŁO',
    btnCopy: 'Kopiuj',
    btnCopied: 'Skopiowano!',
    btnStar: 'Zapisz',
    lengthTitle: 'Długość hasła:',
    lengthUnit: 'znaków',
    modeTitle: 'Tryb generowania:',
    tabRandom: 'Losowe',
    tabDiceware: 'Fraza',
    tabPronounceable: 'Wymowne',
    tabPin: 'PIN',
    charsetTitle: 'Zestaw znaków:',
    chkUpper: 'Wielkie litery (A-Z)',
    chkLower: 'Małe litery (a-z)',
    chkNumbers: 'Cyfry (0-9)',
    chkSymbols: 'Znaki specjalne (!@#$)',
    chkAmbiguous: 'Wyklucz mylące (0, O, 1, l, I)',
    shortcutsHint: 'Skróty klawiszowe: <kbd>Spacja</kbd> lub <kbd>Enter</kbd> = Generuj | <kbd>F</kbd> = Odwróć fiszkę | <kbd>C</kbd> = Kopiuj',
    shelfTitle: 'Talia wygenerowanych kart',
    btnExport: 'Eksportuj talię',
    btnClear: 'Wyczyść',
    emptyShelf: 'Brak kart w talii. Naciśnij "Generuj nowe hasło", aby stworzyć pierwsze fiszki!',
    modalTitle: 'Eksport talii haseł',
    modalDesc: 'Poniżej znajduje się lista wszystkich wygenerowanych haseł z Twojej bieżącej talii:',
    modalCopy: 'Kopiuj do schowka',
    modalDownload: 'Pobierz TXT',
    toastCopied: 'Hasło skopiowane do schowka!',
    toastDeckCopied: 'Talia haseł skopiowana do schowka!',
    toastDeckCleared: 'Talia kart została wyczyszczona.',
    toastStarred: 'Fiszka zapisana w talii!',
    crackPrefix: 'Czas łamania: '
  },
  en: {
    appTitle: 'Password Generator',
    badgeMode: 'FLASHCARD PRO',
    appTagline: 'Intelligent high-security password & flashcard deck generator',
    badgeCrypto: 'CRYPTOGRAPHIC',
    badgeDiceware: 'DICEWARE PHRASE',
    badgePronounceable: 'PRONOUNCEABLE',
    badgePin: 'NUMERIC PIN',
    badgeBack: 'ANALYSIS & QR CODE',
    cardLengthLabel: 'Length:',
    flipPrompt: 'Flip Flashcard (NATO / QR)',
    flipBackPrompt: 'Show Password (Front)',
    phoneticTitle: 'Phonetic Spelling (NATO Alphabet):',
    qrCaption: 'Scan with smartphone',
    btnGenerate: 'GENERATE NEW PASSWORD',
    btnCopy: 'Copy',
    btnCopied: 'Copied!',
    btnStar: 'Star',
    lengthTitle: 'Password Length:',
    lengthUnit: 'characters',
    modeTitle: 'Generation Mode:',
    tabRandom: 'Random',
    tabDiceware: 'Phrase',
    tabPronounceable: 'Pronounceable',
    tabPin: 'PIN',
    charsetTitle: 'Character Set:',
    chkUpper: 'Uppercase letters (A-Z)',
    chkLower: 'Lowercase letters (a-z)',
    chkNumbers: 'Numbers (0-9)',
    chkSymbols: 'Special symbols (!@#$)',
    chkAmbiguous: 'Exclude ambiguous (0, O, 1, l, I)',
    shortcutsHint: 'Keyboard shortcuts: <kbd>Space</kbd> or <kbd>Enter</kbd> = Generate | <kbd>F</kbd> = Flip Card | <kbd>C</kbd> = Copy',
    shelfTitle: 'Generated Flashcard Deck',
    btnExport: 'Export Deck',
    btnClear: 'Clear Deck',
    emptyShelf: 'Deck is empty. Press "Generate New Password" to deal your first flashcards!',
    modalTitle: 'Export Flashcard Deck',
    modalDesc: 'Below is the list of all passwords generated in your current flashcard session:',
    modalCopy: 'Copy to Clipboard',
    modalDownload: 'Download TXT',
    toastCopied: 'Password copied to clipboard!',
    toastDeckCopied: 'Entire card deck copied to clipboard!',
    toastDeckCleared: 'Card deck cleared.',
    toastStarred: 'Flashcard pinned in deck!',
    crackPrefix: 'Crack time: '
  }
};

class FlashcardApp {
  constructor() {
    this.currentLanguage = localStorage.getItem('generator_hasel_lang') || 'pl';
    this.currentTheme = localStorage.getItem('generator_hasel_theme') || 'dark';
    this.cardNumberCounter = 0;
    this.deck = [];
    this.currentCard = null;
    this.isFlipped = false;

    this.options = {
      length: 16,
      mode: 'random',
      includeUpper: true,
      includeLower: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: false
    };

    this.initElements();
    this.applyTheme(this.currentTheme);
    this.applyLanguage(this.currentLanguage);
    this.attachEventListeners();
    this.generateNewCard();
  }

  initElements() {
    // Header & Toggles
    this.themeIcon = document.getElementById('theme-icon');
    this.langIcon = document.getElementById('lang-icon');
    this.soundIcon = document.getElementById('sound-icon');
    this.btnTheme = document.getElementById('btn-theme-toggle');
    this.btnLang = document.getElementById('btn-lang-toggle');
    this.btnSound = document.getElementById('btn-sound-toggle');

    // Flashcard Elements
    this.cardElement = document.getElementById('flashcard-card');
    this.frontModeLabel = document.getElementById('front-mode-label');
    this.frontCardNumber = document.getElementById('front-card-number');
    this.backCardNumber = document.getElementById('back-card-number');
    this.frontStrengthPill = document.getElementById('front-strength-pill');
    this.frontStrengthText = document.getElementById('front-strength-text');
    this.passwordDisplayBox = document.getElementById('password-display-box');
    this.passwordRendered = document.getElementById('password-rendered');
    this.btnCopyCard = document.getElementById('btn-copy-card');
    this.btnStarCard = document.getElementById('btn-star-card');
    this.txtEntropyVal = document.getElementById('txt-entropy-val');
    this.txtCrackTime = document.getElementById('txt-crack-time');
    this.txtFrontLength = document.getElementById('txt-front-length');
    this.btnFlipToBack = document.getElementById('btn-flip-to-back');
    this.btnFlipToFront = document.getElementById('btn-flip-to-front');
    this.phoneticListWrap = document.getElementById('phonetic-list-wrap');
    this.qrCodeSvgBox = document.getElementById('qr-code-svg-box');
    this.sha256HashBox = document.getElementById('sha256-hash-box');
    this.btnCopyPhonetic = document.getElementById('btn-copy-phonetic');

    // Controls
    this.sliderLength = document.getElementById('input-length-slider');
    this.numberLength = document.getElementById('input-length-number');
    this.presetPills = document.querySelectorAll('.preset-pill');
    this.modeTabs = document.querySelectorAll('.mode-tab');
    this.charOptionsSection = document.getElementById('char-options-section');
    this.chkUpper = document.getElementById('chk-upper');
    this.chkLower = document.getElementById('chk-lower');
    this.chkNumbers = document.getElementById('chk-numbers');
    this.chkSymbols = document.getElementById('chk-symbols');
    this.chkAmbiguous = document.getElementById('chk-ambiguous');
    this.btnGenerate = document.getElementById('btn-generate-action');

    // Deck Shelf
    this.miniCardsContainer = document.getElementById('mini-cards-container');
    this.deckCounterBadge = document.getElementById('deck-counter-badge');
    this.btnExportDeck = document.getElementById('btn-export-deck');
    this.btnClearDeck = document.getElementById('btn-clear-deck');

    // Modal
    this.exportModal = document.getElementById('export-modal');
    this.modalExportContent = document.getElementById('modal-export-content');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.btnCopyExport = document.getElementById('btn-copy-export');
    this.btnDownloadExport = document.getElementById('btn-download-export');

    // Toast
    this.toast = document.getElementById('app-toast');
    this.toastText = document.getElementById('toast-text');
  }

  attachEventListeners() {
    // Theme toggle
    this.btnTheme.addEventListener('click', () => {
      const themes = ['dark', 'light', 'matrix'];
      const nextIdx = (themes.indexOf(this.currentTheme) + 1) % themes.length;
      this.applyTheme(themes[nextIdx]);
    });

    // Language toggle
    this.btnLang.addEventListener('click', () => {
      this.applyLanguage(this.currentLanguage === 'pl' ? 'en' : 'pl');
    });

    // Sound toggle
    this.btnSound.addEventListener('click', () => {
      const muted = soundManager.toggleMute();
      this.soundIcon.textContent = muted ? '🔇' : '🔊';
      this.showToast(muted ? (this.currentLanguage === 'pl' ? 'Dźwięki wyciszone' : 'Audio muted') : (this.currentLanguage === 'pl' ? 'Dźwięki włączone' : 'Audio enabled'));
    });

    // Card Flip Actions
    this.btnFlipToBack.addEventListener('click', (e) => {
      e.stopPropagation();
      this.flipCard(true);
    });
    this.btnFlipToFront.addEventListener('click', (e) => {
      e.stopPropagation();
      this.flipCard(false);
    });

    // Copy from Card Box
    this.passwordDisplayBox.addEventListener('click', (e) => {
      if (e.target.closest('#btn-star-card') || e.target.closest('#btn-copy-card')) return;
      this.copyCurrentPassword();
    });
    this.btnCopyCard.addEventListener('click', (e) => {
      e.stopPropagation();
      this.copyCurrentPassword();
    });

    // Star Card
    this.btnStarCard.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleStarCurrentCard();
    });

    // Copy Phonetic
    this.btnCopyPhonetic.addEventListener('click', () => {
      this.copyPhoneticBreakdown();
    });

    // Slider & Number Length Input
    this.sliderLength.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      this.options.length = val;
      this.numberLength.value = val;
      this.updateActivePresetPill(val);
      this.generateNewCard();
    });

    this.numberLength.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      this.options.length = val;
      if (val <= 64) {
        this.sliderLength.value = val;
      }
      this.updateActivePresetPill(val);
      this.generateNewCard();
    });

    // Preset Pills
    this.presetPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const val = parseInt(pill.getAttribute('data-len'), 10);
        this.options.length = val;
        this.numberLength.value = val;
        if (val <= 64) this.sliderLength.value = val;
        this.updateActivePresetPill(val);
        this.generateNewCard();
      });
    });

    // Mode Tabs
    this.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.modeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.options.mode = tab.getAttribute('data-mode');
        
        // Hide/show character set options when mode is PIN or Diceware
        if (this.options.mode === 'pin') {
          this.charOptionsSection.style.opacity = '0.4';
          this.charOptionsSection.style.pointerEvents = 'none';
        } else {
          this.charOptionsSection.style.opacity = '1';
          this.charOptionsSection.style.pointerEvents = 'auto';
        }

        this.generateNewCard();
      });
    });

    // Checkboxes
    const updateOptionsFromCheckboxes = () => {
      this.options.includeUpper = this.chkUpper.checked;
      this.options.includeLower = this.chkLower.checked;
      this.options.includeNumbers = this.chkNumbers.checked;
      this.options.includeSymbols = this.chkSymbols.checked;
      this.options.excludeAmbiguous = this.chkAmbiguous.checked;
      this.generateNewCard();
    };

    [this.chkUpper, this.chkLower, this.chkNumbers, this.chkSymbols, this.chkAmbiguous].forEach(chk => {
      chk.addEventListener('change', updateOptionsFromCheckboxes);
    });

    // Main Generate Button
    this.btnGenerate.addEventListener('click', () => {
      this.generateNewCard();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      // Ignore if user is currently typing in the number input
      if (document.activeElement === this.numberLength) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        this.generateNewCard();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        this.flipCard(!this.isFlipped);
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        this.copyCurrentPassword();
      }
    });

    // Deck Shelf Actions
    this.btnExportDeck.addEventListener('click', () => this.openExportModal());
    this.btnClearDeck.addEventListener('click', () => this.clearDeck());

    // Modal Events
    this.btnCloseModal.addEventListener('click', () => this.closeExportModal());
    this.exportModal.addEventListener('click', (e) => {
      if (e.target === this.exportModal) this.closeExportModal();
    });
    this.btnCopyExport.addEventListener('click', () => this.copyExportContent());
    this.btnDownloadExport.addEventListener('click', () => this.downloadExportFile());
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('generator_hasel_theme', theme);

    if (theme === 'dark') this.themeIcon.textContent = '🌙';
    else if (theme === 'light') this.themeIcon.textContent = '☀️';
    else if (theme === 'matrix') this.themeIcon.textContent = '📟';
  }

  applyLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('generator_hasel_lang', lang);
    const t = TRANSLATIONS[lang];

    this.langIcon.textContent = lang.toUpperCase();
    document.getElementById('txt-app-title').textContent = t.appTitle;
    document.getElementById('txt-badge-mode').textContent = t.badgeMode;
    document.getElementById('txt-app-tagline').textContent = t.appTagline;
    document.getElementById('txt-flip-prompt').textContent = t.flipPrompt;
    document.getElementById('txt-flip-back-prompt').textContent = t.flipBackPrompt;
    document.getElementById('txt-back-badge').textContent = t.badgeBack;
    document.getElementById('txt-phonetic-title').textContent = t.phoneticTitle;
    document.getElementById('txt-qr-caption').textContent = t.qrCaption;
    document.getElementById('txt-length-title').textContent = t.lengthTitle;
    document.getElementById('txt-length-unit').textContent = t.lengthUnit;
    document.getElementById('txt-mode-title').textContent = t.modeTitle;
    document.getElementById('txt-tab-random').textContent = t.tabRandom;
    document.getElementById('txt-tab-diceware').textContent = t.tabDiceware;
    document.getElementById('txt-tab-pronounceable').textContent = t.tabPronounceable;
    document.getElementById('txt-tab-pin').textContent = t.tabPin;
    document.getElementById('txt-charset-title').textContent = t.charsetTitle;
    document.getElementById('txt-chk-upper').textContent = t.chkUpper;
    document.getElementById('txt-chk-lower').textContent = t.chkLower;
    document.getElementById('txt-chk-numbers').textContent = t.chkNumbers;
    document.getElementById('txt-chk-symbols').textContent = t.chkSymbols;
    document.getElementById('txt-chk-ambiguous').textContent = t.chkAmbiguous;
    document.getElementById('txt-btn-generate').textContent = t.btnGenerate;
    document.getElementById('txt-shortcuts-hint').innerHTML = t.shortcutsHint;
    document.getElementById('txt-shelf-title').textContent = t.shelfTitle;
    document.getElementById('txt-btn-export').textContent = t.btnExport;
    document.getElementById('txt-btn-clear').textContent = t.btnClear;
    document.getElementById('txt-modal-title').textContent = t.modalTitle;
    document.getElementById('txt-modal-desc').textContent = t.modalDesc;
    document.getElementById('txt-modal-copy').textContent = t.modalCopy;
    document.getElementById('txt-modal-download').textContent = t.modalDownload;

    // Refresh current card labels if loaded
    if (this.currentCard) {
      this.renderCardDetails(this.currentCard);
    }
  }

  flipCard(toFlipped) {
    this.isFlipped = toFlipped;
    if (this.isFlipped) {
      this.cardElement.classList.add('flipped');
    } else {
      this.cardElement.classList.remove('flipped');
    }
    soundManager.playFlip();
  }

  updateActivePresetPill(len) {
    this.presetPills.forEach(pill => {
      const pillVal = parseInt(pill.getAttribute('data-len'), 10);
      if (pillVal === len) pill.classList.add('active');
      else pill.classList.remove('active');
    });
  }

  generateNewCard() {
    this.cardNumberCounter++;
    const cardData = PasswordGenerator.generate(this.options);
    cardData.cardNumber = this.cardNumberCounter;
    cardData.isStarred = false;

    this.currentCard = cardData;

    // If card was flipped, bring it back to front on new generation
    if (this.isFlipped) {
      this.flipCard(false);
    }

    // Play deal sound
    soundManager.playCardDeal();

    // Render on screen
    this.renderCardDetails(cardData);

    // Add to deck history
    this.addToDeck(cardData);

    // Play celebration if unbreakable
    if (cardData.metrics.strengthLevel === 4) {
      soundManager.playStrongCelebration();
    }
  }

  async renderCardDetails(card) {
    const t = TRANSLATIONS[this.currentLanguage];
    const { password, length, mode, metrics, cardNumber, isStarred } = card;

    // Update Card Number
    const cardNumStr = (this.currentLanguage === 'pl' ? 'Karta #' : 'Card #') + String(cardNumber).padStart(2, '0');
    this.frontCardNumber.textContent = cardNumStr;
    this.backCardNumber.textContent = cardNumStr;

    // Update Mode Label
    let modeText = t.badgeCrypto;
    if (mode === 'diceware') modeText = t.badgeDiceware;
    else if (mode === 'pronounceable') modeText = t.badgePronounceable;
    else if (mode === 'pin') modeText = t.badgePin;
    this.frontModeLabel.textContent = modeText;

    // Render Password with syntax highlighting
    this.passwordRendered.innerHTML = PasswordGenerator.formatPasswordHTML(password);

    // Dynamic Font Size adjustment
    this.passwordRendered.classList.remove('len-long', 'len-very-long');
    if (length > 40) {
      this.passwordRendered.classList.add('len-very-long');
    } else if (length > 20) {
      this.passwordRendered.classList.add('len-long');
    }

    // Length tag
    this.txtFrontLength.textContent = `${t.cardLengthLabel} ${length} ${t.lengthUnit}`;

    // Star icon state
    if (isStarred) {
      this.btnStarCard.classList.add('starred');
      this.btnStarCard.textContent = '★';
    } else {
      this.btnStarCard.classList.remove('starred');
      this.btnStarCard.textContent = '☆';
    }

    // Strength pill
    const strengthLabel = this.currentLanguage === 'pl' ? metrics.strengthLabelPL : metrics.strengthLabelEN;
    this.frontStrengthText.textContent = strengthLabel;
    this.frontStrengthPill.style.borderColor = metrics.strengthColor;
    this.frontStrengthPill.style.color = metrics.strengthColor;
    this.frontStrengthPill.style.boxShadow = `0 0 12px ${metrics.strengthColor}40`;

    // 5-segment strength meter
    for (let i = 1; i <= 5; i++) {
      const seg = document.getElementById(`seg-${i}`);
      if (i <= metrics.strengthLevel + 1) {
        seg.style.backgroundColor = metrics.strengthColor;
        seg.style.boxShadow = `0 0 8px ${metrics.strengthColor}`;
      } else {
        seg.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
        seg.style.boxShadow = 'none';
      }
    }

    // Entropy & Crack Time
    this.txtEntropyVal.textContent = `${metrics.entropy} bitów entropii`;
    const crackTimeStr = this.currentLanguage === 'pl' ? metrics.crackTimePL : metrics.crackTimeEN;
    this.txtCrackTime.textContent = t.crackPrefix + crackTimeStr;

    // Render Back: Phonetics
    this.renderPhonetics(metrics.phoneticList, metrics.hasMorePhonetics);

    // Render Back: Offline QR Code SVG
    const qrSvg = QRCode.generateSVG(password, 140, '#00f0ff', 'transparent');
    this.qrCodeSvgBox.innerHTML = qrSvg;

    // Render Back: SHA-256 Hash
    this.sha256HashBox.textContent = 'SHA-256: Obliczanie...';
    const hash = await PasswordGenerator.getSHA256(password);
    this.sha256HashBox.textContent = `SHA-256: ${hash}`;
  }

  renderPhonetics(phonetics, hasMore) {
    this.phoneticListWrap.innerHTML = '';
    phonetics.forEach(item => {
      const pill = document.createElement('div');
      pill.className = 'phonetic-pill';
      pill.innerHTML = `<b>${item.char}</b> <span>${item.desc}</span>`;
      this.phoneticListWrap.appendChild(pill);
    });

    if (hasMore) {
      const more = document.createElement('div');
      more.className = 'phonetic-pill';
      more.innerHTML = `<i>... + kolejne znaki</i>`;
      this.phoneticListWrap.appendChild(more);
    }
  }

  async copyCurrentPassword() {
    if (!this.currentCard) return;
    try {
      await navigator.clipboard.writeText(this.currentCard.password);
      soundManager.playCopy();
      const t = TRANSLATIONS[this.currentLanguage];
      this.showToast(t.toastCopied);

      // Temporary button text feedback
      this.btnCopyCard.textContent = '✓';
      setTimeout(() => {
        this.btnCopyCard.textContent = '📋';
      }, 1200);
    } catch (e) {
      // Fallback
      const input = document.createElement('input');
      input.value = this.currentCard.password;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      soundManager.playCopy();
      this.showToast(TRANSLATIONS[this.currentLanguage].toastCopied);
    }
  }

  async copyPhoneticBreakdown() {
    if (!this.currentCard) return;
    const text = this.currentCard.metrics.phoneticList
      .map(p => `${p.char} = ${p.desc}`)
      .join('\n');
    try {
      await navigator.clipboard.writeText(text);
      soundManager.playCopy();
      this.showToast(this.currentLanguage === 'pl' ? 'Pisownia fonetyczna skopiowana!' : 'Phonetics copied!');
    } catch (e) {}
  }

  toggleStarCurrentCard() {
    if (!this.currentCard) return;
    this.currentCard.isStarred = !this.currentCard.isStarred;
    if (this.currentCard.isStarred) {
      this.btnStarCard.classList.add('starred');
      this.btnStarCard.textContent = '★';
      this.showToast(TRANSLATIONS[this.currentLanguage].toastStarred);
    } else {
      this.btnStarCard.classList.remove('starred');
      this.btnStarCard.textContent = '☆';
    }
    this.updateDeckShelfUI();
  }

  addToDeck(card) {
    this.deck.unshift(card);
    if (this.deck.length > 50) {
      this.deck.pop(); // keep last 50 cards
    }
    this.updateDeckShelfUI();
  }

  updateDeckShelfUI() {
    const t = TRANSLATIONS[this.currentLanguage];
    this.deckCounterBadge.textContent = `${this.deck.length} ${this.deck.length === 1 ? 'karta' : (this.deck.length < 5 ? 'karty' : 'kart')}`;

    if (this.deck.length === 0) {
      this.miniCardsContainer.innerHTML = `
        <div class="empty-deck-notice" id="empty-deck-msg">
          ${t.emptyShelf}
        </div>
      `;
      return;
    }

    this.miniCardsContainer.innerHTML = '';
    this.deck.forEach((card, idx) => {
      const mini = document.createElement('div');
      mini.className = 'mini-card' + (card === this.currentCard ? ' active' : '');

      let modeTag = card.mode.toUpperCase();
      if (card.mode === 'diceware') modeTag = 'FRAZA';
      else if (card.mode === 'pronounceable') modeTag = 'WYMOWNE';

      mini.innerHTML = `
        <div class="mini-card-top">
          <span class="mini-card-mode">${modeTag} #${String(card.cardNumber).padStart(2, '0')}</span>
          <span class="mini-card-len">${card.length} zn.</span>
        </div>
        <div class="mini-card-password">${card.password}</div>
        <div class="mini-card-footer">
          <span style="font-size: 11px; color: ${card.metrics.strengthColor}; font-weight: 600;">
            ${this.currentLanguage === 'pl' ? card.metrics.strengthLabelPL : card.metrics.strengthLabelEN}
          </span>
          <span style="font-size: 14px;">${card.isStarred ? '★' : ''}</span>
        </div>
      `;

      mini.addEventListener('click', () => {
        this.currentCard = card;
        this.renderCardDetails(card);
        this.updateDeckShelfUI();
        soundManager.playCardDeal();
      });

      this.miniCardsContainer.appendChild(mini);
    });
  }

  clearDeck() {
    this.deck = [];
    if (this.currentCard) {
      this.deck.push(this.currentCard);
    }
    this.updateDeckShelfUI();
    this.showToast(TRANSLATIONS[this.currentLanguage].toastDeckCleared);
  }

  openExportModal() {
    if (this.deck.length === 0) {
      this.showToast(this.currentLanguage === 'pl' ? 'Talia jest pusta!' : 'Deck is empty!');
      return;
    }

    let exportText = `=================================================\n` +
      `Generator Haseł - Zestawienie kart (${new Date().toLocaleString()})\n` +
      `Łącznie kart w talii: ${this.deck.length}\n` +
      `=================================================\n\n`;

    this.deck.forEach((c, i) => {
      exportText += `[#${String(c.cardNumber).padStart(2, '0')}] ${c.mode.toUpperCase()} (${c.length} znaków, Entropia: ${c.metrics.entropy} bitów)\n` +
        `Hasło: ${c.password}\n` +
        `Ocena: ${c.metrics.strengthLabelPL} | Czas łamania: ${c.metrics.crackTimePL}\n` +
        `-------------------------------------------------\n`;
    });

    this.modalExportContent.value = exportText;
    this.exportModal.classList.add('open');
  }

  closeExportModal() {
    this.exportModal.classList.remove('open');
  }

  async copyExportContent() {
    try {
      await navigator.clipboard.writeText(this.modalExportContent.value);
      soundManager.playCopy();
      this.showToast(TRANSLATIONS[this.currentLanguage].toastDeckCopied);
    } catch (e) {}
  }

  downloadExportFile() {
    const text = this.modalExportContent.value;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generator-hasel-talia-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    this.showToast(this.currentLanguage === 'pl' ? 'Plik TXT pobrany!' : 'TXT file downloaded!');
  }

  showToast(message) {
    this.toastText.textContent = message;
    this.toast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
    }, 2400);
  }
}

// Instantiate App when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new FlashcardApp();
});
