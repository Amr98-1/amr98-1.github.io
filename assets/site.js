// Fluent website: scroll effects + the Android install guide.
(function () {
  // ---- header border + reveal on scroll ----
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 10);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  document.getElementById('yr').textContent = new Date().getFullYear();

  // ---- WhatsApp links with a ready message ----
  const WA = '201069205811';
  const WA_MSG = 'السلام عليكم، أريد الاشتراك في تطبيق Fluent والحصول على مفتاح التفعيل.';
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = `https://wa.me/${WA}?text=${encodeURIComponent(WA_MSG)}`; });

  // ---- install guides (Android + iPhone) ----
  // A real screen recording at assets/install-<kind>.mp4 is shown instead of the animation when present.
  const modal = document.getElementById('howModal');
  const stage = document.getElementById('howStage');
  const title = document.getElementById('howTitle');
  let player = null;

  async function openGuide(kind) {
    title.textContent = kind === 'ios' ? 'إضافة Fluent إلى شاشة الآيفون' : 'طريقة تثبيت Fluent على أندرويد';
    modal.hidden = false; document.body.style.overflow = 'hidden';
    const video = `assets/install-${kind}.mp4`;
    let hasVideo = false;
    try { hasVideo = (await fetch(video, { method: 'HEAD' })).ok; } catch (_) {}
    if (hasVideo) stage.innerHTML = `<video src="${video}" controls autoplay playsinline></video>`;
    else player = walkthrough(stage, kind === 'ios' ? iosScenes() : androidScenes());
  }
  document.getElementById('howBtn').onclick = () => openGuide('android');
  document.getElementById('howIosBtn').onclick = () => openGuide('ios');
  const close = () => {
    modal.hidden = true; document.body.style.overflow = '';
    if (player) { player.stop(); player = null; }
    stage.innerHTML = '';
  };
  document.getElementById('howClose').onclick = close;
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });

  const icon = 'assets/icon-512.png';

  function iosScenes() {
    const bottomBar = (tapShare) => `
      <div style="flex:1"></div>
      <div style="display:flex;justify-content:space-around;align-items:center;background:#222226;border-radius:14px;padding:8px 4px;font-size:16px;color:#4a9eff">
        <span>‹</span><span>›</span><span ${tapShare ? 'data-tap' : ''} style="font-size:18px">⬆</span><span>📖</span><span>⧉</span></div>`;
    return [
      { cap: 'افتح الموقع من متصفح Safari، ثم اضغط «افتح التطبيق الآن».', html: `
          <div class="vbar">🔒 fluentegy.com</div>
          <div class="vcenter"><img class="vicon" src="${icon}" alt=""><b style="color:#fff">Fluent</b></div>
          <div style="flex:1"></div>
          <span class="vbtn" data-tap>افتح التطبيق الآن</span>
          ${bottomBar(false)}` },
      { cap: 'اضغط زر المشاركة ⬆ أسفل الشاشة. (إن لم تجده، اضغط زر النقاط ··· ثم «مشاركة»).', html: `
          <div class="vbar">🔒 fluentegy.com/app</div>
          <div class="vbox" style="text-align:center"><b class="en">Fluent</b><br>مفتاح التفعيل</div>
          ${bottomBar(true)}` },
      { cap: 'اسحب القائمة إلى الأعلى، واختر «إضافة إلى الشاشة الرئيسية».', html: `
          <div style="flex:1"></div>
          <div class="vbox" style="padding:6px 12px">
            <div style="padding:8px 0;border-bottom:1px solid #333">نسخ</div>
            <div style="padding:8px 0;border-bottom:1px solid #333">إضافة إلى المفضلة ☆</div>
            <div style="padding:8px 0;border-bottom:1px solid #333" data-tap><b>إضافة إلى الشاشة الرئيسية</b> ⊞</div>
            <div style="padding:8px 0">طباعة</div></div>` },
      { cap: 'تأكد أن «فتح كتطبيق ويب» مفعّل، ثم اضغط «إضافة».', html: `
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#4a9eff;padding:2px 4px"><span>إلغاء</span><b style="color:#fff">إضافة إلى الشاشة</b><span data-tap>إضافة</span></div>
          <div class="vbox" style="display:flex;align-items:center;gap:10px"><img src="${icon}" style="width:44px;border-radius:11px" alt=""><div><b class="en">Fluent</b><br><span class="en" style="font-size:11px;color:#888">fluentegy.com</span></div></div>
          <div class="vbox vtoggle on">فتح كتطبيق ويب <i></i></div>` },
      { cap: 'ستظهر أيقونة Fluent على شاشتك. افتحها، وسجّل الدخول، وأدخل مفتاحك. 🎉', html: `
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px 8px;padding:16px 4px;text-align:center;font-size:10px;color:#ddd">
            ${['📷', '🗓', '⚙️', '🧭', '✉️', '🎵', '🗺'].map(e => `<div><div style="width:44px;height:44px;margin:auto;border-radius:11px;background:#2a2a2e;display:grid;place-items:center;font-size:22px">${e}</div></div>`).join('')}
            <div data-tap><img src="${icon}" style="width:44px;height:44px;margin:auto;border-radius:11px" alt=""><span class="en">Fluent</span></div>
          </div>` },
    ];
  }

  function androidScenes() {
    return [
      { cap: 'اضغط زر «تحميل التطبيق» في هذه الصفحة.', html: `
          <div class="vbar">🔒 fluentegy.com</div>
          <div class="vcenter"><img class="vicon" src="${icon}" alt=""><b style="color:#fff">Fluent</b><br>تعلّم الإنجليزية جملةً بعد جملة</div>
          <div style="flex:1"></div>
          <span class="vbtn" data-tap>⬇ تحميل التطبيق</span>
          <span class="vbtn s">▶ طريقة التثبيت</span>` },
      { cap: 'إن ظهرت رسالة تحذير، اضغط «تنزيل على أي حال». الملف آمن وصادر عنّا.', html: `
          <div class="vbar">🔒 fluentegy.com</div>
          <div style="flex:1"></div>
          <div class="vbox"><b>قد يكون هذا الملف ضارًّا</b><br>هل تريد الاحتفاظ بالملف <span class="en">Fluent.apk</span> على أي حال؟
            <div class="vrow" style="margin-top:10px"><span class="vbtn s">إلغاء</span><span class="vbtn g" data-tap>تنزيل على أي حال</span></div></div>` },
      { cap: 'بعد اكتمال التحميل، اضغط «فتح».', html: `
          <div class="vbox" style="display:flex;align-items:center;gap:10px"><img src="${icon}" style="width:34px;border-radius:9px" alt="">
            <div style="flex:1"><b class="en">Fluent.apk</b><br><span style="color:#9a9">اكتمل التنزيل</span></div>
            <span class="vbtn g" style="padding:6px 12px" data-tap>فتح</span></div>` },
      { cap: 'في المرة الأولى فقط: يطلب الهاتف إذنك. اضغط «الإعدادات».', html: `
          <div style="flex:1"></div>
          <div class="vbox"><b>لا يُسمح بالتثبيت</b><br>لأسباب أمنية، لا يُسمح لهاتفك بتثبيت تطبيقات غير معروفة من هذا المصدر.
            <div class="vrow" style="margin-top:10px"><span class="vbtn s">إلغاء</span><span class="vbtn g" data-tap>الإعدادات</span></div></div>` },
      { cap: 'فعّل «السماح من هذا المصدر»، ثم ارجع إلى الخلف.', toggle: true, html: `
          <div class="vbox"><b>تثبيت تطبيقات غير معروفة</b></div>
          <div class="vbox vtoggle" data-tap>السماح من هذا المصدر <i></i></div>
          <div style="flex:1"></div>
          <div class="vcenter" style="font-size:12px;color:#888">⟵ رجوع</div>` },
      { cap: 'اضغط «تثبيت».', html: `
          <div style="flex:1"></div>
          <div class="vbox vcenter"><img class="vicon" style="margin-top:4px" src="${icon}" alt=""><b>Fluent</b><br>هل تريد تثبيت هذا التطبيق؟
            <div class="vrow" style="margin-top:12px"><span class="vbtn s">إلغاء</span><span class="vbtn g" data-tap>تثبيت</span></div></div>` },
      { cap: 'إن ظهرت رسالة «Play Protect»، اضغط «مزيد من التفاصيل» ثم «التثبيت على أي حال».', html: `
          <div style="flex:1"></div>
          <div class="vbox"><b>تطبيق غير معروف</b><br>لم يتعرّف <span class="en">Play Protect</span> على مطوّر هذا التطبيق.
            <div style="color:#8ab4f8;margin:8px 0">مزيد من التفاصيل ⌄</div>
            <span class="vbtn s" data-tap>التثبيت على أي حال</span></div>` },
      { cap: 'انتظر بضع ثوانٍ حتى يكتمل التثبيت، ثم اضغط «فتح».', html: `
          <div class="vbox vcenter" style="flex:1;display:flex;flex-direction:column;justify-content:center"><div class="vok">✓</div><b>تم تثبيت التطبيق</b>
            <div class="vrow" style="margin-top:16px"><span class="vbtn s">تم</span><span class="vbtn g" data-tap>فتح</span></div></div>` },
      { cap: 'أنشئ حسابك أو ادخل كضيف، ثم أدخل مفتاح التفعيل… وابدأ التعلّم! 🎉', html: `
          <div class="vcenter" style="margin-top:20px"><img class="vicon" src="${icon}" alt=""><b style="color:#fff;font-size:18px" class="en">Fluent</b></div>
          <div class="vbox" style="margin-top:14px">مفتاح التفعيل<div class="vbar" style="margin-top:6px;background:#111;color:#ccc">FLU-XXXX-XXXX</div></div>
          <span class="vbtn" data-tap>تفعيل</span>` },
    ];
  }

  // Animated step-by-step "video" with play/pause and a progress bar.
  function walkthrough(root, scenes) {
    const SCENE_MS = 4200;
    const total = scenes.length * SCENE_MS;

    root.innerHTML = `
      <div class="vid">
        <div class="vphone">${scenes.map((s, i) => `<div class="vscene" data-i="${i}">${s.html}</div>`).join('')}<div class="tap"></div></div>
        <div class="vcap"></div>
        <div class="vctrl"><button class="vplay" aria-label="تشغيل/إيقاف">❚❚</button><button class="vre" aria-label="من البداية">↺</button>
          <div class="vprog"><i></i></div><span class="vtime">0:00</span></div>
      </div>`;
    const els = [...root.querySelectorAll('.vscene')];
    const tap = root.querySelector('.tap'), cap = root.querySelector('.vcap');
    const bar = root.querySelector('.vprog i'), time = root.querySelector('.vtime'), play = root.querySelector('.vplay');
    const phone = root.querySelector('.vphone');

    let t = 0, last = performance.now(), playing = true, cur = -1, raf, tapped = false;
    const fmt = ms => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };

    function show(i) {
      cur = i; tapped = false;
      els.forEach((e, k) => e.classList.toggle('on', k === i));
      cap.innerHTML = `<small>الخطوة ${i + 1} من ${scenes.length}</small>${scenes[i].cap}`;
      tap.className = 'tap';
      const target = els[i].querySelector('[data-tap]');
      if (target) {
        const p = phone.getBoundingClientRect(), r = target.getBoundingClientRect();
        tap.style.left = (r.left - p.left + r.width / 2 - 19) + 'px';
        tap.style.top = (r.top - p.top + r.height / 2 - 19) + 'px';
      }
      if (scenes[i].toggle) els[i].querySelectorAll('.vtoggle').forEach(x => x.classList.remove('on'));
    }
    function frame(now) {
      if (playing) { t = Math.min(total, t + (now - last)); }
      last = now;
      const i = Math.min(scenes.length - 1, Math.floor(t / SCENE_MS));
      if (i !== cur) show(i);
      const local = t - i * SCENE_MS;
      if (local > 1300 && !tap.classList.contains('on')) tap.classList.add('on');
      if (local > 2300 && !tapped) {
        tapped = true; tap.classList.add('press');
        if (scenes[i].toggle) els[i].querySelector('.vtoggle').classList.add('on');
        setTimeout(() => tap.classList.remove('press'), 250);
      }
      bar.style.width = (t / total * 100) + '%';
      time.textContent = `${fmt(t)} / ${fmt(total)}`;
      if (t >= total && playing) { playing = false; play.textContent = '▶'; }
      raf = requestAnimationFrame(frame);
    }
    play.onclick = () => {
      if (t >= total) t = 0;
      playing = !playing; play.textContent = playing ? '❚❚' : '▶';
    };
    root.querySelector('.vre').onclick = () => { t = 0; cur = -1; playing = true; play.textContent = '❚❚'; };
    root.querySelector('.vprog').onclick = e => {
      const r = e.currentTarget.getBoundingClientRect();
      t = (e.clientX - r.left) / r.width * total; cur = -1;
    };
    raf = requestAnimationFrame(frame);
    return { stop: () => cancelAnimationFrame(raf) };
  }
})();
