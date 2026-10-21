// Оболочка продукта: левое меню, шапка, общие детали, переход между экранами.
// Маршруты – простые якоря (#admin, #site, #site-plan …): так требует страница-артефакт.
(function () {
  const D = window.PROTO;
  const UI = (window.UI = {});
  const state = (window.PROTO_STATE = {
    qi: 0, articleAnswered: false, autopilot: false, provider: "RouterAI", pace: 3,
    approved: false, clientAnswered: false, artFilter: "all", switcherOpen: false, protoOpen: false, menuOpen: false
  });

  UI.esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  UI.icon = (n, cls) => `<i data-lucide="${n}" class="${cls || "ic"}" aria-hidden="true"></i>`;
  UI.dot = (k) => `<span class="dot ${k}" aria-hidden="true"></span>`;
  UI.chip = (text, k) => `<span class="chip">${k ? UI.dot(k) : ""}${text}</span>`;
  UI.segs = (states) => `<span class="segs" aria-hidden="true">${states.map((s) => `<i class="${s}"></i>`).join("")}</span>`;
  UI.avatar = (letter) => `<span class="avatar" aria-hidden="true">${UI.esc(letter)}</span>`;
  UI.stats = (list) => `<div class="stats">${list.map(([n, t]) => `<div class="stat"><b>${n}</b><span>${t}</span></div>`).join("")}</div>`;
  UI.head = (title, sub, actions) => `<div class="page-head"><div class="t"><h1>${title}</h1>${sub ? `<p class="sub">${sub}</p>` : ""}</div>${actions ? `<div class="head-actions">${actions}</div>` : ""}</div>`;
  UI.card = (title, iconName, body, extra) => `<section class="card"><div class="card-h"><h2>${iconName ? UI.icon(iconName, "ic-s") : ""}${title}</h2>${extra || ""}</div>${body}</section>`;

  const STATE_TEXT = { done: "готово", now: "завод работает здесь", wait: "нужен человек", future: "впереди" };
  UI.siteStates = ["done", "done", "done", "done", "now", "done", "done", "done", "future"];
  UI.st = (id) => D.stations.find((s) => s.id === id) || D.stations[0]; // станция по id, а не по номеру
  UI.flow = (states) => `<ol class="flow" aria-label="Конвейер сайта">${D.stations.map((s, i) => {
    const st = states[i] || "future";
    const ic = st === "done" ? "check" : s.icon;
    return `<li class="${st}"><a href="#site-${s.id}"><span class="node">${UI.icon(ic, "ic-s")}</span><b>${s.name}</b><span>${STATE_TEXT[st]}</span></a></li>`;
  }).join("")}</ol>`;

  // ---------- левое меню ----------
  function navItem(href, iconName, text, cur, end) {
    return `<a href="#${href}"${cur === href ? ' aria-current="page"' : ""}>${iconName}<span class="grow">${text}</span>${end || ""}</a>`;
  }
  function sideOwner(cur) {
    const site = D.sites[0];
    const stations = D.stations.map((s, i) => navItem(`site-${s.id}`, UI.icon(s.icon), s.name, cur, `<span class="st-mark ${UI.siteStates[i]}" title="${STATE_TEXT[UI.siteStates[i]]}"></span>`)).join("");
    return `<div class="side-main">
      <a class="logo" href="#admin"><span class="logo-mark"><i></i></span>SEO-завод</a>
      <button class="switcher" type="button" id="switcher" aria-expanded="${state.switcherOpen}">
        ${UI.avatar("С")}<span class="who"><b>${UI.esc(site.domain)}</b><span>${UI.esc(site.verdictText)}</span></span>${UI.icon("chevrons-up-down", "ic-s")}
      </button>
      <div class="dropdown" ${state.switcherOpen ? "" : "hidden"}>
        ${D.sites.map((s) => `<a href="#site">${UI.dot(s.verdict)}<span>${UI.esc(s.domain)}</span></a>`).join("")}
        <a href="#admin-add">${UI.icon("plus", "ic-s")}<span>Добавить сайт</span></a>
      </div>
      <nav class="nav" aria-label="Сайт">
        ${navItem("site", UI.icon("layout-dashboard"), "Обзор", cur)}
        ${navItem("site-wait", UI.icon("inbox"), "Ждёт вас", cur, `<span class="count">2</span>`)}
        ${navItem("site-report", UI.icon("chart-line"), "Отчёт", cur)}
        ${navItem("site-about", UI.icon("settings-2"), "О сайте", cur)}
        <div class="nav-label">Конвейер</div>
        ${stations}
        <div class="nav-label">Завод</div>
        ${navItem("admin", UI.icon("building-2"), "Все сайты", cur)}
        ${navItem("admin-models", UI.icon("key-round"), "Модели и ключи", cur)}
        ${navItem("admin-money", UI.icon("wallet"), "Расход", cur)}
        ${navItem("admin-factory", UI.icon("server"), "Здоровье завода", cur)}
      </nav></div>
      <div class="side-foot">
        <a class="foot-link" href="#client">${UI.icon("eye")}Смотреть как клиент</a>
        <div class="user">${UI.avatar("В")}<span class="grow">Владелец<br><span class="small muted">все сайты завода</span></span>
          <a class="icon-btn" href="#login" aria-label="Выйти">${UI.icon("log-out", "ic-s")}</a></div>
      </div>`;
  }
  function sideClient(cur) {
    const C = D.client;
    return `<div class="side-main">
      <div class="logo">${UI.avatar("К")}<span style="font:500 15px/1.2 var(--f-ui);letter-spacing:0">${UI.esc(C.name)}<br><span class="small muted" style="font-weight:400">${UI.esc(C.city)} · с SEO-заводом</span></span></div>
      <nav class="nav" aria-label="Кабинет клиента">
        ${navItem("client", UI.icon("house"), "Главное", cur)}
        ${navItem("client-article", UI.icon("file-text"), "На согласование", cur, `<span class="count">2</span>`)}
        ${navItem("client-questions", UI.icon("message-square"), "Вопросы", cur, `<span class="count">1</span>`)}
        ${navItem("client-report", UI.icon("chart-line"), "Отчёт", cur)}
      </nav></div>
      <div class="side-foot">
        <a class="foot-link" href="#admin">${UI.icon("arrow-left")}Вернуться в админку</a>
        <div class="user">${UI.avatar("И")}<span class="grow">Ильдар<br><span class="small muted">владелец сайта</span></span>
          <a class="icon-btn" href="#login" aria-label="Выйти">${UI.icon("log-out", "ic-s")}</a></div>
      </div>`;
  }
  function tabbar(cur) {
    const t = [["client", "house", "Главное"], ["client-article", "file-text", "Согласовать"], ["client-questions", "message-square", "Вопросы"], ["client-report", "chart-line", "Отчёт"]];
    return `<nav class="tabbar" aria-label="Разделы">${t.map(([h, i, n]) => `<a href="#${h}"${cur === h ? ' aria-current="page"' : ""}>${UI.icon(i)}${n}</a>`).join("")}</nav>`;
  }

  // ---------- оболочка экрана ----------
  UI.shell = (role, cur, crumbs, body) => {
    const pw = role === "owner" ? `<div class="pw-bar">${UI.icon("info", "ic-s")}<span>Пароль простой – смените его до того, как вставите ключи сервисов. <a href="#admin-models">Сменить пароль</a></span></div>` : "";
    const crumbHtml = crumbs.map((c, i) => (i < crumbs.length - 1 ? `<a href="#${c[1]}">${UI.esc(c[0])}</a>${UI.icon("chevron-right", "ic-s")}` : `<b>${UI.esc(c[0])}</b>`)).join("");
    return `<div class="app ${role === "client" ? "client" : ""}">
      <aside class="side${state.menuOpen ? " open" : ""}" id="side">${role === "client" ? sideClient(cur) : sideOwner(cur)}</aside>
      <div class="main">
        <header class="topbar">
          <button class="icon-btn menu-btn" type="button" id="menuBtn" aria-label="Меню">${UI.icon("menu")}</button>
          <div class="crumbs">${crumbHtml}</div>
          <button class="proto-badge" type="button" id="protoBtn" aria-expanded="${state.protoOpen}">Прототип<span class="wide"> · данные – пример</span></button>
          <div class="dropdown proto-menu" ${state.protoOpen ? "" : "hidden"}>
            <a href="#admin">Админка: все сайты</a><a href="#login">Экран входа</a><a href="#admin-empty">Первый вход – сайтов нет</a>
            <a href="#site-questions">Анкета</a><a href="#client">Кабинет клиента</a>
          </div>
        </header>${pw}
        <main class="page" id="page">${body}</main>
      </div>${role === "client" ? tabbar(cur) : ""}</div>`;
  };

  // ---------- переход между экранами ----------
  const app = document.getElementById("app");
  window.PROTO_RENDER = () => {
    const key = (location.hash || "#site").slice(1);
    const screens = window.SCREENS;
    if (!screens) return; // экраны ещё грузятся – нарисуем, когда дойдёт очередь
    app.innerHTML = (screens[key] || screens.site)();
    if (window.lucide) window.lucide.createIcons();
    if (window.PROTO_BIND) window.PROTO_BIND(key);
  };
  window.addEventListener("hashchange", () => {
    state.switcherOpen = false; state.protoOpen = false; state.menuOpen = false;
    window.PROTO_RENDER(); window.scrollTo(0, 0);
  });
})();
