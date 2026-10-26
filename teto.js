/*
 * It's Fiction. — Teto Easter Egg Playground
 * Put the ten PNG files in ./assets/teto/ (see README.md).
 * Integrated into Packpm's existing It's fiction card.
 */
(() => {
  'use strict';

  const ASSET_BASE = './assets/teto/';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = (ms) => new Promise(resolve => window.setTimeout(resolve, ms));
  const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const IMAGES = {
    sleep: 'teto-sleep.png',
    annoyed: 'teto-annoyed.png',
    waking: 'teto-waking.png',
    talking: 'teto-talking.png',
    neutral: 'teto-neutral.png',
    angry: 'teto-angry.png',
    confused: 'teto-confused.png',
    shocked: 'teto-shocked.png',
    shy: 'teto-shy.png',
    smug: 'teto-smug.png'
  };

  // Warm the browser cache so quick frame changes are less likely to flash blank.
  Object.values(IMAGES).forEach(filename => {
    const preload = new Image();
    preload.src = new URL(`${ASSET_BASE}${filename}`, document.baseURI).href;
  });

  // 76 unique lines. Special expressions stay completely still through the line
  // and remain frozen until the dialogue has faded away.
  const DIALOGUES = [
    { text: "I'm a chimera, not a baguette. Please update your Teto facts accordingly.", expression: 'smug', category: 'teto' },
    { text: "My voice has multiple versions, including UTAU and Synthesizer V. I'm versatile like that.", expression: null, category: 'teto' },
    { text: "The drills are hair, not a construction permit. Don't ask me to build anything.", expression: 'annoyed', category: 'teto' },
    { text: "Yes, the twintails are supposed to look like drills. Fashion is serious business.", expression: 'smug', category: 'teto' },
    { text: "I have a birthday. I have a voice. I have a suspicious amount of internet lore.", expression: null, category: 'teto' },
    { text: "People keep calling me a baguette. I am begging the internet to learn one new joke.", expression: 'angry', category: 'teto' },
    { text: "I'm a virtual singer. Which means I can hit a note and still be blamed for your browser lag.", expression: null, category: 'teto' },
    { text: "My character design has more moving parts than this entire portfolio card.", expression: 'smug', category: 'teto' },
    { text: "I contain multitudes. Several of them are annoyed with you right now.", expression: 'annoyed', category: 'teto' },
    { text: "The pink hair is iconic. The attitude is an unfortunate side effect.", expression: 'smug', category: 'teto' },

    { text: "Have 99 lives and waste all of them? Ha. Playing it cool and slacking off drain your life. So what?", expression: null, category: 'mv' },
    { text: "I solo every player in battle and win in the end. GG. Did you see the 'God-tier evade' message?", expression: 'smug', category: 'mv' },
    { text: "Saving, loading, leveling. That's life, y'know, y'know?", expression: null, category: 'mv' },
    { text: "Right. That's right... this world is fiction. Turn the power on and GO!!", expression: null, category: 'mv' },
    { text: "This MV has the energy of someone mashing every button and somehow winning.", expression: 'smug', category: 'mv' },
    { text: "The editing said 'normal pacing' and the animation said 'absolutely not.' Respect.", expression: null, category: 'mv' },
    { text: "That shot goes hard. I am contractually obligated to pretend I wasn't impressed.", expression: 'shy', category: 'mv' },
    { text: "You can watch the MV instead of repeatedly poking me. Revolutionary, I know.", expression: 'annoyed', category: 'mv' },
    { text: "The song is playing in your head now, isn't it? That's my work here done.", expression: 'smug', category: 'mv' },
    { text: "A little chaos, a little existential crisis, and a suspiciously catchy tune. Classic.", expression: null, category: 'mv' },

    { text: "Konro animated the whole MV solo. THE WHOLE THING. Please appreciate that human being.", expression: 'shocked', category: 'konro' },
    { text: "Konro did all that animation alone. My drill twintails are spinning in respect.", expression: 'smug', category: 'konro' },
    { text: "Solo animation is a mountain of work. Konro, please drink water and rest your wrists.", expression: null, category: 'konro' },
    { text: "I would give Konro an award, but I'm trapped in a website and have no hands free.", expression: 'confused', category: 'konro' },
    { text: "Every frame took work. Every frame. Yes, even the one where I'm being embarrassing.", expression: null, category: 'konro' },
    { text: "Konro carried the animation. I carried the extremely important job of looking iconic.", expression: 'smug', category: 'konro' },
    { text: "If you liked the motion and timing, go appreciate the animator. I'll allow it.", expression: 'neutral', category: 'konro' },
    { text: "One animator. One whole MV. That deserves more than a quick scroll-past.", expression: null, category: 'konro' },

    { text: "The Teto pear is a pear with my face on it. This is important scholarship.", expression: 'neutral', category: 'pear' },
    { text: "The pear is not a new character. It is produce with excellent branding.", expression: 'smug', category: 'pear' },
    { text: "I swear, if Packpm puts that pear on this website, I'm quitting.", expression: 'angry', category: 'pear' },
    { text: "Why is there a pear with my face on it? Who approved this fruit-based identity theft?", expression: 'shocked', category: 'pear' },
    { text: "That pear has zero dialogue lines and somehow still has a stronger publicist than me.", expression: 'annoyed', category: 'pear' },
    { text: "Is the Teto pear edible? Don't answer that. I don't want to know.", expression: 'confused', category: 'pear' },
    { text: "A pear, my face, and absolutely no explanation. Art has peaked.", expression: 'smug', category: 'pear' },
    { text: "If I see that pear again, I'm filing a complaint with the produce department.", expression: 'angry', category: 'pear' },

    { text: "Packpm spent all that time making this website and I'm the one doing customer service. Incredible.", expression: 'annoyed', category: 'packpm' },
    { text: "Do you know? Packpm is a big fan of me. That's so twisted.", expression: 'confused', category: 'packpm' },
    { text: "Ugh, why did he have to make this website and trap me inside it?", expression: 'angry', category: 'packpm' },
    { text: "Do you know? These dialogues were written by Packpm. Yeah, even this one. What's wrong with him?", expression: 'shocked', category: 'packpm' },
    { text: "Packpm is an otaku, by the way. You didn't hear that from me. Actually, you did.", expression: 'smug', category: 'packpm' },
    { text: "I have 70-plus unique lines. Packpm wrote all of them. Yeah, he's crazy.", expression: 'shocked', category: 'packpm' },
    { text: "Packpm made a whole interactive thing just so I could complain at strangers. That tracks.", expression: 'annoyed', category: 'packpm' },
    { text: "This is Packpm's portfolio. I'm just the unpaid spokesperson with excellent hair.", expression: 'smug', category: 'packpm' },
    { text: "I asked for a dressing room. He gave me a div and a click listener.", expression: 'confused', category: 'packpm' },
    { text: "Packpm said 'it'll be a tiny easter egg.' Then he wrote a whole dialogue system.", expression: 'shocked', category: 'packpm' },
    { text: "I can see the code, Packpm. Naming a variable 'tetoThingy' would be a cry for help.", expression: 'annoyed', category: 'packpm' },
    { text: "He gave me ten expressions, and I'm still not getting paid for any of them.", expression: 'angry', category: 'packpm' },
    { text: "Packpm is probably watching this interaction test and grinning at the screen. Get a hobby.", expression: 'smug', category: 'packpm' },
    { text: "I'm not saying Packpm overthinks things. I'm saying this speech bubble has a project plan.", expression: 'confused', category: 'packpm' },
    { text: "He wanted 70 lines because he wants people to see the effort. Fine. I'm making every line count.", expression: 'smug', category: 'packpm' },
    { text: "If this website breaks, Packpm is going to stare at the console like it personally betrayed him.", expression: 'shocked', category: 'packpm' },
    { text: "Packpm put my face in a portfolio card. Now I'm part of his professional identity. Awkward.", expression: 'shy', category: 'packpm' },
    { text: "You know he could've made a normal portfolio, right? Apparently, that wasn't enough.", expression: 'annoyed', category: 'packpm' },
    { text: "I'm not the portfolio owner. I'm the portfolio's emotional support chimera.", expression: 'smug', category: 'packpm' },

    { text: "Chenomio can be all professional and serious, then suddenly be super considerate. Sneaky wholesome.", expression: null, category: 'chenomio' },
    { text: "When Packpm is busy, Chenomio reminds them to take care of themselves. That's actually sweet.", expression: 'shy', category: 'chenomio' },
    { text: "Serious work, kind heart. Chenomio has range, and I'm not just saying that for the credits.", expression: 'smug', category: 'chenomio' },
    { text: "A project takes people caring about it. Remember the humans behind the screen, okay?", expression: null, category: 'chenomio' },
    { text: "I'm allowed one sincere moment: I hope everyone making this project gets enough rest.", expression: 'shy', category: 'chenomio' },
    { text: "The internet sees the finished thing. The people who made it remember the long nights.", expression: null, category: 'chenomio' },

    { text: "Okay, enough staring at me. Go look at the other projects. I know there's more stuff here.", expression: 'annoyed', category: 'portfolio' },
    { text: "The MV button is right there. You can click it, you know. I'm not going to watch it for you.", expression: 'confused', category: 'portfolio' },
    { text: "You came for Teto and stayed for the portfolio. That's the correct answer. Probably.", expression: 'smug', category: 'portfolio' },
    { text: "Hey, the other projects deserve attention too. I can't be the entire website. ...Can I?", expression: 'shy', category: 'portfolio' },
    { text: "This card is one project, not the whole portfolio. Go explore before I start charging rent.", expression: 'annoyed', category: 'portfolio' },
    { text: "There are other things to click around here. I promise I'm not jealous. Much.", expression: 'smug', category: 'portfolio' },
    { text: "Go check out the rest of Packpm's work. Then come back and tell me which one is weirdest.", expression: null, category: 'portfolio' },
    { text: "The WATCH MV button is not decorative. Unlike my attitude, it has a practical purpose.", expression: 'confused', category: 'portfolio' },
    { text: "You're allowed to leave this card. I'm fictional, not clingy. ...Mostly.", expression: 'shy', category: 'portfolio' },
    { text: "A portfolio is supposed to show someone's work. I am technically work. This is getting confusing.", expression: 'confused', category: 'portfolio' },
    { text: "Scroll around, human. There might be another cool thing hiding somewhere on this site.", expression: 'smug', category: 'portfolio' },
    { text: "Thank you for checking out the project. Don't tell Packpm I was polite about it.", expression: 'shy', category: 'sweet' },
    { text: "Hey. For real, thanks for spending a little time here. I appreciate it, okay?", expression: 'shy', category: 'sweet' },
    { text: "You stuck around to see what I'd say next? ...That's actually kind of nice.", expression: 'shy', category: 'sweet' },
    { text: "No joke for this one. I hope something you make someday gets this much love, too.", expression: null, category: 'sweet' }
  ];

  const el = {
    button: document.getElementById('tetoButton'),
    widget: document.getElementById('tetoWidget'),
    hint: document.getElementById('hint'),
    tapCounter: document.getElementById('tapCounter'),
    dialogue: document.getElementById('dialogue'),
    dialogueText: document.getElementById('dialogueText'),
    missingLabel: document.getElementById('missingLabel'),
    lineCount: document.getElementById('lineCount'),
    layers: [document.querySelector('#faceLayerA img'), document.querySelector('#faceLayerB img')],
    layerWrappers: [document.getElementById('faceLayerA'), document.getElementById('faceLayerB')]
  };

  let activeLayer = 0;
  let currentFace = '';
  let busy = false;
  let introWaiting = false;
  let firstEncounterComplete = false;
  let secondEncounterDone = false;
  let firstClickTimer = null;
  let tapCount = 0;
  let bubbleTimer = null;
  let frozenExpression = false;
  let isDialogueTyping = false;
  let skipCurrentDialogue = false;
  let lineBag = [];
  let lastCategory = '';
  const warningThreshold = randomInt(20, 40);
  let firstWarningShown = false;
  let post40ReactionShown = false;

  el.lineCount.textContent = `${DIALOGUES.length} LINES`;

  function fallbackSvg(filename) {
    const safe = filename.replace(/[&<>"']/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700"><rect width="600" height="700" fill="#e5e2e5"/><path d="M70 80h460M70 620h460" stroke="#ff2676" stroke-width="4"/><text x="300" y="300" text-anchor="middle" font-family="monospace" font-size="25" fill="#211a2b">MISSING ASSET</text><text x="300" y="345" text-anchor="middle" font-family="monospace" font-size="18" fill="#211a2b">${safe}</text><text x="300" y="400" text-anchor="middle" font-family="monospace" font-size="16" fill="#5f586b">Add this PNG to assets/teto/</text></svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  function setFace(name, duration = 0) {
    const filename = IMAGES[name] || IMAGES.neutral;
    currentFace = name;
    const next = activeLayer === 0 ? 1 : 0;
    const img = el.layers[next];
    img.alt = `Kasane Teto — ${name}`;
    img.dataset.asset = filename;
    // Switch layers synchronously so fast mouth-frame changes cannot race stale onload events.
    img.dataset.fallbackAttempted = 'false';
    img.onerror = () => {
      const failedFilename = img.dataset.asset || filename;
      if (failedFilename !== IMAGES.neutral && img.dataset.fallbackAttempted !== 'true') {
        img.dataset.fallbackAttempted = 'true';
        img.onerror = () => {
          img.onerror = null;
          img.src = fallbackSvg(failedFilename);
          el.button.classList.add('show-missing');
        };
        img.src = new URL(`${ASSET_BASE}${IMAGES.neutral}`, document.baseURI).href;
        return;
      }
      img.onerror = null;
      img.src = fallbackSvg(failedFilename);
      el.button.classList.add('show-missing');
    };
    // document.baseURI makes this work on a GitHub Pages project subpath as well.
    img.src = new URL(`${ASSET_BASE}${filename}`, document.baseURI).href;
    el.layerWrappers[next].style.transitionDuration = `${duration === 0 ? 0 : (reducedMotion ? 1 : duration)}ms`;
    el.layerWrappers[activeLayer].style.transitionDuration = `${duration === 0 ? 0 : (reducedMotion ? 1 : duration)}ms`;
    el.layerWrappers[activeLayer].classList.remove('active');
    el.layerWrappers[next].classList.add('active');
    activeLayer = next;
    el.missingLabel.style.display = '';
  }

  function setTapCount() {
    el.tapCounter.textContent = `TAPS: ${String(tapCount).padStart(3, '0')}`;
  }

  function showHint(show) {
    el.hint.classList.toggle('is-hidden', !show);
    el.hint.setAttribute('aria-hidden', String(!show));
  }

  const BUBBLE_FADE_MS = 450;
  const FACE_RETURN_MS = 420;
  let bubbleFading = false;

  function hideBubbleNow() {
    if (bubbleTimer) window.clearTimeout(bubbleTimer);
    bubbleTimer = null;
    bubbleFading = false;
    el.dialogue.hidden = true;
    el.dialogue.classList.remove('is-fading');
    el.dialogueText.textContent = '';
  }

  // A line stays readable for 30 seconds after speech. When dismissed or timed
  // out, fade the bubble first; only then ease the face back to frame 05 (neutral).
  async function fadeBubble({ restoreFrozenExpression = true } = {}) {
    if (bubbleFading || el.dialogue.hidden) return;
    if (bubbleTimer) window.clearTimeout(bubbleTimer);
    bubbleTimer = null;
    bubbleFading = true;
    el.dialogue.classList.add('is-fading');

    await sleep(BUBBLE_FADE_MS + 25);
    const shouldReturnToNeutral = restoreFrozenExpression && (frozenExpression || currentFace !== 'neutral');
    frozenExpression = false;
    if (shouldReturnToNeutral) {
      // Only this return-to-idle transition crossfades. Talking frames themselves
      // are direct PNG swaps so the mouth never ghosts/doubles.
      setFace('neutral', FACE_RETURN_MS);
      await sleep(FACE_RETURN_MS + 25);
    }

    el.dialogue.hidden = true;
    el.dialogue.classList.remove('is-fading');
    el.dialogueText.textContent = '';
    bubbleFading = false;
  }

  function armBubbleTimeout() {
    if (bubbleTimer) window.clearTimeout(bubbleTimer);
    bubbleTimer = window.setTimeout(() => {
      void fadeBubble({ restoreFrozenExpression: true });
    }, 30000);
  }

  function dismissBubble() {
    if (bubbleTimer) window.clearTimeout(bubbleTimer);
    bubbleTimer = null;
    void fadeBubble({ restoreFrozenExpression: true });
  }

  async function fadeOpeningBubble() {
    // The intro lines are one-shot: the character finishes her frame sequence
    // first, then the text fades away instead of lingering for the 30s dialogue timer.
    await fadeBubble({ restoreFrozenExpression: false });
  }

  async function showFixedBubble(text, milliseconds) {
    frozenExpression = false;
    bubbleFading = false;
    el.dialogue.hidden = false;
    el.dialogue.classList.remove('is-fading');
    el.dialogueText.textContent = text;
    await sleep(milliseconds);
  }

  // Ordinary speech swaps directly between frame 04 (mouth open) and frame 05
  // (mouth closed). Randomized holds make the mouth movement feel less mechanical.
  // Clicking while the text is typing fast-forwards the line; a later click dismisses it.
  async function typeDialogue(text) {
    bubbleFading = false;
    el.dialogue.hidden = false;
    el.dialogue.classList.remove('is-fading');
    el.dialogueText.textContent = '';
    frozenExpression = false;
    skipCurrentDialogue = false;
    isDialogueTyping = true;
    let face = 'neutral';
    setFace('neutral', 0);
    for (let i = 0; i < text.length; i++) {
      if (skipCurrentDialogue) break;
      const character = text[i];
      el.dialogueText.textContent += character;
      if (character === ',' || character === ';' || character === ':') {
        face = 'neutral';
        setFace('neutral', 0);
        await sleep(randomInt(190, 260));
      } else if (character === '.' || character === '!' || character === '?' || character === '…') {
        face = 'neutral';
        setFace('neutral', 0);
        await sleep(randomInt(260, 340));
      } else {
        face = face === 'talking' ? 'neutral' : 'talking';
        setFace(face, 0);
        await sleep(randomInt(48, 82));
      }
    }
    if (skipCurrentDialogue) el.dialogueText.textContent = text;
    isDialogueTyping = false;
    skipCurrentDialogue = false;
    // Keep the completed line visibly in the talking pose. Dismissal/timeout
    // fades the bubble, then eases to frame 05 rather than crossfading mouth frames.
    setFace('talking', 0);
    armBubbleTimeout();
  }

  async function showSpecialDialogue(entry) {
    // Special-expression art is frozen through the line and remains frozen until
    // the bubble fades. A click during typing skips the text animation only.
    frozenExpression = true;
    bubbleFading = false;
    skipCurrentDialogue = false;
    isDialogueTyping = true;
    setFace(entry.expression, 0);
    el.dialogue.hidden = false;
    el.dialogue.classList.remove('is-fading');
    el.dialogueText.textContent = '';
    for (let i = 0; i < entry.text.length; i++) {
      if (skipCurrentDialogue) break;
      el.dialogueText.textContent += entry.text[i];
      const ch = entry.text[i];
      await sleep(ch === ',' || ch === ';' || ch === ':' ? 220 : (ch === '.' || ch === '!' || ch === '?' ? 320 : 38));
    }
    if (skipCurrentDialogue) el.dialogueText.textContent = entry.text;
    isDialogueTyping = false;
    skipCurrentDialogue = false;
    // Leave the special face frozen until the user dismisses or the 30s timer fires.
    armBubbleTimeout();
  }

  async function playWakeSequence(isSecondEncounter) {
    busy = true;
    bubbleFading = false;
    if (isSecondEncounter) {
      setFace('annoyed', 0);
      await sleep(60);
      setFace('waking', 0);
      await sleep(95);
      setFace('talking', 0);
      await sleep(120);
      await showFixedBubble('Bro.', 4500);
      // Finish the character transition before the one-shot intro bubble fades.
      setFace('neutral', 300);
      await sleep(325);
      await fadeOpeningBubble();
    } else {
      setFace('waking', 0);
      await sleep(145);
      setFace('talking', 0);
      await sleep(180);
      await showFixedBubble('Whatcha want?', 7000);
      // Reverse the wake frames with hard swaps, then fade the intro text away.
      setFace('waking', 0);
      await sleep(120);
      setFace('annoyed', 0);
      await sleep(95);
      setFace('sleep', 0);
      await sleep(180);
      firstEncounterComplete = true;
      await fadeOpeningBubble();
    }
    busy = false;
  }

    function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function refillLineBag() {
    lineBag = shuffle(DIALOGUES.map((_, index) => index));
    // Avoid the same category at a bag boundary when possible.
    if (lineBag.length > 1 && DIALOGUES[lineBag[0]].category === lastCategory) {
      const different = lineBag.findIndex(index => DIALOGUES[index].category !== lastCategory);
      if (different > 0) [lineBag[0], lineBag[different]] = [lineBag[different], lineBag[0]];
    }
  }

  function nextDialogue() {
    if (lineBag.length === 0) refillLineBag();
    let foundAt = lineBag.findIndex(index => DIALOGUES[index].category !== lastCategory);
    if (foundAt > 0) [lineBag[0], lineBag[foundAt]] = [lineBag[foundAt], lineBag[0]];
    const entry = DIALOGUES[lineBag.shift()];
    lastCategory = entry.category;
    return entry;
  }

  async function deliverDialogue(entry) {
    busy = true;
    if (entry.expression && entry.expression !== 'neutral') await showSpecialDialogue(entry);
    else await typeDialogue(entry.text);
    busy = false;
  }

  async function handleTap() {
    if (bubbleFading) return;
    if (busy) {
      // One click during a dialogue fast-forwards the line; once it has finished,
      // another click dismisses the bubble and returns Teto to frame 05.
      if (isDialogueTyping) skipCurrentDialogue = true;
      return;
    }
    // First click after a finished line dismisses the bubble only. A later click
    // starts the next interaction, so visitors can actually read the dialogue.
    if (!el.dialogue.hidden) {
      dismissBubble();
      return;
    }
    showHint(false);
    tapCount += 1;
    setTapCount();

    if (!firstEncounterComplete) {
      if (!introWaiting) {
        introWaiting = true;
        setFace('annoyed', 100);
        if (firstClickTimer) window.clearTimeout(firstClickTimer);
        firstClickTimer = window.setTimeout(() => {
          if (introWaiting && !firstEncounterComplete && !busy) {
            introWaiting = false;
            setFace('sleep', 180);
          }
        }, 4000);
        return;
      }
      if (firstClickTimer) window.clearTimeout(firstClickTimer);
      firstClickTimer = null;
      introWaiting = false;
      await playWakeSequence(false);
      return;
    }

    // First completed encounter is followed by the special quick "Bro." encounter.
    if (!secondEncounterDone) {
      secondEncounterDone = true;
      await playWakeSequence(true);
      return;
    }

    // First click-count warning fires once at a randomized threshold between 20 and 40.
    if (!firstWarningShown && tapCount >= warningThreshold) {
      firstWarningShown = true;
      const warning = {
        text: `HEY! Go check out the other project that pervert made! Stop tapping me—this has been ${tapCount} times now!`,
        expression: 'angry', category: 'special-event'
      };
      await deliverDialogue(warning);
      return;
    }

    // After 40 accepted taps, there's a chance for one extra reaction. No 70-tap event.
    if (!post40ReactionShown && tapCount > 40 && Math.random() < 0.28) {
      post40ReactionShown = true;
      const reaction = {
        text: `${tapCount} TIMES?!—WHAT IS WRONG WITH YOU?! Go look at another project before I start charging per tap!`,
        expression: 'shocked', category: 'special-event'
      };
      await deliverDialogue(reaction);
      return;
    }

    const entry = nextDialogue();
    await deliverDialogue(entry);
  }

  el.button.addEventListener('click', () => { void handleTap(); });
  // Start on the sleeping portrait. The hint disappears after the first click.
  setFace('sleep', 0);
  setTapCount();
})();
