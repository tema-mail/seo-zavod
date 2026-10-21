// Оживление прототипа: меню и переключатели оболочки, анкета, согласование, автопилот, темп, провайдер, формы.
(function () {
  const S = window.PROTO_STATE;
  const $ = (id) => document.getElementById(id);
  const go = (h) => { if (location.hash === "#" + h) window.PROTO_RENDER(); else location.hash = h; };

  // Закрыть открытые меню: Esc или щелчок мимо. Вешается один раз на документ.
  function closeAll() {
    document.querySelectorAll(".side .dropdown, .proto-menu").forEach((m) => { m.hidden = true; });
    ["switcher", "protoBtn"].forEach((id) => { if ($(id)) $(id).setAttribute("aria-expanded", "false"); });
    if ($("side")) $("side").classList.remove("open");
    S.switcherOpen = S.protoOpen = S.menuOpen = false;
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeAll(); });
  document.addEventListener("click", (e) => {
    if (e.target.closest("#switcher, #protoBtn, #menuBtn, .dropdown, .side")) return;
    closeAll();
  });

  window.PROTO_BIND = function (key) {
    // Оболочка: переключатель сайтов, меню прототипа, меню на телефоне
    const toggle = (btn, menu, flag) => {
      if (!btn || !menu) return;
      btn.addEventListener("click", () => {
        menu.hidden = !menu.hidden; S[flag] = !menu.hidden; btn.setAttribute("aria-expanded", String(!menu.hidden));
      });
    };
    toggle($("switcher"), document.querySelector(".side .dropdown"), "switcherOpen");
    toggle($("protoBtn"), document.querySelector(".proto-menu"), "protoOpen");
    if ($("menuBtn")) $("menuBtn").addEventListener("click", () => { S.menuOpen = $("side").classList.toggle("open"); });

    // Вход
    const lf = $("loginForm");
    if (lf) {
      lf.addEventListener("submit", (e) => { e.preventDefault(); go("admin"); });
      $("showErr").addEventListener("click", () => { $("loginErr").textContent = "Логин или пароль не подошли. Осталось попыток: 2 из 3."; });
    }

    // Добавить сайт
    const af = $("addForm");
    if (af) {
      af.addEventListener("submit", (e) => {
        e.preventDefault();
        const v = $("url").value.trim();
        if (!/\.[a-zа-яё]{2,}$/i.test(v)) { $("addErr").textContent = "Это не похоже на адрес сайта — пример: сеоконтентзавод.рф"; return; }
        go("site-intro");
      });
      $("url").addEventListener("input", () => { $("addErr").textContent = ""; });
    }

    // Модели и ключи
    document.querySelectorAll("[data-prov]").forEach((b) => b.addEventListener("click", () => { S.provider = b.dataset.prov; window.PROTO_RENDER(); }));
    if ($("saveKey")) {
      $("saveKey").addEventListener("click", () => {
        const v = $("key").value.trim();
        $("keyNote").textContent = v ? "В прототипе ключ не сохраняется. В заводе он будет проверен и показан как «sk-…» с последними четырьмя знаками." : "Вставьте ключ — поле пустое.";
      });
    }

    // Анкета
    document.querySelectorAll("[data-q]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.q;
      if (k === "edit") { $("qEdit").hidden = false; $("qAns").focus(); return; }
      if (k === "save") {
        if (!$("qAns").value.trim()) { $("qErr").textContent = "Напишите ответ или нажмите «Не знаю»"; return; }
      }
      S.qi += 1; window.PROTO_RENDER();
    }));
    if ($("qAns")) $("qAns").addEventListener("input", () => { $("qErr").textContent = ""; });
    if ($("qRestart")) $("qRestart").addEventListener("click", () => { S.qi = 0; window.PROTO_RENDER(); });

    // План
    if ($("approvePlan")) $("approvePlan").addEventListener("click", () => { S.approved = true; window.PROTO_RENDER(); });
    if ($("suggest")) $("suggest").addEventListener("click", () => { $("suggestBox").hidden = false; $("sg").focus(); });
    if ($("sgCheck")) {
      $("sgCheck").addEventListener("click", () => {
        const v = $("sg").value.trim();
        $("sgErr").style.color = "";
        if (!v) { $("sgErr").textContent = "Напишите тему, например: как выбрать SEO-подрядчика"; return; }
        $("sgErr").style.color = "var(--graphite)";
        $("sgErr").textContent = "Ищут около 140 раз в месяц — добавил в план, тип «Выбор», очередь «Потом». (Пример ответа завода.)";
      });
    }

    // Статьи: фильтр списка
    document.querySelectorAll("[data-af]").forEach((b) => b.addEventListener("click", () => { S.artFilter = b.dataset.af; window.PROTO_RENDER(); }));

    // Статья: вопрос и согласование
    ["artYes", "artYes2", "artSkip"].forEach((id) => { if ($(id)) $(id).addEventListener("click", () => { S.articleAnswered = true; window.PROTO_RENDER(); }); });
    if ($("approveArt")) $("approveArt").addEventListener("click", () => {
      $("artDone").hidden = false; $("artDone").textContent = "Согласовано. Статья в очереди на сайт — выйдет во вторник.";
    });
    if ($("remark")) $("remark").addEventListener("click", () => { $("remarkBox").hidden = false; $("rm").focus(); });
    if ($("rmSend")) $("rmSend").addEventListener("click", () => {
      if (!$("rm").value.trim()) { $("rmErr").textContent = "Напишите, что поправить"; return; }
      $("remarkBox").hidden = true; $("artDone").hidden = false; $("artDone").textContent = "Замечание отправлено. Завод поправит и пришлёт статью снова.";
    });

    // О сайте: темп и автопилот
    document.querySelectorAll("[data-pace]").forEach((b) => b.addEventListener("click", () => {
      S.pace = Math.max(1, Math.min(20, S.pace + Number(b.dataset.pace))); window.PROTO_RENDER();
    }));
    if ($("auto")) $("auto").addEventListener("change", (e) => { S.autopilot = e.target.checked; window.PROTO_RENDER(); });

    // Клиент: вопрос от завода
    document.querySelectorAll("[data-cq]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.cq;
      if (k === "edit") { $("cqEdit").hidden = false; $("cqAns").focus(); return; }
      if (k === "save" && !$("cqAns").value.trim()) { $("cqErr").textContent = "Напишите ответ или нажмите «Не знаю»"; return; }
      S.clientAnswered = true; window.PROTO_RENDER();
    }));
    if ($("cqAns")) $("cqAns").addEventListener("input", () => { $("cqErr").textContent = ""; });
  };
})();
