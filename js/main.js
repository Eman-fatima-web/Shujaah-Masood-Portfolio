(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  window.lucide && lucide.createIcons();
  $('#yr').textContent = new Date().getFullYear();

  // Theme
  $('#theme').onclick = () => {
    const t = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  };

  // Mobile menu
  const menu = $('#menu'), burger = $('#burger');
  const setMenu = o => { menu.classList.toggle('open', o); burger.setAttribute('aria-expanded', o); };
  burger.onclick = () => setMenu(!menu.classList.contains('open'));
  $$('#menu a').forEach(a => a.onclick = () => setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Scroll progress + active link
  const prog = $('#progress'), links = $$('#menu a');
  addEventListener('scroll', () => {
    const h = root.scrollHeight - innerHeight;
    prog.style.width = (scrollY / h * 100) + '%';
  }, { passive: true });
  const secs = ['home','about','skills','projects','services','ai','contact'].map(id => $('#' + id));
  new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50%' }).observe && secs.forEach(s => s && new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50%' }).observe(s));

  // Reveal, counters, skill bars
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target; el.classList.add('in'); io.unobserve(el);
    $$('.bar', el).forEach(b => b.style.setProperty('--w', b.dataset.v + '%'));
    $$('[data-count]', el).forEach(c => {
      const end = +c.dataset.count, t0 = performance.now();
      const tick = t => { const p = Math.min((t - t0) / 1400, 1); c.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + c.dataset.suffix; p < 1 && requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });

  // Typing effect
  const words = ['Full-Stack Developer', 'Flutter & Mobile Developer', 'AI & Chatbot Developer', 'WordPress Expert'];
  const out = $('#typed'); let w = 0, c = 0, del = false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) out.textContent = words.join(' · ');
  else (function type() {
    out.textContent = words[w].slice(0, c);
    if (!del && c === words[w].length) { del = true; return setTimeout(type, 1500); }
    if (del && c === 0) { del = false; w = (w + 1) % words.length; }
    c += del ? -1 : 1; setTimeout(type, del ? 35 : 75);
  })();

  // Project filter
  $$('.filters button').forEach(b => b.onclick = () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('.proj').forEach(p => p.classList.toggle('hide', b.dataset.f !== 'all' && p.dataset.t !== b.dataset.f));
  });

  // Contact form: Netlify Forms (default) or Formspree
  const form = $('#form'), st = $('#status');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    let ok = true;
    $$('input[required],textarea[required]', form).forEach(f => {
      const bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('err', bad); ok = ok && !bad;
    });
    st.className = 'status';
    if (!ok) { st.classList.add('bad'); st.textContent = 'Please fill in all fields correctly.'; return; }
    const btn = $('button', form), label = $('span', btn);
    btn.disabled = true; label.textContent = 'Sending...';
    const fs = (window.SITE_CONFIG || {}).FORMSPREE_ENDPOINT;
    try {
      const data = new FormData(form);
      const res = fs
        ? await fetch(fs, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
        : await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(data).toString() });
      if (!res.ok) throw 0;
      form.reset(); st.classList.add('ok'); st.textContent = 'Thank you! Your message was sent. I will reply soon.';
    } catch (_) {
      st.classList.add('bad'); st.textContent = 'Could not send. Works after deploying to Netlify. Or email aries3672@gmail.com.';
    }
    btn.disabled = false; label.textContent = 'Send Message';
  });
})();
