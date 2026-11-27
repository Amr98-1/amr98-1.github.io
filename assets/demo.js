// Live demo inside the hero phone: the sentence is read aloud (each word lights up),
// then a long press opens the full explanation, exactly like the app. Loops over real
// sentences copied from the app's content (B1-0001, A2-0201).
(function () {
  const root = document.getElementById('demo');
  if (!root) return;
  const SENTENCES = [
    {
      head: 'المستوى B1 · الجملة 1', tag: 'B1 · مستوى متوسط',
      words: ['I', 'have', 'been', 'learning', 'English', 'for', 'two', 'years.'], ar: 'أتعلّم الإنجليزية منذ سنتين.',
      x: { tense: 'المضارع التام المستمر', why: 'نشاط بدأ في الماضي وما زال مستمرًا حتى الآن، ونذكر مدته.', structure: 'I + have been + فعل-ing + مفعول + for + مدة.', alt: "I started learning English two years ago, and I'm still learning.", alt_ar: 'بدأتُ تعلّم الإنجليزية قبل سنتين وما زلتُ أتعلّمها.', example: 'She has been learning French for six months.', example_ar: 'تتعلّم الفرنسية منذ ستة أشهر.' }
    },
    {
      head: 'المستوى A2 · الجملة 201', tag: 'A2 · مستوى أساسي',
      words: ["I'm", 'going', 'to', 'visit', 'my', 'grandparents', 'this', 'weekend.'], ar: 'سأزور جدّي وجدتي في عطلة نهاية هذا الأسبوع.',
      x: { tense: 'المستقبل بـ going to', why: 'نتحدث عن خطة قررناها من قبل.', structure: "I'm + going to + فعل + مفعول + this weekend.", alt: 'My plan for this weekend is a visit to my grandparents.', alt_ar: 'خطتي لعطلة هذا الأسبوع زيارة جدّي وجدتي.', example: "We're going to see a film tonight.", example_ar: 'سنشاهد فيلمًا الليلة.' }
    }
  ];
  const HINT = { read: 'تُقرأ الجملة وتُضاء كل كلمة لحظة نطقها', press: 'اضغط مطوّلًا على الجملة لترى شرحها', sheet: 'هكذا بُنيت الجملة، ولماذا قيلت هكذا' };
  const $ = id => document.getElementById(id);
  const screen = root.querySelector('.screen');
  const card = $('dCard'), en = $('dEn'), ar = $('dAr'), sheet = $('dSheet'), body = $('dSheetBody'), finger = $('dFinger'), hint = $('dHint');
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let run = 0, visible = false, i = 0, first = true;

  function load(s) {
    $('dHead').textContent = s.head; $('dTag').textContent = s.tag;
    en.innerHTML = s.words.map(w => `<span class="w">${esc(w)}</span>`).join(' ');
    ar.textContent = s.ar;
    body.innerHTML = [
      ['الزمن', `<p>${s.x.tense}</p>`],
      ['لماذا استُخدم؟', `<p>${s.x.why}</p>`],
      ['تركيب الجملة', `<p class="ltr">${esc(s.x.structure)}</p>`],
      ['صيغة أخرى', `<p class="ltr">${esc(s.x.alt)}</p><p class="sub">${s.x.alt_ar}</p>`],
      ['مثال مشابه', `<p class="ltr">${esc(s.x.example)}</p><p class="sub">${s.x.example_ar}</p>`]
    ].map(([t, h], k) => `<div class="xrow" style="transition-delay:${.15 + k * .09}s"><small>${t}</small>${h}</div>`).join('');
  }
  function aim(el, dx = 0, dy = 0) {
    const s = screen.getBoundingClientRect(), r = el.getBoundingClientRect(), k = s.width / screen.offsetWidth || 1;
    finger.style.left = ((r.left - s.left) / k + r.width / k / 2 + dx) + 'px';
    finger.style.top = ((r.top - s.top) / k + r.height / k / 2 + dy) + 'px';
  }
  const setHint = t => { hint.style.opacity = 0; setTimeout(() => { hint.textContent = t; hint.style.opacity = 1; }, 200); };

  async function play(id) {
    const STOP = {};
    const w8 = async ms => { await sleep(ms); if (id !== run || !visible) throw STOP; };
    try {
      if (first) { first = false; await w8(1800); }   // let the phone finish its entrance first
      while (true) {
        const s = SENTENCES[i % SENTENCES.length];
        load(s); card.classList.add('in'); await w8(60); card.classList.remove('in'); await w8(700);

        // 1) read aloud, word by word
        setHint(HINT.read); card.classList.add('reading');
        const ws = [...en.querySelectorAll('.w')];
        for (const w of ws) { ws.forEach(x => x.classList.remove('now')); w.classList.add('now', 'said'); await w8(Math.max(340, w.textContent.length * 55)); }
        ws.forEach(x => x.classList.remove('now', 'said')); card.classList.remove('reading'); await w8(600);

        // 2) long press on the sentence
        setHint(HINT.press);
        aim(card, 30, 140); finger.classList.add('show'); await w8(80); aim(card, 0, 6); await w8(800);
        finger.classList.add('hold'); card.classList.add('press');
        await w8(1000);
        card.classList.remove('press'); finger.classList.remove('hold', 'show');

        // 3) the explanation
        setHint(HINT.sheet); sheet.classList.add('show'); await w8(6200);
        sheet.classList.remove('show'); await w8(700);

        card.classList.add('out'); await w8(500); card.classList.remove('out');
        i++;
      }
    } catch (e) {
      if (e !== STOP) throw e;
      finger.classList.remove('show', 'hold'); card.classList.remove('press', 'reading');
    }
  }

  load(SENTENCES[0]);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  new IntersectionObserver(es => es.forEach(e => {
    visible = e.isIntersecting; run++;
    if (visible) play(run); else sheet.classList.remove('show');
  }), { threshold: .3 }).observe(root);
})();
