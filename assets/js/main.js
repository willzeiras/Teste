/* ==========================================================================
   Eleve Makers — main.js
   Rotator do título, navegação, menu móvel, contadores, acordeões, abas de
   soluções, FAQ, formulário de diagnóstico e links de WhatsApp.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- CONFIGURAÇÃO (edite aqui) ---------- */
  var CONFIG = {
    // Número do WhatsApp comercial no formato internacional, só dígitos (55 + DDD + número).
    whatsapp: '5500000000000',
    // Mensagem inicial ao clicar no WhatsApp.
    whatsappGreeting: 'Olá! Vim pelo site da Eleve Makers e quero um diagnóstico do meu escritório.',
    // Endpoint opcional para receber o formulário (ex.: webhook do CRM, Formspree, Make, n8n).
    // Deixe vazio para abrir o WhatsApp com os dados preenchidos.
    formEndpoint: '',
    // Palavras que giram no título do hero.
    rotatorWords: [
      'escritórios de arquitetura.',
      'design de interiores.',
      'construtoras e incorporadoras.',
      'marcenarias e planejados.',
      'engenharia e reformas.',
      'lojas de acabamentos.',
      'paisagismo.'
    ],
    rotatorInterval: 2600
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- WhatsApp: aplica número em todos os links ---------- */
  function waLink(text) {
    var base = 'https://wa.me/' + CONFIG.whatsapp;
    return text ? base + '?text=' + encodeURIComponent(text) : base;
  }
  document.querySelectorAll('[data-whatsapp]').forEach(function (a) {
    a.href = waLink(CONFIG.whatsappGreeting);
  });

  /* ---------- Ano no rodapé ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Rotator do título ---------- */
  var word = document.getElementById('rotatorWord');
  var ghost = document.querySelector('.rotator-ghost');
  if (word && CONFIG.rotatorWords.length > 1) {
    // O "ghost" reserva a largura da maior palavra para o layout não pular.
    if (ghost) {
      var longest = CONFIG.rotatorWords.reduce(function (a, b) { return b.length > a.length ? b : a; });
      ghost.textContent = longest;
    }
    var i = 0;
    function next() {
      i = (i + 1) % CONFIG.rotatorWords.length;
      if (reduceMotion) { word.textContent = CONFIG.rotatorWords[i]; return; }
      word.classList.add('is-out');
      setTimeout(function () {
        word.textContent = CONFIG.rotatorWords[i];
        word.classList.remove('is-out');
        word.classList.add('is-in');
        // força reflow para a transição de entrada rodar
        void word.offsetWidth;
        word.classList.remove('is-in');
      }, 360);
    }
    setInterval(next, CONFIG.rotatorInterval);
  }

  /* ---------- Navegação: estado ao rolar e esconder ao descer ---------- */
  var nav = document.getElementById('nav');
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle('is-scrolled', y > 24);
      var goingDown = y > lastY && y > 160;
      nav.classList.toggle('is-hidden', goingDown);
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menu móvel ---------- */
  var sheet = document.getElementById('navSheet');
  var burger = document.getElementById('navBurger');
  var closeBtn = document.getElementById('navClose');
  function openSheet() {
    if (!sheet) return;
    sheet.classList.add('is-open');
    sheet.setAttribute('aria-hidden', 'false');
    burger && burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }
  function closeSheet() {
    if (!sheet) return;
    sheet.classList.remove('is-open');
    sheet.setAttribute('aria-hidden', 'true');
    burger && burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    burger && burger.focus();
  }
  burger && burger.addEventListener('click', openSheet);
  closeBtn && closeBtn.addEventListener('click', closeSheet);
  sheet && sheet.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeSheet); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && sheet && sheet.classList.contains('is-open')) closeSheet();
  });

  /* ---------- Contadores (stats) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;
    function fmt(n) {
      return prefix + n.toFixed(decimals).replace('.', ',') + suffix;
    }
    if (reduceMotion) { el.textContent = fmt(target); return; }
    el.textContent = fmt(0);
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { io.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Acordeão do método (um aberto por vez) ---------- */
  var methodAcc = document.getElementById('methodAccordion');
  if (methodAcc) {
    var heads = methodAcc.querySelectorAll('.acc-head');
    heads.forEach(function (h) {
      h.addEventListener('click', function () {
        var open = h.getAttribute('aria-expanded') === 'true';
        heads.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
        h.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    });
  }

  /* ---------- Abas de soluções (desktop) ---------- */
  var tabsRoot = document.getElementById('solTabs');
  if (tabsRoot) {
    var tabs = Array.prototype.slice.call(tabsRoot.querySelectorAll('.tab'));
    var panels = Array.prototype.slice.call(tabsRoot.querySelectorAll('.panel'));
    function selectTab(idx) {
      tabs.forEach(function (t, k) {
        var on = k === idx;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
      });
      panels.forEach(function (p, k) {
        var on = k === idx;
        p.hidden = !on;
        p.classList.toggle('is-on', on);
        if (on) {
          // reinicia a animação de entrada
          p.style.animation = 'none';
          void p.offsetWidth;
          p.style.animation = '';
        }
      });
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { selectTab(k); });
      t.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (k + 1) % tabs.length;
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (k - 1 + tabs.length) % tabs.length;
        if (n !== null) { e.preventDefault(); selectTab(n); tabs[n].focus(); }
      });
    });
    // itens dentro de cada painel: um aberto por vez
    panels.forEach(function (p) {
      var items = p.querySelectorAll('.pitem');
      items.forEach(function (it) {
        it.addEventListener('click', function () {
          var open = it.getAttribute('aria-expanded') === 'true';
          items.forEach(function (o) { o.setAttribute('aria-expanded', 'false'); });
          it.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      });
    });
  }

  /* ---------- Soluções no mobile (acordeão) ---------- */
  var solMobile = document.getElementById('solMobile');
  if (solMobile) {
    var sheads = solMobile.querySelectorAll('.shead');
    sheads.forEach(function (h) {
      h.addEventListener('click', function () {
        var open = h.classList.contains('is-on');
        sheads.forEach(function (o) { o.classList.remove('is-on'); o.setAttribute('aria-expanded', 'false'); });
        if (!open) { h.classList.add('is-on'); h.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ---------- FAQ: fecha os outros ao abrir um ---------- */
  var faqItems = document.querySelectorAll('.faq-list details');
  faqItems.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqItems.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Formulário de diagnóstico ---------- */
  var form = document.getElementById('leadForm');
  if (form) {
    var errorBox = document.getElementById('formError');
    var successBox = document.getElementById('formSuccess');

    function validate() {
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (f) {
        var valid = f.value.trim() !== '' && (f.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value));
        f.classList.toggle('is-invalid', !valid);
        if (!valid) ok = false;
      });
      return ok;
    }

    function payload() {
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
      data.origem = 'elevemakers.com';
      data.enviado_em = new Date().toISOString();
      return data;
    }

    function summary(d) {
      return [
        'Pedido de diagnóstico (site Eleve Makers)',
        'Nome: ' + d.nome,
        'Escritório: ' + d.empresa,
        'Segmento: ' + d.segmento,
        'Faturamento: ' + d.faturamento,
        'Interesse: ' + d.interesse,
        'E-mail: ' + d.email,
        'WhatsApp: ' + d.whatsapp,
        d.mensagem ? 'Desafio: ' + d.mensagem : ''
      ].filter(Boolean).join('\n');
    }

    function done() {
      form.classList.add('is-sent');
      successBox.hidden = false;
      successBox.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      if (window.dataLayer) window.dataLayer.push({ event: 'lead_diagnostico' });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      errorBox.hidden = true;
      if (!validate()) { errorBox.hidden = false; return; }
      var data = payload();
      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;

      if (CONFIG.formEndpoint) {
        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          done();
        }).catch(function () {
          // fallback: abre o WhatsApp com o resumo
          window.open(waLink(summary(data)), '_blank', 'noopener');
          done();
        }).finally(function () { btn.disabled = false; });
      } else {
        window.open(waLink(summary(data)), '_blank', 'noopener');
        done();
        btn.disabled = false;
      }
    });

    form.querySelectorAll('[required]').forEach(function (f) {
      f.addEventListener('input', function () { f.classList.remove('is-invalid'); });
    });
  }
})();
