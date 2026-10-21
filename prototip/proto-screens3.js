// Экраны прототипа, часть 3: новые станции «Техника», «Замер и рост», «Карты и отзывы». Данные — пример.
(function () {
  const D = window.PROTO, U = window.UI;
  const e = U.esc, ic = U.icon, owner = window.UI_OWNER, siteCrumbs = window.UI_SITECRUMBS;
  const row = (icon, title, text, end) => `<div class="rowi"><span class="ic-wrap">${ic(icon, "ic-s")}</span><div class="body"><b>${title}</b><span>${text}</span></div>${end ? `<div class="end">${end}</div>` : ""}</div>`;
  const check = (ok, text) => `<div class="check">${ic(ok ? "circle-check" : "circle-alert", "ic-s")}<span>${e(text)}</span></div>`;
  const note = (text) => `<section class="card card-b"><p class="why">${text}</p></section>`;

  // ---------- Техника ----------
  function siteTech() {
    const fix = [
      ["file-x", "6 старых адресов отдают «страница не найдена»", "По ним раньше приходили люди из поиска. Завод предлагает перенаправить их на новые страницы (301).", U.chip("нужно «ок»", "need")],
      ["copy", "Страницы открываются и со слешем в конце, и без", "Поиск видит две копии каждой страницы. Завод оставит один адрес, второй перенаправит.", U.chip("исправит сам", "")],
      ["map", "Нет карты сайта", "Поиск дольше находит новые страницы. Завод сделает карту и отправит её в Яндекс и Google.", U.chip("исправит сам", "")]
    ];
    const checked = [[true, "Сайт открывается и отвечает быстро"], [true, "Служебный файл robots.txt не закрывает нужные страницы"], [true, "Один адрес сайта: https и без www"],
      [false, "Разметка: компания описана, услуги – нет. Завод добавит"], [true, "На телефоне текст не вылезает за экран"], [true, "Роботы нейросетей могут читать сайт"]];
    return owner("site-tech", siteCrumbs("Техника"), `${U.head("Сайт исправен на 27 проверок из 30", U.st("tech").hint + ".",
        `<a class="btn primary" href="#site-demand">Всё исправлено – дальше спрос</a>`)}
      ${U.stats([["84", "страницы на сайте"], ["6", "адресов с ошибкой"], ["12", "страниц-дублей"]])}
      ${U.card("Что исправить первым", "wrench", `<div class="rows">${fix.map(([i, t, x, c]) => row(i, t, x, c)).join("")}</div>`, U.chip("3 дела", "warn"))}
      <div class="grid g2">
        ${U.card("Что проверено", "list-checks", `<div class="rows">${checked.map(([ok, t]) => check(ok, t)).join("")}</div>`)}
        ${U.card("Почему сначала техника", "lightbulb", `<div class="card-b"><p class="why"><b>Новые страницы ждут, пока не исправлено критичное.</b> Если поиск видит битые адреса и дубли, новые страницы не помогут: он тратит силы на ошибки и путает копии.</p><p class="small muted" style="margin:0">Завод проверяет технику каждую неделю и пишет, если что-то сломалось после правок сайта.</p></div>`)}
      </div>`);
  }

  // ---------- Замер и рост ----------
  function siteMeasure() {
    const pages = [
      ["Почему сайт не видно в Яндексе", "8 / 14", "420", "2", "держим"],
      ["Продвижение сайта статьями", "12 / 19", "310", "1", "дожать: добавить таблицу цен и кейс"],
      ["Как добавить компанию на Яндекс Карты", "21 / –", "90", "0", "ждём: вышла неделю назад"],
      ["Тарифы", "– / –", "0", "0", "склеить с «Ценами»: Яндекс считает дублем"]
    ];
    const table = `<div class="table-wrap"><table><thead><tr><th>Страница</th><th class="n">Место Я / G</th><th class="n">Показы за неделю</th><th class="n">Заявки</th><th>Что делаем</th></tr></thead>
      <tbody>${pages.map(([t, p, s, l, a]) => `<tr><td><b>${e(t)}</b></td><td class="n">${p}</td><td class="n">${s}</td><td class="n">${l}</td><td>${e(a)}</td></tr>`).join("")}</tbody></table></div>`;
    return owner("site-measure", siteCrumbs("Замер и рост"), `${U.head("Сайт растёт: показы выросли вдвое за месяц", U.st("measure").hint + ". Данные на сегодня, 09:00.",
        `<a class="btn primary" href="#site-plan">Открыть карту страниц</a>`)}
      ${U.stats([["14 из 16", "страниц в поиске"], ["около 1 200", "показов за неделю – было около 600"], ["3", "заявки с поиска за неделю"]])}
      ${U.card("По страницам", "chart-line", table)}
      <div class="grid g2">
        ${U.card("Следим за сайтом", "eye", `<div class="card-b"><p class="why">На странице «Цены» пропал заголовок. Так и должно быть?</p><div class="head-actions"><button class="btn sm" type="button">Вернуть как было</button><button class="btn ghost sm" type="button">Так и должно быть</button></div></div>`, U.chip("1 изменение", "warn"))}
        ${U.card("Вернётся в карту страниц", "refresh-cw", `<div class="card-b"><p class="why">«Продвижение сайта статьями» – на 12 месте. Дожмём: таблица цен, свежий кейс, ответ в первом абзаце. Дату без новых фактов не меняем.</p></div>`)}
        ${U.card("Две страницы на один запрос", "git-merge", `<div class="card-b"><p class="why">По запросу «цена seo продвижения» поиск показывает то «Цены», то «Тарифы». Предлагаем склеить в карте страниц.</p></div>`, U.chip("нужно «ок»", "need"))}
        ${U.card("Нейроответы", "sparkles", `<div class="card-b"><p class="why">Яндекс Нейро и Google упоминают сайт в 2 ответах из 15 проверенных. Чаще цитируют страницы, где ответ стоит в первом абзаце.</p></div>`)}
      </div>`);
  }

  // ---------- Карты и отзывы ----------
  function siteLocal() {
    const cards = [
      ["map-pin", "Яндекс Карты", "Название, адрес, телефон и часы совпадают с сайтом. Последнее фото – 3 недели назад.", U.chip("в порядке", "ok")],
      ["map-pin", "2ГИС", "Телефон отличается от сайта. Завод подготовил исправление – нужен доступ к карточке.", U.chip("нужно «ок»", "need")],
      ["map-pin", "Google Карты", "Карточки нет. Завод подготовит данные, создать её нужно вам: Google присылает код подтверждения.", U.chip("нет карточки", "warn")]
    ];
    return owner("site-local", siteCrumbs("Карты и отзывы"), `${U.head("Карты: 1 карточка из 3 в порядке", U.st("local").hint + ".")}
      ${note(`${ic("info", "ic-s")} Пример ниже – автосервис «Мотор», Ярославль. У онлайн-сервиса без офиса для клиентов эта станция короткая: только карточка компании.`)}
      ${U.card("Карточки", "map", `<div class="rows">${cards.map(([i, t, x, c]) => row(i, t, x, c)).join("")}</div>`)}
      <div class="grid g2">
        ${U.card("Отзывы", "message-square", `<div class="card-b"><p class="why">3 отзыва без ответа, один из них плохой. Завод написал ответы по фактам из вашей базы – прочитайте и отправьте.</p><div class="head-actions"><button class="btn sm" type="button">Посмотреть ответы</button></div></div>`, U.chip("3 без ответа", "warn"))}
        ${U.card("Чего завод не делает", "shield-check", `<div class="card-b"><p class="why">Не пишет ключевые слова в название карточки, не накручивает отзывы и не заводит адреса, где вас нет. За это карточку блокируют.</p></div>`)}
      </div>`);
  }

  Object.assign(window.SCREENS, { "site-tech": siteTech, "site-measure": siteMeasure, "site-local": siteLocal });
})();
