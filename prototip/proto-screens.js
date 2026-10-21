// Экраны прототипа — по design/WIRE.md и design/COPY.md. Данные — пример.
(function () {
  const D = window.PROTO, U = window.UI, S = window.PROTO_STATE;
  const e = U.esc, ic = U.icon;
  const SITE = D.sites[0];
  const owner = (cur, crumbs, body) => U.shell("owner", cur, crumbs, body);
  const client = (cur, crumbs, body) => U.shell("client", cur, crumbs, body);
  const siteCrumbs = (last) => [["Сайты", "admin"], [SITE.domain, "site"], [last, ""]];

  // ---------- вход ----------
  function login() {
    return `<main class="login-wrap"><form class="login-card" id="loginForm" novalidate>
      <a class="logo" href="#login" style="padding:0"><span class="logo-mark"><i></i></span>SEO-завод</a>
      <div><h1 style="font-size:24px">Вход</h1><p class="sub">Завод сам продвигает сайты в поиске. Войдите, чтобы посмотреть, что он делает.</p></div>
      <div class="field"><label for="lg">Логин</label><input id="lg" autocomplete="username"></div>
      <div class="field"><label for="pw">Пароль</label><input id="pw" type="password" autocomplete="current-password"></div>
      <div class="err" id="loginErr"></div>
      <button class="btn primary" type="submit">Войти</button>
      <button class="btn ghost sm" type="button" id="showErr">Показать ошибку входа</button>
      <p class="small muted" style="margin:0">В прототипе пароль не проверяется — «Войти» ведёт в кабинет.</p>
    </form></main>`;
  }

  // ---------- админка ----------
  function admin() {
    const order = { bad: 0, warn: 1, ok: 2 };
    const rows = [...D.sites].sort((a, b) => order[a.verdict] - order[b.verdict]);
    const word = { ok: "Работает", warn: "Ждёт ответов", bad: "Остановлен" };
    const body = `${U.head("Нужна ваша рука: 1 сайт")}
      <section class="brake">${ic("octagon-alert")}<div class="brake-b"><b>motor-yar.ru — выпуск остановлен</b>
        <p class="why">В двух статьях подряд цены, которых нет в данных сайта. Что нужно: сверить цены — и выпуск продолжится.</p>
        <a class="btn primary" href="#site-publish">${ic("arrow-right", "ic-s")}Открыть motor-yar.ru</a></div></section>
      <section class="card"><div class="card-h"><h2>${ic("building-2", "ic-s")}Сайты · 3</h2><span class="small muted">за месяц: 14 статей, расход 2 920 ₽</span><a class="text-link" href="#admin-add">${ic("plus", "ic-s")}Добавить сайт</a></div><div class="table-wrap"><table>
        <thead><tr><th>Сайт</th><th>Состояние</th><th>Конвейер</th><th class="n">Ждёт вас</th><th class="n">Статей за месяц</th><th></th></tr></thead>
        <tbody>${rows.map((s) => `<tr class="row-link">
          <td><div class="site-cell">${U.avatar(s.name[0])}<div><b><a class="row-a" href="#site">${e(s.domain)}</a></b><span>${e(s.name)}</span></div></div></td>
          <td>${U.chip(word[s.verdict], s.verdict)}</td><td>${U.segs(s.states)}</td>
          <td class="n">${s.verdict === "ok" ? "2" : s.verdict === "warn" ? "3" : "1"}</td><td class="n">${s.verdict === "ok" ? "9" : s.verdict === "bad" ? "5" : "0"}</td>
          <td>${ic("chevron-right", "ic-s")}</td></tr>`).join("")}</tbody></table></div></section>`;
    return owner("admin", [["Все сайты", ""]], body);
  }
  function adminEmpty() {
    return owner("admin", [["Все сайты", ""]], `<section class="card empty">${ic("building-2")}<h1 style="font-size:24px">Сайтов пока нет</h1>
      <p class="sub">Добавьте первый — завод сам изучит его, задаст пару вопросов и предложит план.</p>
      <a class="btn primary" href="#admin-add">${ic("plus", "ic-s")}Добавить сайт</a></section>`);
  }
  function adminAdd() {
    return owner("admin", [["Все сайты", "admin"], ["Новый сайт", ""]], `${U.head("Какой сайт продвигаем?", "Вставьте адрес — дальше завод сам: изучит бизнес, найдёт, что ищут люди, и предложит план.")}
      <form class="card card-b" id="addForm" novalidate style="max-width:560px">
        <div class="field"><label for="url">Адрес сайта</label><input id="url" placeholder="сеоконтентзавод.рф" inputmode="url"></div>
        <div class="err" id="addErr"></div>
        <div class="head-actions"><button class="btn primary" type="submit">Начать знакомство</button><a class="btn ghost" href="#admin">Отмена</a></div>
      </form>`);
  }
  function adminModels() {
    const prov = ["RouterAI", "OpenRouter"].map((p) => `<button type="button" data-prov="${p}" aria-pressed="${S.provider === p}">${p}</button>`).join("");
    return owner("admin-models", [["Завод", "admin"], ["Модели и ключи", ""]], `${U.head("На чём работает завод", "Модели пишут и проверяют статьи. Если основной провайдер не ответит, завод сам попробует второй.")}
      <div class="grid g2">
        ${U.card("Провайдер моделей", "sparkles", `<div class="card-b"><div class="seg" role="group" aria-label="Провайдер">${prov}</div>
          <p class="small muted" style="margin:0">Основной — <b>${S.provider}</b>, запасной — ${S.provider === "RouterAI" ? "OpenRouter" : "RouterAI"}. Статьи пишет Claude Sonnet 5.5, проверяет модель другого семейства.</p></div>`)}
        ${U.card(`Ключ ${S.provider}`, "key-round", `<div class="card-b"><div class="field"><label for="key">Ключ</label><input id="key" placeholder="Вставьте ключ — его увидите только вы"></div>
          <div class="head-actions"><button class="btn primary" type="button" id="saveKey">Сохранить ключ</button></div>
          <p class="small muted" id="keyNote" style="margin:0">Без ключа модели не работают — «Знакомство», «Статьи» и «Проверка» ждут.</p></div>`, U.chip("нет ключа", "warn"))}
        ${U.card("XMLRiver", "search", `<div class="card-b"><p class="why">Выдача Яндекса и Google и частоты запросов — для «Спроса», «Статей» и «Замера».</p><p class="small muted" style="margin:0">Баланс <span class="mono">1 240 ₽</span></p></div>`, U.chip("подключён", "ok"))}
        ${U.card("Пароль входа", "shield-check", `<div class="card-b"><p class="why">Сейчас пароль простой. Смените его до ключа модели — иначе тот, кто подберёт пароль, потратит баланс.</p>
          <div class="head-actions"><button class="btn" type="button">Сменить пароль</button></div></div>`, U.chip("простой", "warn"))}
      </div>`);
  }
  function adminMoney() {
    return owner("admin-money", [["Завод", "admin"], ["Расход", ""]], `${U.head("Расход за октябрь — 2 920 ₽", "Сколько стоили модели и сервисы. Лимита нет; если код зациклится, завод остановится сам.")}
      <section class="card"><div class="table-wrap"><table><thead><tr><th>Сайт</th><th class="n">За месяц</th><th class="n">Статей</th><th class="n">За статью</th></tr></thead>
      <tbody>${D.spend.map((r) => `<tr><td><b>${e(r.site)}</b></td><td class="n">${r.month}</td><td class="n">${r.articles}</td><td class="n">${r.per}</td></tr>`).join("")}</tbody></table></div></section>`);
  }
  function adminFactory() {
    const item = (iconName, title, chip, text) => `<div class="rowi"><span class="ic-wrap">${ic(iconName, "ic-s")}</span><div class="body"><b>${title}</b><span>${text}</span></div><div class="end">${chip}</div></div>`;
    return owner("admin-factory", [["Завод", "admin"], ["Здоровье завода", ""]], `${U.head("Завод исправен", "Работник на месте, бэкап прошёл ночью, модели отвечают. Места на диске мало — следим.")}
      <div class="grid g2">
        ${U.card("Работник и модели", "cpu", `<div class="rows">
          ${item("cpu", "Работник", U.chip("работает", "ok"), "Последняя задача 4 минуты назад: проверка статьи про robots.txt")}
          ${item("sparkles", "Модели", U.chip("отвечают", "ok"), "RouterAI основной, OpenRouter проверен вчера")}</div>`)}
        ${U.card("Бэкапы и место на диске", "hard-drive", `<div class="rows">
          ${item("hard-drive", "Бэкапы", U.chip("сегодня ночью", "ok"), "Хранятся 3 последних, сжатые и зашифрованные, на этом сервере")}
          ${item("database", "Место на диске", U.chip("мало", "warn"), "Свободно 3,1 ГБ из 38. Меньше 1,5 ГБ — завод остановит бэкапы и напишет")}</div>`)}
      </div>`);
  }

  // ---------- рабочий кабинет ----------
  function site() {
    const wait = `<div class="rows">
      <a class="rowi" href="#site-article"><span class="ic-wrap">${ic("message-square", "ic-s")}</span><div class="body"><b>Нужна ваша цена в статье</b><span>«Сколько стоит SEO-продвижение» — завод не пишет цену, которой нет в ваших данных</span></div><div class="end">${U.dot("need")}${ic("chevron-right", "ic-s")}</div></a>
      <a class="rowi" href="#site-article"><span class="ic-wrap">${ic("file-text", "ic-s")}</span><div class="body"><b>Статья ждёт «ок»</b><span>«Почему сайт не видно в Яндексе» — проверка зелёная</span></div><div class="end">${ic("chevron-right", "ic-s")}</div></a></div>`;
    const feed = `<div class="rows feed">${D.feed.map((f) => `<div class="rowi"><span class="ic-wrap">${ic(f.icon, "ic-s")}</span><div class="body"><b style="font-weight:400">${e(f.t)}</b><span>${f.when}</span></div></div>`).join("")}</div>`;
    return owner("site", siteCrumbs("Обзор"), `${U.head(`<span style="display:inline-flex;align-items:center;gap:10px">${U.dot("ok")}Завод работает по плану</span>`, "Пишутся 3 статьи, 2 ждут вашего «ок». Тем хватит на 38 дней.",
        `<a class="btn primary" href="#site-wait">${ic("inbox", "ic-s")}Ждёт вас: 2</a><a class="btn" href="#site-plan">Открыть план</a>`)}
      ${U.card("Конвейер", "factory", U.flow(U.siteStates), `<span class="small muted">синий — завод работает · оранжевый — нужен человек</span>`)}
      ${U.stats([["14 из 16", "страниц уже в поиске"], ["около 1 200", "раз за неделю сайт показали в поиске — на 100% больше"], ["3", "статьи вышли на этой неделе"]])}
      <div class="grid g-main">${U.card("Ждёт вас", "inbox", wait, `<span class="count">2</span>`)}${U.card("Что сделал завод", "zap", feed)}</div>`);
  }
  function siteWait() {
    return owner("site-wait", siteCrumbs("Ждёт вас"), `${U.head("Ждут вас 2 дела", "Всё остальное завод делает сам.", `<a class="btn primary" href="#site-article">Ответить на вопрос в статье</a>`)}
      <section class="card"><div class="rows">
        <a class="rowi" href="#site-article"><span class="ic-wrap">${ic("message-square", "ic-s")}</span><div class="body"><b>В статье «Сколько стоит SEO-продвижение» нужна ваша цена</b><span>Завод убрал цену, которой нет в ваших данных, и спрашивает: сколько стоит продвижение в месяц?</span></div><div class="end">${U.chip("вопрос", "need")}</div></a>
        <a class="rowi" href="#site-article"><span class="ic-wrap">${ic("file-text", "ic-s")}</span><div class="body"><b>Статья «Почему сайт не видно в Яндексе» ждёт «ок»</b><span>Проверка зелёная: факты сверены, повторов с другими страницами нет</span></div><div class="end">${U.chip("статья")}</div></a>
      </div></section>`);
  }
  function siteIntro() {
    const P = D.passport;
    return owner("site-intro", siteCrumbs("Знакомство"), `${U.head("Вот что я понял о вашем бизнесе", D.stations[0].hint + ". Осталось 4 вопроса — о том, чего нет на сайте.",
        `<a class="btn primary" href="#site-questions">${ic("message-square", "ic-s")}Ответить на 4 вопроса</a>`)}
      <div class="grid g3">
        ${U.card("Что за бизнес", "building-2", `<div class="card-b"><p class="why"><b>${e(P.business)}.</b></p><p class="small muted" style="margin:0">Для кого: ${e(P.who)}. ${e(P.why)}. Изучено 84 страницы сайта.</p><button class="btn ghost sm" type="button">${ic("pencil", "ic-s")}Поправить</button></div>`)}
        ${U.card("Открыт ли сайт для поиска", "globe", `<div class="rows">${D.health.map((h) => `<div class="check">${ic(h.s === "ok" ? "circle-check" : "circle-alert", "ic-s")}<span>${e(h.t)}</span></div>`).join("")}</div>`, U.chip("31 из 32", "warn"))}
        ${U.card("Стоит ли продвигать", "lightbulb", `<div class="card-b"><p class="why"><b>Стоит, но осторожно.</b> Ниша конкурентная: за главные запросы бьются агентства. Начнём с соседних тем и редких вопросов — там конкурентов мало, сдвиги будут за недели.</p></div>`)}
      </div>`);
  }
  function siteQuestions() {
    const total = D.questions.length;
    if (S.qi >= total) {
      return owner("site-intro", siteCrumbs("Анкета"), `<section class="card empty">${ic("circle-check")}<h1 style="font-size:24px">Спасибо, это всё</h1>
        <p class="sub">Завод учтёт ответы и сам перейдёт к следующему шагу: посмотрит, что ищут люди.</p>
        <div class="head-actions"><a class="btn primary" href="#site-demand">Посмотреть спрос</a><button class="btn ghost" type="button" id="qRestart">Пройти ещё раз</button></div></section>`);
    }
    const q = D.questions[S.qi], left = total - S.qi;
    return owner("site-intro", siteCrumbs("Анкета"), `${U.head(left === 1 ? "Остался 1 вопрос" : `Осталось ${left} ${left < 5 ? "вопроса" : "вопросов"}`, "Спрашиваем только то, чего нет на сайте. На каждый вопрос завод уже предложил ответ.")}
      <div class="q-wrap"><section class="card q" aria-live="polite">
        <div class="progress" aria-hidden="true"><i style="width:${(S.qi / total) * 100}%"></i></div>
        <span class="kicker">Вопрос ${S.qi + 1} из ${total}</span>
        <p class="q-text">${e(q.q)}</p><p class="small muted" style="margin:0">Зачем: ${e(q.why)}</p>
        <div class="offer">${ic("sparkles", "ic-s")}<div><span class="kicker">Завод предлагает</span>${e(q.offer)}</div></div>
        <div class="head-actions"><button class="btn primary" type="button" data-q="yes">${ic("check", "ic-s")}Да, верно</button><button class="btn" type="button" data-q="edit">Поправить</button><button class="btn ghost" type="button" data-q="skip">Не знаю</button></div>
        <div class="field" id="qEdit" hidden><label for="qAns">Как на самом деле</label><textarea id="qAns"></textarea><div class="err" id="qErr"></div>
          <div class="head-actions"><button class="btn primary" type="button" data-q="save">Сохранить и дальше</button></div></div>
        <p class="small muted" style="margin:0">«Не знаю» — нормальный ответ: завод напишет без этого факта и не станет выдумывать.</p>
      </section></div>`);
  }
  function siteDemand() {
    return owner("site-demand", siteCrumbs("Спрос"), `${U.head("Что ваши клиенты ищут в поиске", "Нашли 87 тем — их ищут около 14 000 раз в месяц. 23 темы можно поднять быстро: конкурентов мало.",
        `<a class="btn primary" href="#site-plan">Всё верно, перейти к плану</a>`)}
      <div class="grid g2">${D.layers.map((l) => U.card(l.name, "", `<div class="card-b"><p class="why">${e(l.why)}</p>
        <div class="rows">${l.topics.map((t) => `<div class="check tight">${ic("search", "ic-s")}<span>${e(t)}</span></div>`).join("")}</div></div>`, `<span class="small muted">${l.count} тем · ${l.sub}</span>`)).join("")}</div>
      <section class="card card-b"><p class="why">Что-то не так? Напишите, какие темы убрать или добавить, — завод пересоберёт список и объяснит, что изменилось.</p>
        <button class="btn sm" type="button" style="justify-self:start">${ic("pencil", "ic-s")}Поправить темы</button></section>`);
  }
  window.SCREENS_A = { login, admin, "admin-empty": adminEmpty, "admin-add": adminAdd, "admin-models": adminModels, "admin-money": adminMoney,
    "admin-factory": adminFactory, site, "site-wait": siteWait, "site-intro": siteIntro, "site-questions": siteQuestions, "site-demand": siteDemand };
  window.UI_OWNER = owner; window.UI_CLIENT = client; window.UI_SITECRUMBS = siteCrumbs;
})();
