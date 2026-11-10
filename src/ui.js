/* ===== UI ===== */
const $ = s => document.querySelector(s);
const store = {
  get(k, d){ try{ const v = localStorage.getItem('dz.' + k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('dz.' + k, JSON.stringify(v)); }catch(e){} }
};
const S = {
  langs: store.get('langs', ['it','en','es','zh','ja','fr','si']),
  es: store.get('es', 'both'),
  ui: store.get('ui', (navigator.language || 'it').startsWith('it') ? 'it' : 'en'),
  size: Math.min(3, Math.max(0, store.get('size', 1))),
  theme: store.get('theme', 'light'),
  recent: store.get('recent', []),
  saved: store.get('saved', []),
  last: store.get('last', '')
};
const TXT = {
  it: {ph:'Scrivi una parola…', go:'Cerca', recent:'Recenti', saved:'Salvate', meaning:'Significato', syn:'Sinonimi', ant:'Contrari',
    nyms:'Sinonimi e contrari', trans:'Traduzioni', rel:'Parole collegate', help:'Aiuti', all:'Tutto', listen:'Ascolta', save:'Salva', unsave:'Salvata',
    copy:'Copia', copied:'Copiata!', more:'Mostra altri', notFound:'Non trovo', maybe:'Forse cercavi:', noLang:'Questa parola esiste, ma non in una delle tue lingue.',
    also:'Esiste in:', net:'Non riesco a collegarmi. Controlla la connessione e riprova.', loading:'Cerco…', via:'Passando dall’inglese:',
    noTrans:'Nessuna traduzione trovata nelle tue lingue.', noNyms:'Wiktionary non ha ancora sinonimi o contrari per questa parola.', forms:'Forme', notes:'Note d’uso',
    wikt:'Apri la voce completa su Wiktionary (coniugazioni, etimologia…)', settings:'Impostazioni', myLangs:'Le mie lingue', esVar:'Quale spagnolo?',
    both:'Entrambi', ES:'Spagna', LA:'America Latina', uiLang:'Lingua dell’app', close:'Fatto', defsIn:'Le spiegazioni dei significati sono in inglese.',
    src:'Dati da Wiktionary (CC BY-SA 4.0) · Nessuna AI', goLemma:'Vai a', hint:'Scrivi in una qualsiasi delle tue lingue. Tocca una parola colorata per cercarla.',
    size:'Dimensione del testo', theme:'Tema chiaro / scuro', general:'In generale', otherSenses:'Altri significati', empty:'Ancora niente qui.', title:'Kotoba', form:'variante',
    sizeT:'Dimensione del testo', sizes:['Piccolo','Normale','Grande','Molto grande'],
    hello:['Buona notte','Buongiorno','Buon pomeriggio','Buonasera'], wotd:'Parola del giorno', surprise:'🎲 Parola a sorpresa', open:'Apri',
    didYou:'Forse intendevi', asked:'Hai scritto', alsoSee:'vedi anche', enable:'Attiva', noVoice:'Il tuo dispositivo non ha una voce per questa lingua, e Wiktionary non ha una registrazione.',
    review:'Ripassa', reviewT:'Ripasso', reveal:'Mostra il significato', knew:'✓ Lo sapevo', again:'↻ Ancora', of:'di',
    doneT:'Fatto!', doneMsg:'Hai ripassato {n}. Al primo colpo: {k}.', word1:'1 parola', wordN:'{n} parole', reviewMore:'Ripassa ancora', toList:'Torna alle parole', noGloss:'Apri la parola per vedere il significato.',
    note:'Nota', addNote:'✎ Aggiungi una nota', editNote:'✎ Modifica nota', notePh:'Una frase tua, un ricordo, un esempio per il romanzo…', saveNote:'Salva nota', yourNote:'La tua nota', formNote:'<b>variante</b> = non è la parola base, ma un plurale, un femminile o un verbo coniugato di un\u2019altra parola.',
    favs:'Le mie parole', favsBtn:'Parole preferite', favsEmpty:'Non hai ancora parole preferite. Quando trovi una parola che ti piace, tocca ☆ Salva e la ritrovi qui.',
    allL:'Tutte', removed:'Tolta dalle preferite.', undo:'Annulla', copyList:'Copia la lista', remove:'Togli', seeAll:'Vedi tutte', back:'← Indietro',
    wTitle:'Ciao! Questo è Kotoba', wSub:'Un dizionario calmo, per scrivere e per imparare le lingue.',
    w1:'Scrivi una parola in una delle tue lingue.', w2:'Trovi significato, esempi, sinonimi, contrari e traduzioni, con la scrittura originale e la pronuncia.',
    w3:'Tocca una parola colorata per cercarla. Salva con ☆ quelle che ti piacciono.',
    wLangs:'Quali lingue usi?', wLater:'Puoi cambiarle quando vuoi da ⚙.', start:'Inizia', reWelcome:'Rivedi il benvenuto', noAI:'Niente AI, niente account: i dati vengono da Wiktionary e le tue parole restano sul tuo dispositivo.'},
  en: {ph:'Type a word…', go:'Search', recent:'Recent', saved:'Saved', meaning:'Meaning', syn:'Synonyms', ant:'Opposites',
    nyms:'Synonyms & opposites', trans:'Translations', rel:'Related words', help:'Helpers', all:'All', listen:'Listen', save:'Save', unsave:'Saved',
    copy:'Copy', copied:'Copied!', more:'Show more', notFound:'I can’t find', maybe:'Did you mean:', noLang:'This word exists, but not in one of your languages.',
    also:'It exists in:', net:'I can’t connect. Check your connection and try again.', loading:'Searching…', via:'Going through English:',
    noTrans:'No translations found in your languages.', noNyms:'Wiktionary has no synonyms or opposites for this word yet.', forms:'Forms', notes:'Usage notes',
    wikt:'Open the full entry on Wiktionary (conjugations, etymology…)', settings:'Settings', myLangs:'My languages', esVar:'Which Spanish?',
    both:'Both', ES:'Spain', LA:'Latin America', uiLang:'App language', close:'Done', defsIn:'Meanings are explained in English.',
    src:'Data from Wiktionary (CC BY-SA 4.0) · No AI', goLemma:'Go to', hint:'Type in any of your languages. Tap a coloured word to look it up.',
    size:'Text size', theme:'Light / dark theme', general:'In general', otherSenses:'Other meanings', empty:'Nothing here yet.', title:'Kotoba', form:'variant',
    sizeT:'Text size', sizes:['Small','Normal','Large','Extra large'],
    hello:['Good night','Good morning','Good afternoon','Good evening'], wotd:'Word of the day', surprise:'🎲 Surprise word', open:'Open',
    didYou:'Did you mean', asked:'You typed', alsoSee:'see also', enable:'Turn on', noVoice:'Your device has no voice for this language, and Wiktionary has no recording.',
    review:'Review', reviewT:'Review', reveal:'Show the meaning', knew:'✓ I knew it', again:'↻ Again', of:'of',
    doneT:'Done!', doneMsg:'You reviewed {n}. Right the first time: {k}.', word1:'1 word', wordN:'{n} words', reviewMore:'Review again', toList:'Back to my words', noGloss:'Open the word to see its meaning.',
    note:'Note', addNote:'✎ Add a note', editNote:'✎ Edit note', notePh:'Your own sentence, a memory, an example for your novel…', saveNote:'Save note', yourNote:'Your note', formNote:'<b>variant</b> = not the base word, but a plural, feminine or conjugated verb of another word.',
    favs:'My words', favsBtn:'Favourite words', favsEmpty:'No favourite words yet. When you find a word you like, tap ☆ Save and it will be here.',
    allL:'All', removed:'Removed from favourites.', undo:'Undo', copyList:'Copy the list', remove:'Remove', seeAll:'See all', back:'← Back',
    wTitle:'Hi! This is Kotoba', wSub:'A calm dictionary, for writing and for learning languages.',
    w1:'Type a word in any of your languages.', w2:'You get meanings, examples, synonyms, opposites and translations, in the original script with pronunciation.',
    w3:'Tap a coloured word to look it up. Save the ones you like with ☆.',
    wLangs:'Which languages do you use?', wLater:'You can change them any time from ⚙.', start:'Start', reWelcome:'See the welcome again', noAI:'No AI, no account: the data comes from Wiktionary and your words stay on your device.'}
};
const POS_IT = {Noun:'Sostantivo', Verb:'Verbo', Adjective:'Aggettivo', Adverb:'Avverbio', Pronoun:'Pronome', Preposition:'Preposizione', Conjunction:'Congiunzione',
  Interjection:'Interiezione', 'Proper noun':'Nome proprio', Numeral:'Numerale', Article:'Articolo', Determiner:'Determinante', Particle:'Particella', Phrase:'Frase',
  Idiom:'Modo di dire', Proverb:'Proverbio', Definitions:'Significati', Prefix:'Prefisso', Suffix:'Suffisso', Classifier:'Classificatore', Counter:'Contatore'};
const t = k => TXT[S.ui][k];
const posName = n => { n = n.replace(/ \d+$/, ''); return S.ui === 'it' ? (POS_IT[n] || n) : n; };
const langName = c => { const L = Core.BY_C[c]; return S.ui === 'it' ? L.it : L.wk; };
const out = $('#out'), input = $('#q'), sug = $('#sug');
let R = null, token = 0, focus = 'all', view = 'home', favFilter = 'all', lastRemoved = null;

function applyPrefs(){
  document.documentElement.dataset.theme = S.theme;
  document.documentElement.dataset.size = S.size;
  document.documentElement.lang = S.ui;
  input.placeholder = t('ph'); $('#go').textContent = t('go'); $('#src').textContent = t('src');
  $('#brand').textContent = t('title'); document.title = t('title');
  $('#bsize').title = t('sizeT'); $('#bfav').title = t('favsBtn'); $('#bfav').setAttribute('aria-label', t('favsBtn')); $('#btheme').title = t('theme'); $('#bset').title = t('settings');
}
function regionBadge(r){ return r ? '<span class="rg rg-' + r + '">' + (r === 'ES' ? 'ES' : 'LATAM') + '</span>' : ''; }
function chip(x, lc, kind){
  const dim = lc === 'es' && S.es !== 'both' && x.r && x.r !== S.es;
  return '<button class="chip ' + (kind || '') + (dim ? ' dim' : '') + '" data-w="' + esc(x.w || x.t) + '" data-l="' + lc + '">' +
    '<span class="ct" lang="' + lc + '">' + esc(x.t) + '</span>' +
    (x.alt ? '<span class="calt" lang="' + lc + '">' + esc(x.alt) + '</span>' : '') +
    (x.tr ? '<span class="ctr">' + esc(x.tr) + '</span>' : '') +
    (x.g ? '<span class="cg">' + esc(x.g) + '</span>' : '') +
    (x.r ? regionBadge(x.r) : (x.q ? '<span class="cq">' + esc(x.q.slice(0, 28)) + '</span>' : '')) + '</button>';
}
function wordChips(list){
  return list.map(x => '<button class="chip plain" data-w="' + esc(x.w) + '" data-l="' + (x.l || '') + '">' + esc(x.w) +
    (x.l ? '<span class="cq">' + x.l.toUpperCase() + '</span>' : '') + '</button>').join('');
}
/* A suggestion: the word, then one button per language it exists in. */
function sugRow(x){
  const one = x.langs.length === 1 ? x.langs[0].c : '';
  return '<div class="srow"><button type="button" class="sw" data-w="' + esc(x.w) + '" data-l="' + one + '">' + esc(x.w) + '</button>' +
    '<span class="slangs">' + x.langs.map(l => '<button type="button" class="sl" data-w="' + esc(x.w) + '" data-l="' + l.c + '">' +
      esc(langName(l.c)) + (l.form ? ' <i>· ' + t('form') + '</i>' : '') + '</button>').join('') + '</span></div>';
}
function sugList(list){
  return list.map(sugRow).join('') + (list.some(x => x.langs.some(l => l.form)) ? '<p class="snote">' + t('formNote') + '</p>' : '');
}
function scriptOf(w, avail){
  const has = c => avail.includes(c);
  if(/[඀-෿]/.test(w) && has('si')) return 'si';
  if(/[぀-ヿ]/.test(w) && has('ja')) return 'ja';
  if(/[一-鿿]/.test(w)) return S.last === 'ja' && has('ja') ? 'ja' : has('zh') ? 'zh' : has('ja') ? 'ja' : null;
  if(/[가-힯]/.test(w) && has('ko')) return 'ko';
  if(/[Ѐ-ӿ]/.test(w) && has('ru')) return 'ru';
  if(/[؀-ۿ]/.test(w) && has('ar')) return 'ar';
  if(/[ऀ-ॿ]/.test(w) && has('hi')) return 'hi';
  return null;
}
function home(){
  R = null; token++; input.value = ''; view = 'home'; document.body.classList.remove('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  const hr = new Date().getHours(), hi = t('hello')[hr < 5 ? 0 : hr < 13 ? 1 : hr < 18 ? 2 : 3];
  out.innerHTML = '<h1 class="hello">' + hi + ' ' + (hr >= 5 && hr < 18 ? '☀️' : '🌙') + '</h1><p class="hint">' + t('hint') + '</p>' +
    '<section class="card wotd" id="wotd" hidden></section>' +
    '<button class="act surprise" data-surprise>' + t('surprise') + '</button>' +
    (S.saved.length ? '<section class="shelf"><h2>★ ' + t('favs') + '</h2><div class="chips">' + wordChips(S.saved.slice(0, 8)) + '</div>' + (S.saved.length > 8 ? '<button class="morebtn" data-nav="favs">' + t('seeAll') + ' (' + S.saved.length + ')</button>' : '') + '</section>' : '') +
    (S.recent.length ? '<section class="shelf"><h2>' + t('recent') + '</h2><div class="chips">' + wordChips(S.recent.slice(0, 8)) + '</div></section>' : '');
  loadWotd();
}
function message(html){ out.innerHTML = '<div class="msg">' + html + '</div>'; }

async function search(w, hint, exact){
  w = (w || '').trim(); if(!w) return home();
  const my = ++token; input.value = w; sug.hidden = true;
  message('<span class="spin"></span>' + t('loading'));
  let r;
  try{ r = await Core.lookup(w, S.langs, exact); }catch(e){ if(my === token) message(t('net')); return; }
  if(my !== token) return;
  if(!r){
    const sg = (await Core.suggest(w, S.langs)).filter(x => x.w !== w);
    if(my !== token) return;
    return message(t('notFound') + ' <b>“' + esc(w) + '”</b>.' + (sg.length ? '<p>' + t('maybe') + '</p><div class="slist">' + sugList(sg) + '</div>' : ''));
  }
  const avail = S.langs.filter(c => r.entries[c]);
  if(!avail.length){
    const known = Object.keys(r.entries);
    const names = known.map(langName).concat(r.others).slice(0, 12);
    return message(t('noLang') + (names.length ? '<p>' + t('also') + ' ' + esc(names.join(', ')) + '</p>' : '') +
      (known.length ? '<div class="chips">' + known.map(c => '<button class="chip plain" data-enable="' + c + '" data-ew="' + esc(r.title) + '">+ ' + t('enable') + ' ' + esc(langName(c)) + '</button>').join('') + '</div>' : ''));
  }
  const size = c => r.entries[c].pos.reduce((n, p) => n + p.senses.length, 0) + (c === S.last ? 0.5 : 0);
  const richest = avail.slice().sort((a, b) => size(b) - size(a))[0];
  const cur = hint && avail.includes(hint) ? hint : scriptOf(r.title, avail) || richest;
  R = {r, avail, cur, pivot: null}; view = 'word';
  focus = 'all';
  if(decodeURIComponent(location.hash.slice(1)) !== r.title) location.hash = encodeURIComponent(r.title);
  show();
  didYouMean(w, my);
}
function remember(){
  const w = R.r.title, l = R.cur;
  S.recent = [{w, l}].concat(S.recent.filter(x => !(x.w === w && x.l === l))).slice(0, 14);
  store.set('recent', S.recent);
}
const isSaved = () => S.saved.some(x => x.w === R.r.title && x.l === R.cur);

function show(){
  const E = R.r.entries[R.cur], lc = R.cur, L = Core.BY_C[lc];
  remember();
  let n = 0; E.pos.forEach(p => p.senses.forEach(s => { s.n = ++n; }));
  const h0 = E.pos.find(p => p.head);
  let big = E.typed ? esc(E.typed) : (h0 && h0.head.html ? h0.head.html.replace(/<\/?a[^>]*>/g, '') : esc(E.word));
  const alt = E.typed && E.typed !== E.word ? E.word : '';
  let pr = E.pron;
  if(lc === 'es' && S.es !== 'both'){ const m = pr.filter(p => !p.r || p.r === S.es); if(m.length) pr = m; }
  pr = pr.slice(0, lc === 'es' || lc === 'en' ? 2 : 1);
  let h = '';
  if(R.avail.length > 1) h += '<nav class="tabs">' + R.avail.map(c => '<button class="tab' + (c === lc ? ' on' : '') + '" data-tab="' + c + '">' + esc(Core.BY_C[c].n) + '</button>').join('') + '</nav>';
  h += '<header class="word"><div class="wl">' + esc(L.n) + (lc === 'es' && S.es !== 'both' ? ' · ' + t(S.es) : '') + '</div>' +
    '<h1 lang="' + lc + '">' + big + (alt ? ' <small lang="' + lc + '">' + esc(alt) + '</small>' : '') + '</h1>' +
    (E.tr ? '<div class="roman">' + esc(E.tr) + '</div>' : '') +
    (pr.length ? '<div class="ipa">' + pr.map(p => '<span>' + esc(p.ipa) + (p.r ? ' ' + regionBadge(p.r) : (p.label && pr.length > 1 ? ' <em>' + esc(p.label.split(',')[0]) + '</em>' : '')) + '</span>').join('') + '</div>' : '') +
    '<div class="acts"><button class="act" data-act="listen">🔊 ' + t('listen') + '</button>' +
    '<button class="act' + (isSaved() ? ' on' : '') + '" data-act="save">' + (isSaved() ? '★ ' + t('unsave') : '☆ ' + t('save')) + '</button>' +
    '<button class="act" data-act="copy">⧉ ' + t('copy') + '</button></div></header>';
  h += '<div id="didyou"></div>';
  if(R.r.asked) h += '<p class="asked">' + t('asked') + ' «' + esc(R.r.asked) + '» · ' + t('alsoSee') + ' <button class="linkbtn inline" data-w="' + esc(R.r.asked) + '" data-exact="1">' + esc(R.r.asked) + '</button></p>';
  const sv = S.saved.find(x => x.w === R.r.title && x.l === R.cur);
  if(sv && sv.note) h += '<div class="mynote"><b>📝 ' + t('yourNote') + '</b><p>' + esc(sv.note) + '</p></div>';
  h += '<nav class="focus">' + [['all','all'],['mean','meaning'],['nyms','nyms'],['tr','trans']].map(f =>
    '<button data-focus="' + f[0] + '" class="' + (focus === f[0] ? 'on' : '') + '">' + t(f[1]) + '</button>').join('') + '</nav>';

  /* meanings */
  h += '<section class="card mean" data-k="mean"><h2>' + t('meaning') + '</h2>';
  E.pos.forEach(p => {
    h += '<div class="posblock"><h3>' + esc(posName(p.name)) + '</h3><ol class="senses">';
    p.senses.forEach((s, i) => {
      const dim = lc === 'es' && S.es !== 'both' && s.r && s.r !== S.es;
      h += '<li class="sense' + (s.sub ? ' sub' : '') + (dim ? ' dim' : '') + (i >= 5 ? ' extra' : '') + '"><span class="num">' + s.n + '</span><div>' +
        '<p class="def">' + regionBadge(s.r) + s.labels.filter(l => !Core.region(l)).slice(0, 3).map(l => '<span class="lb">' + esc(l) + '</span>').join('') + ' ' + s.html + '</p>' +
        s.ex.slice(0, 2).map(e => '<div class="ex"><span class="ex-t" lang="' + lc + '">' + e.h + '</span>' +
          (e.tr ? '<span class="ex-r">' + esc(e.tr) + '</span>' : '') + (e.t ? '<span class="ex-m">' + esc(e.t) + '</span>' : '') + '</div>').join('') +
        (s.formOf ? '<button class="chip plain" data-w="' + esc(s.formOf) + '" data-l="' + lc + '">→ ' + t('goLemma') + ' <b>' + esc(s.formOf) + '</b></button>' : '') +
        '</div></li>';
    });
    h += '</ol>';
    if(p.senses.length > 5) h += '<button class="morebtn" data-more>' + t('more') + ' ' + (p.senses.length - 5) + '</button>';
    h += '</div>';
  });
  h += '</section>';

  /* synonyms & antonyms */
  const nym = (key, cls, title) => {
    let rows = '';
    E.pos.forEach(p => p.senses.forEach(s => { if(s[key].length) rows += '<div class="nrow"><span class="num">' + s.n + '</span><div class="chips">' + s[key].map((x, i) => chip(x, lc, cls + (i >= 12 ? ' extra' : ''))).join('') +
      (s[key].length > 12 ? '<button class="morebtn" data-more>+' + (s[key].length - 12) + '</button>' : '') + '</div></div>'; }));
    if(E[key].length) rows += '<div class="nrow"><span class="num gen">∗</span><div class="chips">' + E[key].slice(0, 40).map((x, i) => chip(x, lc, cls + (i >= 12 ? ' extra' : ''))).join('') +
      (Math.min(E[key].length, 40) > 12 ? '<button class="morebtn" data-more>+' + (Math.min(E[key].length, 40) - 12) + '</button>' : '') + '</div></div>';
    return rows ? '<section class="card ' + cls + '" data-k="nyms"><h2>' + title + '</h2>' + rows + '</section>' : '';
  };
  const nyms = nym('syn', 'syn', t('syn')) + nym('ant', 'ant', t('ant'));
  h += nyms || '<section class="card syn quiet" data-k="nyms"><p class="muted">' + t('noNyms') + '</p></section>';

  /* translations (filled in asynchronously) */
  h += '<section class="card tr" data-k="tr"><h2>' + t('trans') + '</h2><div id="trbox"><span class="spin"></span></div></section>';

  /* related words */
  if(E.rel.length) h += '<details class="card rel" data-k="all"><summary>' + t('rel') + ' (' + E.rel.length + ')</summary><div class="chips">' + E.rel.map(x => chip(x, lc, '')).join('') + '</div></details>';

  /* helpers */
  h += '<section class="card help" data-k="all"><h2>' + t('help') + '</h2>';
  E.pos.forEach(p => { if(p.head && p.head.info) h += '<p><b>' + t('forms') + ' · ' + esc(posName(p.name)) + ':</b> <span lang="' + lc + '">' + esc(p.head.info) + '</span></p>'; });
  if(E.notes.length) h += '<p><b>' + t('notes') + ':</b></p><ul>' + E.notes.map(x => '<li>' + x + '</li>').join('') + '</ul>';
  h += '<p class="muted">' + t('defsIn') + '</p><p><a class="ext" target="_blank" rel="noopener" href="https://en.wiktionary.org/wiki/' + encodeURIComponent(E.word) + '#' + L.wk + '">' + t('wikt') + ' ↗</a></p></section>';

  out.innerHTML = h; out.dataset.focus = focus;
  window.scrollTo(0, 0);
  loadTrans();
}

async function loadTrans(){
  const my = token, E = R.r.entries[R.cur], lc = R.cur, box = $('#trbox');
  const targets = S.langs.filter(c => c !== lc && c !== 'en');
  let pivots = [], word = E.word, wantPos = null;
  if(lc !== 'en'){
    E.pos.forEach(p => p.senses.forEach(s => { const k = s.links[0]; if(k && pivots.length < 6 && !pivots.some(x => x.w === k)) pivots.push({w: k, pos: p.name.replace(/ \d+$/, '')}); }));
    if(!pivots.length){ box.innerHTML = '<p class="muted">' + t('noTrans') + '</p>'; return; }
    const pv = pivots.find(x => x.w === R.pivot) || pivots[0];
    word = pv.w; wantPos = pv.pos; R.pivot = pv.w;
  }
  let groups = [];
  try{ groups = await Core.translations(word, targets); }catch(e){ if(my === token) box.innerHTML = '<p class="muted">' + t('net') + '</p>'; return; }
  if(my !== token || !$('#trbox')) return;
  if(wantPos){ const m = groups.filter(g => g.pos.replace(/ \d+$/, '') === wantPos); if(m.length) groups = m; }
  let h = '';
  if(lc !== 'en') h += '<div class="pivots"><span class="muted">' + t('via') + '</span> ' + pivots.map(p =>
    '<button class="pv' + (p.w === word ? ' on' : '') + '" data-pivot="' + esc(p.w) + '" lang="en">' + esc(p.w) + '</button>').join('') + '</div>';
  if(!groups.length) h += '<p class="muted">' + t('noTrans') + '</p>';
  const grp = (g, extra) => {
    let s = '<div class="tg' + (extra ? ' extra' : '') + '"><h3 lang="en">' + (lc !== 'en' ? '<b>' + esc(word) + '</b> · ' : '') + esc(g.gloss || '') + '</h3>';
    targets.forEach(c => {
      let ts = g.by[c]; if(!ts) return;
      if(c === 'es' && S.es !== 'both') ts = ts.slice().sort((a, b) => (a.r && a.r !== S.es ? 1 : 0) - (b.r && b.r !== S.es ? 1 : 0));
      s += '<div class="trow"><span class="tl">' + esc(Core.BY_C[c].n) + '</span><div class="chips">' + ts.slice(0, 8).map(x => chip(x, c, 'trc')).join('') + '</div></div>';
    });
    return s + '</div>';
  };
  groups.forEach((g, i) => { h += grp(g, i >= 3); });
  if(groups.length > 3) h += '<button class="morebtn" data-more>' + t('otherSenses') + ' (' + (groups.length - 3) + ')</button>';
  box.innerHTML = h;
}

/* listen: recorded audio from Wiktionary when there is one, else the device voice */
function speak(){
  const lang = R.cur === 'es' && S.es === 'LA' ? 'es-MX' : Core.BY_C[R.cur].sp;
  const voices = 'speechSynthesis' in window ? speechSynthesis.getVoices() : [];
  const has = voices.some(v => v.lang.replace('_', '-').toLowerCase().startsWith(lang.slice(0, 2).toLowerCase()));
  if(!has){ toast(t('noVoice')); return; }
  const E = R.r.entries[R.cur], u = new SpeechSynthesisUtterance(E.typed || E.word);
  u.lang = lang; u.voice = voices.find(v => v.lang.replace('_', '-') === lang) || voices.find(v => v.lang.toLowerCase().startsWith(lang.slice(0, 2).toLowerCase())); u.rate = 0.85;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}
function listen(){
  const E = R.r.entries[R.cur]; let a = E.audio;
  if(R.cur === 'es' && S.es !== 'both'){ const m = a.filter(x => x.r === S.es); a = m.length ? m : a.filter(x => !x.r); }
  if(!a.length) return speak();
  try{ new Audio(a[0].src).play().catch(speak); }catch(e){ speak(); }
}

/* settings */
function openSettings(){
  const d = $('#set');
  d.innerHTML = '<h2>' + t('settings') + '</h2><h3>' + t('myLangs') + '</h3><div class="lgrid">' +
    Core.LANGS.map(L => '<label><input type="checkbox" data-lang="' + L.c + '"' + (S.langs.includes(L.c) ? ' checked' : '') + '> <span lang="' + L.c + '">' + esc(L.n) + '</span> <small>' + esc(langName(L.c)) + '</small></label>').join('') +
    '</div><h3>' + t('esVar') + '</h3><div class="seg">' + ['both','ES','LA'].map(v => '<button data-es="' + v + '" class="' + (S.es === v ? 'on' : '') + '">' + t(v) + '</button>').join('') +
    '</div><h3>' + t('uiLang') + '</h3><div class="seg">' + ['it','en'].map(v => '<button data-ui="' + v + '" class="' + (S.ui === v ? 'on' : '') + '">' + (v === 'it' ? 'Italiano' : 'English') + '</button>').join('') +
    '</div><button class="linkbtn" data-rewelcome>' + t('reWelcome') + '</button><button class="done" data-close>' + t('close') + '</button>';
  if(d.showModal) d.showModal(); else d.setAttribute('open', '');
}
$('#set').addEventListener('click', e => {
  const b = e.target.closest('button'); if(!b) return;
  if(b.dataset.es){ S.es = b.dataset.es; store.set('es', S.es); openSettingsRefresh(); }
  else if(b.dataset.ui){ S.ui = b.dataset.ui; store.set('ui', S.ui); applyPrefs(); openSettingsRefresh(); }
  else if('close' in b.dataset){ $('#set').close ? $('#set').close() : $('#set').removeAttribute('open'); }
  else if('rewelcome' in b.dataset){ skipReload = true; $('#set').close ? $('#set').close() : $('#set').removeAttribute('open'); welcome(); }
});
function openSettingsRefresh(){ const d = $('#set'); if(d.close && d.open) d.close(); openSettings(); }
$('#set').addEventListener('change', e => {
  const c = e.target.dataset.lang; if(!c) return;
  const on = new Set(S.langs); e.target.checked ? on.add(c) : on.delete(c);
  S.langs = Core.LANGS.map(L => L.c).filter(x => on.has(x));
  if(!S.langs.length) S.langs = ['en'];
  store.set('langs', S.langs);
});
let skipReload = false;
$('#set').addEventListener('close', () => {
  if(skipReload){ skipReload = false; return; }
  if(R) search(R.r.title, R.cur); else if(view === 'favs') favs(); else home();
});

/* events */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-w],[data-tab],[data-focus],[data-act],[data-more],[data-pivot]');
  if(!b || b.closest('#set')) return;
  const d = b.dataset;
  if(d.w !== undefined){ search(d.w, d.l || undefined, !!d.exact); }
  else if(d.tab){ R.cur = d.tab; R.pivot = null; S.last = d.tab; store.set('last', S.last); show(); }
  else if(d.focus){ focus = d.focus; out.dataset.focus = focus; out.querySelectorAll('.focus button').forEach(x => x.classList.toggle('on', x === b)); }
  else if(d.pivot){ R.pivot = d.pivot; $('#trbox').innerHTML = '<span class="spin"></span>'; loadTrans(); }
  else if('more' in d){ b.parentElement.querySelectorAll('.extra').forEach(x => x.classList.remove('extra')); b.remove(); }
  else if(d.act === 'listen') listen();
  else if(d.act === 'save'){
    const w = R.r.title, l = R.cur;
    const E = R.r.entries[l], s0 = E.pos[0] && E.pos[0].senses[0];
    const g = s0 ? s0.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim().slice(0, 90) : '';
    S.saved = isSaved() ? S.saved.filter(x => !(x.w === w && x.l === l)) : [{w, l, s: E.typed || E.word, tr: E.tr || '', g, at: Date.now()}].concat(S.saved);
    store.set('saved', S.saved);
    b.classList.toggle('on', isSaved()); b.textContent = isSaved() ? '★ ' + t('unsave') : '☆ ' + t('save');
  }
  else if(d.act === 'copy'){
    const E = R.r.entries[R.cur], w = E.typed || E.word;
    const ok = () => { b.textContent = '✓ ' + t('copied'); setTimeout(() => { b.textContent = '⧉ ' + t('copy'); }, 1400); };
    try{ navigator.clipboard.writeText(w).then(ok, () => {}); }catch(err){}
  }
});
$('#form').addEventListener('submit', e => { e.preventDefault(); const k = sug.hidden ? null : sug.querySelector('.sw.kb'); search(input.value, k ? k.dataset.l || undefined : undefined); input.blur(); });
let st = 0;
input.addEventListener('input', () => {
  clearTimeout(st); const v = input.value.trim();
  if(v.length < 2){ sug.hidden = true; return; }
  st = setTimeout(async () => {
    const list = await Core.suggest(v, S.langs);
    if(input.value.trim() !== v || document.activeElement !== input) return;
    sug.innerHTML = sugList(list);
    sug.hidden = !list.length;
  }, 220);
});
sug.addEventListener('click', e => { const b = e.target.closest('[data-w]'); if(b){ e.stopPropagation(); search(b.dataset.w, b.dataset.l || undefined); } });
sug.addEventListener('mousedown', e => e.preventDefault());
input.addEventListener('blur', () => setTimeout(() => { sug.hidden = true; }, 180));
input.addEventListener('keydown', e => {
  if(e.key === 'Escape'){ sug.hidden = true; return; }
  if(sug.hidden || (e.key !== 'ArrowDown' && e.key !== 'ArrowUp')) return;
  e.preventDefault();
  const bs = [...sug.querySelectorAll('.sw')]; if(!bs.length) return;
  let i = bs.findIndex(b => b.classList.contains('kb'));
  bs.forEach(b => b.classList.remove('kb'));
  i = e.key === 'ArrowDown' ? (i + 1) % bs.length : (i <= 0 ? bs.length - 1 : i - 1);
  bs[i].classList.add('kb'); bs[i].scrollIntoView({block: 'nearest'}); input.value = bs[i].dataset.w;
});
$('#brand').addEventListener('click', e => { e.preventDefault(); if(document.body.classList.contains('welcoming')) return; home(); input.focus(); });
$('#bfav').addEventListener('click', () => { if(!document.body.classList.contains('welcoming')) favs(); });
const sizePop = $('#sizepop');
function drawSizes(){
  sizePop.innerHTML = '<p>' + t('sizeT') + '</p>' + t('sizes').map((n, i) =>
    '<button data-size="' + i + '" class="' + (S.size === i ? 'on' : '') + '" aria-pressed="' + (S.size === i) + '"><span class="sa s' + i + '">A</span>' + n + '</button>').join('');
}
$('#bsize').addEventListener('click', e => { e.stopPropagation(); drawSizes(); sizePop.hidden = !sizePop.hidden; $('#bsize').setAttribute('aria-expanded', !sizePop.hidden); });
sizePop.addEventListener('click', e => {
  e.stopPropagation(); const b = e.target.closest('[data-size]'); if(!b) return;
  S.size = +b.dataset.size; store.set('size', S.size); applyPrefs(); drawSizes();
  setTimeout(() => { sizePop.hidden = true; }, 250);
});
document.addEventListener('click', () => { sizePop.hidden = true; });
$('#btheme').addEventListener('click', () => { S.theme = S.theme === 'dark' ? 'light' : 'dark'; store.set('theme', S.theme); applyPrefs(); });
$('#bset').addEventListener('click', openSettings);
document.addEventListener('keydown', e => { if(e.key === '/' && document.activeElement !== input && !$('#set').open){ e.preventDefault(); input.focus(); input.select(); } });
window.addEventListener('hashchange', () => {
  const w = decodeURIComponent(location.hash.slice(1));
  if(document.body.classList.contains('welcoming')) return;
  if(!w){ if(view === 'word') home(); return; }
  if(!R || R.r.title !== w) search(w);
});
/* ===== Welcome ===== */
const WELCOME_LANGS = ['it','en','es','zh','ja','fr','si','ca','de','pt','ru','ar','hi','ko'];
function welcome(){
  R = null; token++; view = 'welcome';
  document.body.classList.add('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  const step = (n, cls, txt) => '<li><span class="wn ' + cls + '">' + n + '</span><span>' + txt + '</span></li>';
  out.innerHTML = '<section class="welcome">' +
    '<div class="seg wui">' + ['it','en'].map(v => '<button data-wui="' + v + '" class="' + (S.ui === v ? 'on' : '') + '">' + (v === 'it' ? 'Italiano' : 'English') + '</button>').join('') + '</div>' +
    '<div class="wlogo" aria-hidden="true">' + LOGO + '</div>' +
    '<h1>' + t('wTitle') + '</h1><p class="wsub">' + t('wSub') + '</p>' +
    '<ol class="wsteps">' + step(1, 'c-mean', t('w1')) + step(2, 'c-syn', t('w2')) + step(3, 'c-ant', t('w3')) + '</ol>' +
    '<h2>' + t('wLangs') + '</h2><div class="chips wlangs">' +
    WELCOME_LANGS.map(c => '<button class="chip plain wl' + (S.langs.includes(c) ? ' on' : '') + '" data-wl="' + c + '" aria-pressed="' + S.langs.includes(c) + '"><span lang="' + c + '">' + esc(Core.BY_C[c].n) + '</span>' +
      (Core.BY_C[c].n !== langName(c) ? '<span class="cq">' + esc(langName(c)) + '</span>' : '') + '</button>').join('') + '</div>' +
    '<div class="wes"><h2>' + t('esVar') + '</h2><div class="seg">' + ['both','ES','LA'].map(v => '<button data-wes="' + v + '" class="' + (S.es === v ? 'on' : '') + '">' + t(v) + '</button>').join('') + '</div></div>' +
    '<p class="muted small">' + t('wLater') + '</p>' +
    '<button class="done big" data-start>' + t('start') + ' →</button>' +
    '<p class="muted small center">' + t('noAI') + '</p></section>';
  window.scrollTo(0, 0);
}
const LOGO = '<svg viewBox="0 0 120 120" width="88" height="88"><rect x="24" y="28" width="72" height="51" rx="13" fill="var(--pfill)"/><path d="M43 77 L39 96 L60 78 Z" fill="var(--pfill)"/>' +
  '<rect x="35" y="40" width="48" height="6" rx="3" fill="var(--mean)"/><rect x="35" y="51" width="36" height="6" rx="3" fill="var(--syn)"/><rect x="35" y="62" width="43" height="6" rx="3" fill="var(--ant)"/></svg>';

/* ===== Favourite words ===== */
function favs(){
  R = null; token++; view = 'favs'; input.value = '';
  document.body.classList.remove('welcoming');
  if(location.hash) history.replaceState(null, '', location.pathname + location.search);
  const langs = [...new Set(S.saved.map(x => x.l))].filter(c => Core.BY_C[c]);
  if(favFilter !== 'all' && !langs.includes(favFilter)) favFilter = 'all';
  const list = S.saved.filter(x => favFilter === 'all' || x.l === favFilter);
  let h = '<button class="linkbtn" data-nav="home">' + t('back') + '</button>' +
    '<header class="fhead"><h1>★ ' + t('favs') + '</h1><span class="count">' + S.saved.length + '</span>' +
    (S.saved.length ? '<button class="act review" data-review>🧠 ' + t('review') + '</button>' : '') + '</header>';
  if(lastRemoved) h += '<div class="toast">' + t('removed') + ' <button data-undo>' + t('undo') + '</button></div>';
  if(!S.saved.length){ out.innerHTML = h + '<div class="msg">' + t('favsEmpty') + '</div>'; return; }
  if(langs.length > 1) h += '<nav class="tabs ffilt">' + ['all'].concat(langs).map(c =>
    '<button class="tab' + (favFilter === c ? ' on' : '') + '" data-ff="' + c + '">' + (c === 'all' ? t('allL') : esc(Core.BY_C[c].n)) +
    ' <small>' + (c === 'all' ? S.saved.length : S.saved.filter(x => x.l === c).length) + '</small></button>').join('') + '</nav>';
  h += '<ul class="favlist">' + list.map(x => {
    const L = Core.BY_C[x.l];
    return '<li class="fav"><button class="fopen" data-w="' + esc(x.w) + '" data-l="' + esc(x.l || '') + '">' +
      '<span class="fw" lang="' + esc(x.l || '') + '">' + esc(x.s || x.w) + '</span>' +
      (x.tr ? '<span class="ftr">' + esc(x.tr) + '</span>' : '') +
      (x.g ? '<span class="fg">' + esc(x.g) + '</span>' : '') +
      (x.note ? '<span class="fnote">📝 ' + esc(x.note) + '</span>' : '') +
      '</button><span class="flang">' + (L ? esc(L.n) : '') + '</span>' +
      '<button class="fx" data-unfav="' + esc(x.w) + '" data-ul="' + esc(x.l || '') + '" aria-label="' + t('remove') + '" title="' + t('remove') + '">✕</button>' +
      '<div class="fnoteedit"><button class="linkbtn small" data-noteopen="' + esc(x.w) + '" data-ul="' + esc(x.l || '') + '">' + (x.note ? t('editNote') : t('addNote')) + '</button></div></li>';
  }).join('') + '</ul>';
  h += '<div class="acts"><button class="act" data-copyfavs>⧉ ' + t('copyList') + '</button></div>';
  out.innerHTML = h;
}
document.addEventListener('click', e => {
  const b = e.target.closest('[data-nav],[data-wl],[data-wes],[data-wui],[data-start],[data-ff],[data-unfav],[data-undo],[data-copyfavs]');
  if(!b || b.closest('#set')) return;
  const d = b.dataset;
  if(d.nav === 'home'){ lastRemoved = null; home(); }
  else if(d.nav === 'favs'){ favs(); }
  else if(d.wl){
    const on = new Set(S.langs); on.has(d.wl) ? on.delete(d.wl) : on.add(d.wl);
    if(!on.size) return;
    S.langs = Core.LANGS.map(L => L.c).filter(x => on.has(x)); store.set('langs', S.langs);
    b.classList.toggle('on', on.has(d.wl)); b.setAttribute('aria-pressed', on.has(d.wl));
  }
  else if(d.wes){ S.es = d.wes; store.set('es', S.es); b.parentElement.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); }
  else if(d.wui){ S.ui = d.wui; store.set('ui', S.ui); applyPrefs(); welcome(); }
  else if('start' in d){ store.set('welcomed', true); home(); input.focus(); }
  else if(d.ff){ favFilter = d.ff; lastRemoved = null; favs(); }
  else if(d.unfav !== undefined){
    const i = S.saved.findIndex(x => x.w === d.unfav && (x.l || '') === d.ul);
    if(i < 0) return;
    lastRemoved = {item: S.saved[i], i};
    S.saved.splice(i, 1); store.set('saved', S.saved); favs();
  }
  else if('undo' in d){
    if(lastRemoved){ S.saved.splice(lastRemoved.i, 0, lastRemoved.item); store.set('saved', S.saved); }
    lastRemoved = null; favs();
  }
  else if('copyfavs' in d){
    const list = S.saved.filter(x => favFilter === 'all' || x.l === favFilter);
    const txt = list.map(x => (x.s || x.w) + (x.tr ? ' (' + x.tr + ')' : '') + (x.g ? ' — ' + x.g : '')).join('\n');
    try{ navigator.clipboard.writeText(txt).then(() => { b.textContent = '✓ ' + t('copied'); setTimeout(() => { b.textContent = '⧉ ' + t('copyList'); }, 1400); }, () => {}); }catch(err){}
  }
});

