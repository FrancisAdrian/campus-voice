(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  function apply(t) {
    root.setAttribute('data-theme', t);
    if (btn) { btn.textContent = t === 'dark' ? '☀ Light' : '☾ Dark'; btn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' mode'); }
  }
  apply(root.getAttribute('data-theme') || 'light');
  if (btn) btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', next); } catch (e) {}
    apply(next);
  });
  // live character counters: <textarea data-counter="id" maxlength=...>
  document.querySelectorAll('[data-counter]').forEach(function (el) {
    var out = document.getElementById(el.dataset.counter);
    function upd() { out.textContent = el.value.length + ' / ' + el.getAttribute('maxlength'); }
    el.addEventListener('input', upd); upd();
  });
  // client-side required check (server validates again)
  document.querySelectorAll('form[data-validate]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var bad = Array.prototype.some.call(f.querySelectorAll('[required]'), function (i) { return !i.value.trim(); });
      var box = f.querySelector('.client-error');
      if (bad) { e.preventDefault(); box.hidden = false; } else { box.hidden = true; }
    });
  });
})();
