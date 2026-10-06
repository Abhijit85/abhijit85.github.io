// Theme toggle, publication filters, BibTeX copy
(function () {
  var root = document.documentElement;

  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = root.getAttribute('data-theme') ||
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      var next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }


  // Fig. 1: pointing at a source or end box redraws the highlighted route through it
  var route = document.getElementById('route');
  if (route) {
    var tail = ' M800 120 C815 120 815 57 830 57';
    var paths = {
      top: 'M180 120 C240 120 240 37 300 37 M530 37 C565 37 565 120 600 120' + tail,
      mid: 'M180 120 L300 120 M530 120 L600 120' + tail,
      bot: 'M180 120 C240 120 240 203 300 203 M530 203 C565 203 565 120 600 120' + tail,
      abstain: 'M180 120 L300 120 M530 120 L600 120 M800 120 C815 120 815 183 830 183'
    };
    var svg = route.ownerSVGElement;
    var nodes = svg.querySelectorAll('.node');
    var current = 'mid';
    function show(key) {
      if (!paths[key] || key === current) return;
      current = key;
      route.setAttribute('d', paths[key]);
      route.style.animation = 'none'; void route.getBoundingClientRect(); route.style.animation = '';
      nodes.forEach(function (n) {
        var r = n.getAttribute('data-route'), e = n.getAttribute('data-end');
        var on = r === key || (e === 'answer' && key !== 'abstain') ||
                 (key !== 'top' && key !== 'bot' && r === 'mid');
        if (r === 'check') on = false;
        n.classList.toggle('on', on);
      });
    }
    nodes.forEach(function (n) {
      var r = n.getAttribute('data-route');
      if (!r || r === 'check') return;
      n.addEventListener('mouseenter', function () { show(r); });
      n.addEventListener('focus', function () { show(r); });
    });
  }

  var buttons = document.querySelectorAll('.filters button');
  var pubs = document.querySelectorAll('.pub');
  var count = document.querySelector('.pub-count');

  function apply(filter) {
    var shown = 0;
    pubs.forEach(function (p) {
      var tags = (p.getAttribute('data-tags') || '').split(' ');
      var on = filter === 'all' || tags.indexOf(filter) !== -1;
      p.hidden = !on;
      if (on) shown++;
    });
    document.querySelectorAll('.pub-year').forEach(function (y) {
      y.hidden = !y.querySelector('.pub:not([hidden])');
    });
    if (count) count.textContent = filter === 'all' ? '' : shown + ' of ' + pubs.length + ' papers';
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      buttons.forEach(function (o) { o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      apply(b.getAttribute('data-filter'));
    });
  });

  document.querySelectorAll('.copy[data-target]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.getElementById(btn.getAttribute('data-target'));
      if (!el || !navigator.clipboard) return;
      navigator.clipboard.writeText(el.textContent.trim()).then(function () {
        btn.textContent = 'Copied';
        setTimeout(function () { btn.textContent = 'Copy BibTeX'; }, 1600);
      });
    });
  });
})();