/* ===== small helpers ===== */
function toast(msg){
  let el = $('#toastbar'); if(!el){ el = document.createElement('div'); el.id = 'toastbar'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.textContent = msg; el.classList.add('show'); clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 3600);
}
const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
async function didYouMean(w, my){
  if(!/^[\p{L} '-]+$/u.test(w)) return;
  const list = await Core.suggest(w, S.langs);
  if(my !== token || !$('#didyou')) return;
  const hits = list.filter(x => x.w !== w && x.w.toLowerCase() !== w.toLowerCase() && plain(x.w) === plain(w));
  if(hits.length) $('#didyou').innerHTML = '<div class="didyou">' + t('didYou') + ' ' + hits.slice(0, 2).map(x =>
    '<button class="chip plain" data-w="' + esc(x.w) + '" data-l="' + (x.langs.length === 1 ? x.langs[0].c : '') + '"><b>' + esc(x.w) + '</b>' +
    x.langs.map(l => '<span class="cq">' + esc(langName(l.c)) + '</span>').join('') + '</button>').join(' ') + '?</div>';
}
function seeded(str){ let h = 2166136261; for(const ch of str){ h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; }; }
const gloss = E => { const s0 = E.pos[0] && E.pos[0].senses[0]; return s0 ? s0.html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim().slice(0, 110) : ''; };

/* ===== word of the day ===== */
async function loadWotd(){
  const my = token, day = new Date().toISOString().slice(0, 10);
  let W = store.get('wotd', null);
  if(!W || W.d !== day || !S.langs.includes(W.l)){
    const rnd = seeded(day + S.langs.join());
    const l = S.langs[Math.floor(rnd() * S.langs.length)];
    let res = null;
    try{ res = await Core.randomWord(l, rnd); }catch(e){}
    if(!res) return;
    W = {d: day, l, w: res.w, s: res.E.typed || res.E.word, tr: res.E.tr || '', g: gloss(res.E)};
    store.set('wotd', W);
  }
  const box = $('#wotd'); if(my !== token || !box) return;
  box.innerHTML = '<h2>✨ ' + t('wotd') + ' · ' + esc(langName(W.l)) + '</h2>' +
    '<button class="wotdbtn" data-w="' + esc(W.w) + '" data-l="' + W.l + '"><span class="ww" lang="' + W.l + '">' + esc(W.s) + '</span>' +
    (W.tr ? '<span class="ftr">' + esc(W.tr) + '</span>' : '') + (W.g ? '<span class="fg2">' + esc(W.g) + '</span>' : '') +
    '<span class="go">' + t('open') + ' →</span></button>';
  box.hidden = false;
}
async function surprise(b){
  const l = S.langs[Math.floor(Math.random() * S.langs.length)];
  b.disabled = true; b.innerHTML = '<span class="spin"></span>' + t('loading');
  let res = null; try{ res = await Core.randomWord(l, Math.random); }catch(e){}
  if(res) search(res.w, l, true); else { b.disabled = false; b.textContent = t('surprise'); toast(t('net')); }
}

/* ===== review (flashcards from favourite words) ===== */
let RV = null;
function startReview(){
  const pool = S.saved.filter(x => favFilter === 'all' || x.l === favFilter);
  const q = pool.slice().sort(() => Math.random() - 0.5).slice(0, 10).map(x => ({x, again: false}));
  RV = {q, i: 0, open: false, known: 0, total: q.length};
  view = 'review'; drawReview();
}
function drawReview(){
  window.scrollTo(0, 0);
  const back = '<button class="linkbtn" data-nav="favs">' + t('back') + '</button>';
  if(RV.i >= RV.q.length){
    out.innerHTML = back + '<section class="rcard done"><div class="big">🌿</div><h1>' + t('doneT') + '</h1><p>' +
      t('doneMsg').replace('{n}', RV.total === 1 ? t('word1') : t('wordN').replace('{n}', RV.total)).replace('{k}', RV.known) + '</p><div class="acts center"><button class="act" data-review>🧠 ' + t('reviewMore') + '</button>' +
      '<button class="act" data-nav="favs">' + t('toList') + '</button></div></section>';
    return;
  }
  const {x} = RV.q[RV.i], L = Core.BY_C[x.l];
  out.innerHTML = back + '<div class="rprog"><span style="width:' + Math.round(RV.i / RV.q.length * 100) + '%"></span></div>' +
    '<p class="muted center">' + (RV.i + 1) + ' ' + t('of') + ' ' + RV.q.length + '</p>' +
    '<section class="rcard"><div class="wl">' + (L ? esc(L.n) : '') + '</div><div class="rw" lang="' + esc(x.l || '') + '">' + esc(x.s || x.w) + '</div>' +
    (x.tr ? '<div class="roman">' + esc(x.tr) + '</div>' : '') +
    (RV.open ? '<div class="rans">' + (x.g ? '<p>' + esc(x.g) + '</p>' : '<p class="muted">' + t('noGloss') + '</p>') +
      (x.note ? '<p class="fnote">📝 ' + esc(x.note) + '</p>' : '') + '</div>' +
      '<div class="acts center"><button class="act rk" data-rknew>' + t('knew') + '</button><button class="act ra" data-ragain>' + t('again') + '</button></div>'
    : '<button class="done big" data-rreveal>' + t('reveal') + '</button>') + '</section>';
}

/* ===== notes on favourite words ===== */
function openNote(w, l, li){
  const x = S.saved.find(y => y.w === w && (y.l || '') === l); if(!x) return;
  const box = li.querySelector('.fnoteedit');
  box.innerHTML = '<textarea rows="3" placeholder="' + esc(t('notePh')) + '">' + esc(x.note || '') + '</textarea>' +
    '<button class="act" data-notesave="' + esc(w) + '" data-ul="' + esc(l) + '">' + t('saveNote') + '</button>';
  box.querySelector('textarea').focus();
}

document.addEventListener('click', e => {
  const b = e.target.closest('[data-surprise],[data-enable],[data-review],[data-rreveal],[data-rknew],[data-ragain],[data-noteopen],[data-notesave]');
  if(!b) return;
  const d = b.dataset;
  if('surprise' in d) surprise(b);
  else if(d.enable){ if(!S.langs.includes(d.enable)){ S.langs = Core.LANGS.map(L => L.c).filter(c => c === d.enable || S.langs.includes(c)); store.set('langs', S.langs); } search(d.ew, d.enable); }
  else if('review' in d) startReview();
  else if('rreveal' in d){ RV.open = true; drawReview(); }
  else if('rknew' in d){ if(!RV.q[RV.i].again) RV.known++; RV.i++; RV.open = false; drawReview(); }
  else if('ragain' in d){ const it = RV.q[RV.i]; if(!it.again) RV.q.push({x: it.x, again: true}); RV.i++; RV.open = false; drawReview(); }
  else if(d.noteopen !== undefined) openNote(d.noteopen, d.ul, b.closest('li'));
  else if(d.notesave !== undefined){
    const x = S.saved.find(y => y.w === d.notesave && (y.l || '') === d.ul);
    if(x){ x.note = b.parentElement.querySelector('textarea').value.trim().slice(0, 600); store.set('saved', S.saved); }
    favs();
  }
});
document.addEventListener('keydown', e => {
  if(view !== 'review' || !RV || e.target.matches('input,textarea')) return;
  if(e.key === ' ' && !RV.open){ e.preventDefault(); RV.open = true; drawReview(); }
});

applyPrefs();
if(!store.get('welcomed', false)) welcome();
else if(location.hash.length > 1) search(decodeURIComponent(location.hash.slice(1)));
else home();

if('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) navigator.serviceWorker.register('sw.js').catch(() => {});
