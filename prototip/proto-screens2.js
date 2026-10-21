// Экраны прототипа, часть 2: план, статьи, проверка, выкладка, отчёт, «О сайте», кабинет клиента.
(function () {
  const D = window.PROTO, U = window.UI, S = window.PROTO_STATE;
  const e = U.esc, ic = U.icon, owner = window.UI_OWNER, client = window.UI_CLIENT, siteCrumbs = window.UI_SITECRUMBS;

  function sitePlan() {
    const actions = S.approved
      ? `<a class="btn primary" href="#site-articles">Что дальше</a><button class="btn" type="button" id="suggest">${ic("plus", "ic-s")}Предложить тему</button>`
      : `<button class="btn primary" type="button" id="approvePlan">${ic("check", "ic-s")}Всё верно — начинаем</button><button class="btn" type="button" id="suggest">${ic("plus", "ic-s")}Предложить тему</button>`;
    const whenChip = { "Сначала": "ink", "Потом": "", "Позже": "" };
    return owner("site-plan", siteCrumbs("План"), `${U.head(S.approved ? "План принят — завод пишет" : "Вот первые страницы плана", "У каждой написано, зачем она нужна. Тип и порядок решает завод — вам остаётся согласиться или поправить.", actions)}
      <section class="card card-b" id="suggestBox" hidden style="max-width:620px"><div class="field"><label for="sg">О чём написать?</label><input id="sg" placeholder="например: как выбрать SEO-подрядчика"></div>
        <div class="err" id="sgErr"></div><div class="head-actions"><button class="btn primary" type="button" id="sgCheck">${ic("search", "ic-s")}Проверить тему</button></div></section>
      <section class="card" style="border-color:var(--ink)"><div class="card-h"><h2>${ic("git-merge", "ic-s")}Две страницы мешают друг другу</h2>${U.chip("нужно ваше «ок»", "need")}</div>
        <div class="card-b"><p class="why">«Цены» и «Тарифы» отвечают на один вопрос. Оставить «Цены», а «Тарифы» перенаправить на неё?</p>
        <div class="head-actions"><button class="btn primary sm" type="button">Объединить</button><button class="btn ghost sm" type="button">Оставить как есть</button></div></div></section>
      <section class="card"><div class="card-h"><h2>${ic("list-checks", "ic-s")}Ближайшие темы</h2><span class="small muted">первые 5 из 42 · тем хватит на 38 дней</span></div>
        <div class="rows">${D.plan.map((t) => `<div class="rowi"><span class="ic-wrap">${ic(t.type === "Услуга" ? "briefcase" : t.type === "Цена" ? "wallet" : t.type === "Выбор" ? "scale" : "book-open", "ic-s")}</span>
          <div class="body"><b>${e(t.title)}</b><span>${t.type} · ${t.act}. ${e(t.why)}</span></div>
          <div class="end"><span class="chip${whenChip[t.when] ? " ink" : ""}">${t.when}</span></div></div>`).join("")}</div></section>`);
  }

  function siteArticles() {
    const statusDot = { "Ждёт «ок»": "need", "На сайте": "ok", "Пишется": "", "На проверке": "" };
    const f = S.artFilter || "all", only = { wait: "Ждёт «ок»", live: "На сайте" }[f];
    const list = D.articles.filter((a) => !only || a.status === only);
    const fb = (k, t) => `<button type="button" data-af="${k}" aria-pressed="${f === k}">${t}</button>`;
    return owner("site-articles", siteCrumbs("Статьи"), `${U.head("Пишутся 3 статьи, 2 ждут вашего «ок»", D.stations[3].hint + ".", `<a class="btn primary" href="#site-article">Посмотреть статьи, которые ждут «ок»</a>`)}
      <section class="card"><div class="card-h"><h2>${ic("file-text", "ic-s")}Статьи</h2>
        <div class="seg" role="group" aria-label="Показать">${fb("all", "Все")}${fb("wait", "Ждут «ок»")}${fb("live", "На сайте")}</div></div>
        <div class="rows">${list.map((a) => `<a class="rowi" href="#site-article"><span class="ic-wrap">${ic("file-text", "ic-s")}</span>
          <div class="body"><b>${e(a.title)}</b><span>${e(a.why)}</span></div><div class="end">${U.chip(a.status, statusDot[a.status] || "")}${ic("chevron-right", "ic-s")}</div></a>`).join("")}</div></section>`);
  }

  function articleView(isClient) {
    const A = isClient ? D.articleClient : D.articleOwn, ok = S.articleAnswered;
    const verdict = ok
      ? `<div class="verdict-box"><span class="ic-wrap" style="color:var(--ok)">${ic("circle-check")}</span><div><b>Готова к печати.</b><p class="sub">Цена сверена с вашим ответом, повторов с другими страницами нет.</p></div></div>`
      : `<div class="verdict-box"><span class="ic-wrap" style="color:var(--ink)">${ic("circle-alert")}</span><div><b>Нужно ваше слово.</b><p class="sub">В статье была цена, которой нет в ваших данных. Завод убрал её и спрашивает.</p></div></div>`;
    const approve = ok ? `<button class="btn primary" type="button" id="approveArt">${ic("check", "ic-s")}Согласовать</button>`
      : `<button class="btn primary" type="button" aria-disabled="true">Согласовать</button><span class="small muted">Сначала ответьте на 1 вопрос ниже</span>`;
    const checks = [["Факты", "Проверено 12 фактов: 11 сходятся с вашими данными, 1 ждёт вашего ответа"], ["Польза", "Отвечает на вопрос сразу, воды мало"],
      ["Задание", "Нужные слова на месте, лишних повторов нет"], ["Повторы", "Похожих статей на сайте нет"],
      ["Ваши правила", "Нарушений нет: места в поиске не обещаем"], ["Готовность к сайту", "Адрес свободен, автор и дата на месте"]];
    const question = ok ? "" : `<section class="card q"><span class="kicker">Нужно ваше слово</span><p class="q-text">${e(A.q)}</p>
      <p class="small muted" style="margin:0">Зачем: люди ищут цену, а выдумывать её завод не будет.</p>
      <div class="offer">${ic("sparkles", "ic-s")}<div><span class="kicker">Завод предлагает</span>${e(A.offer)}</div></div>
      <div class="head-actions"><button class="btn primary" type="button" id="artYes">${ic("check", "ic-s")}Да, верно</button><button class="btn" type="button" id="artYes2">Поправить</button><button class="btn ghost" type="button" id="artSkip">Не знаю</button></div></section>`;
    const checked = isClient ? "" : `<div class="checks-grid">${checks.map(([n, t]) => `<div class="check">${ic("circle-check", "ic-s")}<span><b>${n}.</b> ${t}</span></div>`).join("")}</div>`;
    return `<div class="grid article-col">
        <section class="card">${verdict}<div class="card-b" style="border-top:1px solid var(--line)"><div class="head-actions">${approve}<button class="btn ghost" type="button" id="remark">${ic("message-square", "ic-s")}Написать замечание</button></div>
          <div class="field" id="remarkBox" hidden><label for="rm">Что поправить</label><textarea id="rm"></textarea><div class="err" id="rmErr"></div>
          <div class="head-actions"><button class="btn primary sm" type="button" id="rmSend">Отправить</button></div></div><p class="okmsg" id="artDone" hidden></p></div>${checked}</section>
        ${question}
        <article class="card article-body"><span class="kicker">${A.kind} · ведёт к услуге «${e(A.leads)}»</span><h3>${e(A.title)}</h3>
          <p class="lead">${e(A.answerA)}${ok ? e(A.value) : "[цена — ждёт вашего ответа]"}${e(A.answerB)}</p><p style="margin:0">${e(A.body)}</p>
          <button class="btn ghost sm" type="button" style="justify-self:start">Читать целиком</button></article>
      </div>`;
  }
  function siteArticle() {
    return owner("site-check", [["Сайты", "admin"], [D.sites[0].domain, "site"], ["Статьи", "site-articles"], ["Статья", ""]],
      `${U.head(e(D.articleOwn.title))}${articleView(false)}`);
  }

  function sitePublish() {
    const queue = `<div class="rows">${D.queue.map((q) => `<div class="rowi"><span class="ic-wrap">${ic("clock", "ic-s")}</span><div class="body"><b>${e(q.title)}</b><span>выйдет: ${q.day}</span></div></div>`).join("")}</div>`;
    const recent = `<div class="rows">${D.recent.map((r) => `<div class="rowi"><span class="ic-wrap">${ic("file-text", "ic-s")}</span><div class="body"><b>${e(r.title)}</b><span>Яндекс ${r.ya} · Google ${r.g}</span></div>${ic("external-link", "ic-s")}</div>`).join("")}</div>`;
    return owner("site-publish", siteCrumbs("Выкладка и замер"), `${U.head("Завод работает по плану", D.stations[5].hint + ". Последняя выкладка — вчера, данные свежие.",
        `<a class="btn primary" href="#site-articles">Посмотреть 2 статьи без «ок»</a><button class="btn" type="button">${ic("refresh-cw", "ic-s")}Проверить сейчас</button>`)}
      ${U.stats([["14 из 16", "страниц уже в поиске"], ["около 1 200", "раз за неделю сайт показали в поиске"], ["3", "статьи вышли на этой неделе"]])}
      <div class="grid g2">${U.card("Очередь на сайт", "clock", queue, `<a class="btn ghost sm" href="#site-about">темп: 3 в неделю</a>`)}${U.card("Недавно на сайте", "send", recent)}
        ${U.card("Следим за сайтом", "eye", `<div class="card-b"><p class="why">На странице «Цены» пропал заголовок. Так и должно быть?</p><div class="head-actions"><button class="btn sm" type="button">Вернуть как было</button><button class="btn ghost sm" type="button">Так и должно быть</button></div></div>`, U.chip("1 изменение", "warn"))}
        ${U.card("Вернётся в план", "refresh-cw", `<div class="card-b"><p class="why">«Как продвинуть сайт в Яндексе самому» — на 14 месте. Подтянем: добавим таблицу и обновим примеры.</p></div>`)}</div>`);
  }

  function report(isClient) {
    const items = [["sparkles", "Что сделали", "Вышли 3 статьи. Факт №1: статья про robots.txt уже на 8 месте в Яндексе."],
      ["trending-up", "Что сработало", "Факт №2: редкие вопросы выходят на первую страницу поиска за 2–3 недели — пишем их дальше."],
      ["clock", "Что не вышло и что делаем", "Факт №3: Google пока видит 4 статьи из 7 — сайт новый, для первых месяцев это нормально. Ждём."]];
    return `${U.head("Сайт растёт: в поиске показывают в 2 раза чаще", "Данные на сегодня, 09:00")}
      ${U.stats([["около 1 200", "раз за неделю сайт показали в поиске — было около 600"], ["37", "человек перешли на сайт из поиска"], ["5", "статей вышло за месяц"]])}
      <section class="card"><div class="rows">${items.map(([i, t, x]) => `<div class="rowi"><span class="ic-wrap">${ic(i, "ic-s")}</span><div class="body"><b>${t}</b><span style="font-size:14px;color:var(--graphite)">${x}</span></div></div>`).join("")}
        <a class="rowi" href="#${isClient ? "client-article" : "site-article"}"><span class="ic-wrap">${ic("message-square", "ic-s")}</span><div class="body"><b>Что нужно от вас</b><span>Ответить на 1 вопрос о цене</span></div><div class="end">${U.dot("need")}${ic("chevron-right", "ic-s")}</div></a>
      </div></section>
      <p class="small muted" style="margin:0">Отчёт обновляется каждый день и сравнивает с прошлой неделей. Нашли ошибку в факте — напишите номер, например «факт №3», завод поправит.</p>`;
  }

  function siteAbout() {
    const paceNote = S.pace <= 3 ? "Для нового сайта безопасно до 3 в неделю." : "Рискованно для нового сайта: частые статьи поисковик может принять за спам. Решать вам.";
    return owner("site-about", siteCrumbs("О сайте"), `${U.head("Что завод знает о сайте", "Здесь нет настроек «на всякий случай» — только то, что можно поправить.")}
      <div class="grid g2">
        ${U.card("Темп выкладки", "gauge", `<div class="card-b"><div class="head-actions" style="align-items:center"><span>Статей в неделю</span>
          <span class="stepper"><button type="button" data-pace="-1" aria-label="Меньше">−</button><b class="mono">${S.pace}</b><button type="button" data-pace="1" aria-label="Больше">+</button></span></div>
          <p class="small muted" style="margin:0">${paceNote}</p></div>`, S.pace <= 3 ? U.chip("безопасно", "ok") : U.chip("рискованно", "warn"))}
        ${U.card("Автопилот", "zap", `<div class="card-b"><label class="switch"><input type="checkbox" id="auto" ${S.autopilot ? "checked" : ""}><span>${S.autopilot ? "Автопилот включён" : "Включить автопилот"}</span></label>
          <p class="small muted" style="margin:0">${S.autopilot ? "Статьи с зелёной проверкой выходят сами. Страницы услуг, склейки и ссылки со старых страниц всё равно ждут «ок»." : "Сейчас каждая статья ждёт «ок»."}</p></div>`)}
        ${U.card("О бизнесе", "building-2", `<div class="card-b"><p class="why">${e(D.passport.business)}. Регион: ${e(D.passport.region)}.</p><p class="small muted" style="margin:0">Чего не пишем: ${e(D.passport.never)}.</p><button class="btn ghost sm" type="button" style="justify-self:start">${ic("pencil", "ic-s")}Поправить</button></div>`)}
        ${U.card("Поиск", "search", `<div class="card-b"><p class="why">Яндекс Вебмастер не подключён — без него завод не видит, по каким запросам вас уже находят.</p><button class="btn sm" type="button" style="justify-self:start">Подключить</button></div>`, U.chip("не подключён", "warn"))}
        ${U.card("Оформление статей", "palette", `<div class="card-b"><p class="why">Снято с вашего сайта: тёмный текст на светлом фоне, шрифт Onest.</p><button class="btn ghost sm" type="button" style="justify-self:start">${ic("pencil", "ic-s")}Поправить</button></div>`)}
        ${U.card("Филиалы", "map-pin", `<div class="card-b"><p class="why">Работаете онлайн по всей России — филиалов нет.</p></div>`)}
      </div>`);
  }

  // ---------- кабинет клиента ----------
  function clientHome() {
    return client("client", [["Главное", ""]], `${U.head("Здравствуйте! В октябре на сайте вышло 5 статей", "Ещё 2 ждут вашего «ок», и у завода 1 вопрос к вам.", `<a class="btn primary" href="#client-article">Посмотреть 2 статьи</a>`)}
      <section class="card"><div class="rows">
        <a class="rowi" href="#client-article"><span class="ic-wrap">${ic("file-text", "ic-s")}</span><div class="body"><b>2 статьи ждут вашего «ок»</b><span>Сколько стоит ремонт однокомнатной квартиры · Как выбрать бригаду</span></div><div class="end">${U.dot("need")}${ic("chevron-right", "ic-s")}</div></a>
        <a class="rowi" href="#client-questions"><span class="ic-wrap">${ic("message-square", "ic-s")}</span><div class="body"><b>1 вопрос от завода</b><span>Даёте ли вы гарантию на работы и на какой срок?</span></div><div class="end">${ic("chevron-right", "ic-s")}</div></a>
        <a class="rowi" href="#client-report"><span class="ic-wrap">${ic("trending-up", "ic-s")}</span><div class="body"><b>Сайт растёт</b><span>В поиске показали около 900 раз за неделю — в полтора раза больше, чем неделю назад</span></div><div class="end">${ic("chevron-right", "ic-s")}</div></a>
      </div></section>`);
  }
  function clientArticle() { return client("client-article", [["Главное", "client"], ["На согласование", ""]], `${U.head(e(D.articleClient.title), "Прочитайте и согласуйте — или напишите, что поправить.")}${articleView(true)}`); }
  function clientQuestions() {
    if (S.clientAnswered) {
      return client("client-questions", [["Главное", "client"], ["Вопросы", ""]], `<section class="card empty">${ic("circle-check")}<h1 style="font-size:24px">Вопросов нет</h1>
        <p class="sub">Спасибо! Завод учтёт ответ в следующих статьях. Новый вопрос появится здесь и на главной.</p>
        <a class="btn primary" href="#client">На главную</a></section>`);
    }
    return client("client-questions", [["Главное", "client"], ["Вопросы", ""]], `${U.head("Остался 1 вопрос", "Спрашиваем только то, чего нет на сайте.")}
      <div class="q-wrap"><section class="card q"><span class="kicker">Вопрос 1 из 1</span><p class="q-text">Даёте ли вы гарантию на работы и на какой срок?</p>
      <p class="small muted" style="margin:0">Зачем: про гарантию спрашивают перед тем, как позвонить.</p>
      <div class="offer">${ic("sparkles", "ic-s")}<div><span class="kicker">Завод предлагает</span>На странице «О нас»: гарантия 2 года на все работы. Верно?</div></div>
      <div class="head-actions"><button class="btn primary" type="button" data-cq="yes">${ic("check", "ic-s")}Да, верно</button><button class="btn" type="button" data-cq="edit">Поправить</button><button class="btn ghost" type="button" data-cq="skip">Не знаю</button></div>
      <div class="field" id="cqEdit" hidden><label for="cqAns">Как на самом деле</label><textarea id="cqAns"></textarea><div class="err" id="cqErr"></div>
        <div class="head-actions"><button class="btn primary" type="button" data-cq="save">Сохранить</button></div></div></section></div>`);
  }
  function clientReport() { return client("client-report", [["Главное", "client"], ["Отчёт", ""]], report(true)); }

  window.SCREENS = Object.assign({}, window.SCREENS_A, {
    "site-plan": sitePlan, "site-articles": siteArticles, "site-article": siteArticle, "site-check": siteArticle,
    "site-publish": sitePublish, "site-report": () => owner("site-report", siteCrumbs("Отчёт"), report(false)), "site-about": siteAbout,
    client: clientHome, "client-article": clientArticle, "client-questions": clientQuestions, "client-report": clientReport
  });
})();
