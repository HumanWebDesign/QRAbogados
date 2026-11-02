(function(){
  'use strict';

  var root = document.documentElement;
  var toggle = document.getElementById('navToggle');
  var menu = document.getElementById('mobileMenu');
  var desktopMQ = window.matchMedia('(min-width: 768px)');

  /* ---------- Menú móvil ---------- */
  function setMenu(open){
    if(!toggle || !menu) return;
    menu.classList.toggle('open', open);
    root.classList.toggle('menu-open', open);            // bloquea el scroll del fondo
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  function isOpen(){ return !!menu && menu.classList.contains('open'); }

  if(toggle && menu){
    toggle.addEventListener('click', function(){ setMenu(!isOpen()); });

    // Cierre automático al tocar cualquier enlace del menú (delegado)
    menu.addEventListener('click', function(e){
      if(e.target.closest && e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && isOpen()){ setMenu(false); toggle.focus(); }
    });

    window.addEventListener('hashchange', function(){ if(isOpen()) setMenu(false); });

    // Si se pasa a tablet/escritorio (o se rota el dispositivo), el menú se cierra y se libera el scroll
    var onBreakpoint = function(e){ if(e.matches && isOpen()) setMenu(false); };
    if(desktopMQ.addEventListener) desktopMQ.addEventListener('change', onBreakpoint);
    else if(desktopMQ.addListener) desktopMQ.addListener(onBreakpoint);
  }

  /* ---------- FAQ ---------- */
  var items = document.querySelectorAll('.faq-item');

  function closeItem(item){
    item.classList.remove('open');
    item.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    item.querySelector('.faq-a').style.maxHeight = null;
  }

  items.forEach(function(item, i){
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if(!q || !a) return;
    a.id = a.id || 'faq-a-' + i;
    q.setAttribute('aria-controls', a.id);

    q.addEventListener('click', function(){
      var wasOpen = item.classList.contains('open');
      items.forEach(function(other){ if(other !== item) closeItem(other); });
      if(wasOpen){
        closeItem(item);
      } else {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // Al girar o redimensionar, el texto se reacomoda: recalcula la altura de la respuesta abierta
  var resizeRaf = 0;
  window.addEventListener('resize', function(){
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(function(){
      var open = document.querySelector('.faq-item.open .faq-a');
      if(open) open.style.maxHeight = open.scrollHeight + 'px';
    });
  }, {passive:true});
})();