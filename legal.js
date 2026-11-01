/* ---------- VISTA LEGAL: AGREGAR AL FINAL DE script.js ---------- */
(function(){
  var legal = document.getElementById('legal');
  if(!legal) return;
  var isPage = legal.classList.contains('legal-page');
  var main = document.getElementById('legalMain');
  var toc = document.getElementById('legalToc');
  var tabs = legal.querySelectorAll('[data-tab]');
  var closeBtn = document.getElementById('legalClose');
  var EMAIL = 'contacto@qrabogados.cl';
  var current = 'terminos';
  var lastFocus = null;
  var lastActive = -1;
  var behavior = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  // hash -> [pestaña, id de sección a mostrar]
  var routes = { terminos:['terminos'], privacidad:['privacidad'], derechos:['privacidad','derechos'] };

  function setTab(name){
    current = name;
    tabs.forEach(function(t){
      var on = t.dataset.tab === name;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      document.getElementById('panel-' + t.dataset.tab).hidden = !on;
    });
    buildToc();
    main.scrollTop = 0;
  }

  function buildToc(){
    lastActive = -1;
    toc.innerHTML = '';
    document.querySelectorAll('#panel-' + current + ' .lg-sec').forEach(function(sec){
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + sec.id;
      a.textContent = sec.dataset.toc;
      a.addEventListener('click', function(e){
        e.preventDefault();
        sec.scrollIntoView({behavior:behavior, block:'start'});
      });
      li.appendChild(a); toc.appendChild(li);
    });
    spy();
  }

  function spy(){
    var secs = document.querySelectorAll('#panel-' + current + ' .lg-sec');
    var top = main.getBoundingClientRect().top + 90, active = 0;
    secs.forEach(function(s, i){ if(s.getBoundingClientRect().top <= top) active = i; });
    var links = toc.querySelectorAll('a');
    links.forEach(function(a, i){ a.classList.toggle('active', i === active); });
    // En móvil el índice es una fila de chips: centra el activo
    if(active !== lastActive && links[active] && toc.scrollWidth > toc.clientWidth){
      toc.scrollTo({left: links[active].offsetLeft - (toc.clientWidth - links[active].offsetWidth) / 2, behavior:behavior});
    }
    lastActive = active;
  }
  main.addEventListener('scroll', spy, {passive:true});

  function open(key){
    var r = routes[key]; if(!r) return;
    if(!isPage && legal.hidden){
      lastFocus = document.activeElement;
      legal.hidden = false;
      void legal.offsetWidth;
      legal.classList.add('show');
      document.body.classList.add('legal-open');
    }
    setTab(r[0]);
    if(r[1]){
      var target = document.getElementById(r[1]);
      if(target) setTimeout(function(){ target.scrollIntoView({behavior:behavior, block:'start'}); }, 60);
    }
    if(!isPage) closeBtn.focus({preventScroll:true});
  }

  function close(){
    legal.classList.remove('show');
    document.body.classList.remove('legal-open');
    setTimeout(function(){ legal.hidden = true; }, 240);
    history.replaceState(null, '', location.pathname + location.search);
    if(lastFocus && lastFocus.focus) lastFocus.focus({preventScroll:true});
  }

  function route(){
    var key = location.hash.slice(1);
    if(routes[key]) open(key);
    else if(isPage) open('terminos');
    else if(!legal.hidden && !key) close();
  }
  window.addEventListener('hashchange', route);
  route();

  if(!isPage) closeBtn.addEventListener('click', close);
  document.addEventListener('keydown', function(e){
    if(!isPage && e.key === 'Escape' && !legal.hidden) close();
  });

  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      setTab(t.dataset.tab);
      history.replaceState(null, '', '#' + t.dataset.tab);
    });
  });

  // Derechos ARSOP: abre un correo ya redactado
  legal.querySelectorAll('.arsop-card').forEach(function(card){
    card.addEventListener('click', function(){
      var right = card.dataset.right;
      var subject = 'Ejercicio del derecho de ' + right + ' (Ley N° 21.719)';
      var body = 'Estimados QR Abogados:\n\nEn mi calidad de titular de datos personales, ejerzo mi derecho de ' + right +
        ': ' + card.dataset.desc + '\n\nNombre completo:\nRUT:\nDatos o tratamiento al que se refiere mi solicitud:\n\nQuedo atento/a a su respuesta dentro del plazo legal.\n\nSaludos.';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  });
})();
