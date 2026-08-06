/* ═══════════════════════════════════════════════════════
   DIVISION — logica di pagina
   Nessuna dipendenza esterna.
   ═══════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var CFG = window.DIVISION_CONFIG || {};
  var $  = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ═══════════ SLIDER ═══════════ */

  var Slider = {
    index: 0,
    timer: null,
    animating: false,

    init: function () {
      this.slides = $$("[data-slide]");
      this.bgs    = $$(".bg");
      this.edgeL  = $("[data-edge-prev]");
      this.edgeR  = $("[data-edge-next]");
      if (!this.slides.length) return;

      var self = this;

      $("[data-prev]").addEventListener("click", function () { self.go(self.index - 1, true, -1); });
      $("[data-next]").addEventListener("click", function () { self.go(self.index + 1, true, 1); });

      document.addEventListener("keydown", function (e) {
        if ($("[data-modal]").classList.contains("is-open")) return;
        if (e.key === "ArrowLeft")  self.go(self.index - 1, true, -1);
        if (e.key === "ArrowRight") self.go(self.index + 1, true, 1);
      });

      this.bindSwipe();
      this.paintInitial();
      this.autoplay();
    },

    /* swipe su touch / trascinamento mouse */
    bindSwipe: function () {
      var hero = $(".hero");
      var startX = null;
      var self = this;

      hero.addEventListener("pointerdown", function (e) {
        if (e.target.closest(".btn, .arrow")) return;
        startX = e.clientX;
      });

      hero.addEventListener("pointerup", function (e) {
        if (startX === null) return;
        var dx = e.clientX - startX;
        startX = null;
        if (Math.abs(dx) < 60) return;
        var dir = dx < 0 ? 1 : -1;
        self.go(self.index + dir, true, dir);
      });

      hero.addEventListener("pointercancel", function () { startX = null; });
    },

    /* direzione più breve fra due indici su un anello circolare */
    shortestDir: function (from, to, total) {
      var diff = ((to - from) % total + total) % total;
      return diff <= total / 2 ? 1 : -1;
    },

    go: function (next, userAction, dir) {
      if (this.animating) return;
      var total = this.slides.length;
      next = ((next % total) + total) % total;   // wrap in entrambe le direzioni
      if (next === this.index) return;
      if (dir === undefined) dir = this.shortestDir(this.index, next, total);
      var prevIndex = this.index;
      this.index = next;
      this.paintMeta();
      this.paintTransition(prevIndex, next, dir);
      if (userAction) this.autoplay();           // riavvia il timer dopo un'interazione
    },

    /* primo render, senza animazione */
    paintInitial: function () {
      var i = this.index;
      this.slides.forEach(function (slide, n) {
        slide.hidden = n !== i;
        slide.classList.toggle("is-active", n === i);
      });
      this.paintMeta();
    },

    /* sfondo, card attiva ed etichette laterali */
    paintMeta: function () {
      var i = this.index;
      var total = this.slides.length;

      this.bgs.forEach(function (bg, n) {
        bg.classList.toggle("is-active", n === i);
      });

      var prev = this.slides[(i - 1 + total) % total];
      var next = this.slides[(i + 1) % total];
      if (this.edgeL) this.edgeL.textContent = prev.dataset.label || "";
      if (this.edgeR) this.edgeR.textContent = next.dataset.label || "";
    },

    /* crossfade direzionale fra la slide uscente e quella entrante */
    paintTransition: function (prevIndex, nextIndex, dir) {
      var oldEl = this.slides[prevIndex];
      var newEl = this.slides[nextIndex];
      var self  = this;

      this.animating = true;
      newEl.hidden = false;

      oldEl.classList.add(dir > 0 ? "is-out-fwd" : "is-out-bwd");
      newEl.classList.add(dir > 0 ? "is-in-fwd" : "is-in-bwd");
      newEl.classList.add("is-active");
      oldEl.classList.remove("is-active");

      setTimeout(function () {
        oldEl.hidden = true;
        oldEl.classList.remove("is-out-fwd", "is-out-bwd");
        newEl.classList.remove("is-in-fwd", "is-in-bwd");
        self.animating = false;
      }, 650);
    },

    autoplay: function () {
      var s = CFG.slider || {};
      clearInterval(this.timer);
      if (!s.autoplay || reduceMotion) return;
      var self = this;
      this.timer = setInterval(function () { self.go(self.index + 1, false, 1); }, s.intervalMs || 8000);
    }
  };


  /* ═══════════ STATUS SERVER LIVE ═══════════ */

  var Status = {
    init: function () {
      this.root    = $("[data-status]");
      this.elOn    = $("[data-status-online]");
      this.elMax   = $("[data-status-max]");
      this.elLabel = $("[data-status-label]");
      if (!this.root) return;

      var srv = CFG.server || {};
      this.elMax.textContent = srv.maxSlots || "—";

      if (!srv.cfxCode && !srv.host) {
        this.render(null, "Server non configurato");
        return;
      }

      this.refresh();
      var self = this;
      setInterval(function () { self.refresh(); }, srv.refreshMs || 60000);

      /* ricontrolla quando si torna sulla scheda */
      document.addEventListener("visibilitychange", function () {
        if (!document.hidden) self.refresh();
      });
    },

    refresh: function () {
      var self = this;
      var srv  = CFG.server || {};

      this.fetchCfx()
        .catch(function () { return self.fetchDirect(); })
        .then(function (data) {
          self.render(data);
        })
        .catch(function () {
          self.render(null, "Server offline");
        });
    },

    /* metodo consigliato: API pubblica cfx.re */
    fetchCfx: function () {
      var srv = CFG.server || {};
      if (!srv.cfxCode) return Promise.reject();

      return this.request("https://servers-frontend.fivem.net/api/servers/single/" + encodeURIComponent(srv.cfxCode))
        .then(function (json) {
          var d = json && json.Data;
          if (!d) throw new Error("payload vuoto");
          return {
            online: typeof d.clients === "number" ? d.clients : (d.players ? d.players.length : 0),
            max:    d.sv_maxclients || d.svMaxclients || srv.maxSlots
          };
        });
    },

    /* fallback: endpoint dynamic.json esposto dal server stesso */
    fetchDirect: function () {
      var srv = CFG.server || {};
      if (!srv.host) return Promise.reject();

      var scheme = location.protocol === "https:" ? "https:" : "http:";
      return this.request(scheme + "//" + srv.host + ":" + (srv.port || 30120) + "/dynamic.json")
        .then(function (d) {
          if (!d) throw new Error("payload vuoto");
          return {
            online: parseInt(d.clients, 10) || 0,
            max:    parseInt(d.sv_maxclients, 10) || srv.maxSlots
          };
        });
    },

    request: function (url) {
      var srv = CFG.server || {};
      var ctrl = new AbortController();
      var t = setTimeout(function () { ctrl.abort(); }, srv.timeoutMs || 8000);

      return fetch(url, { signal: ctrl.signal, cache: "no-store" })
        .then(function (r) {
          clearTimeout(t);
          if (!r.ok) throw new Error("HTTP " + r.status);
          return r.json();
        })
        .catch(function (err) { clearTimeout(t); throw err; });
    },

    render: function (data, msg) {
      if (!data) {
        this.root.dataset.state = "offline";
        this.elOn.textContent = "—";
        this.elLabel.textContent = msg || "Server offline";
        return;
      }
      this.root.dataset.state = "online";
      this.elMax.textContent = data.max;
      this.countTo(this.elOn, data.online);
      this.elLabel.textContent = "Avventurieri nel regno";
    },

    /* conteggio animato */
    countTo: function (el, target) {
      var from = parseInt(el.textContent, 10);
      if (isNaN(from) || reduceMotion) { el.textContent = target; return; }
      if (from === target) return;

      var start = performance.now();
      var dur = 900;

      function frame(now) {
        var p = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(from + (target - from) * eased);
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  };


  /* ═══════════ IL MONDO (carosello luoghi) ═══════════ */

  var World = {
    init: function () {
      this.track = $("[data-world-track]");
      if (!this.track) return;

      this.cards  = $$("[data-world-card]", this.track);
      this.dotsEl = $("[data-world-dots]");
      this.index  = 0;
      this.raf    = null;
      if (!this.cards.length) return;

      var self = this;

      this.cards.forEach(function (card, n) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "world__dot";
        dot.setAttribute("aria-label", "Vai a " + (n + 1));
        dot.addEventListener("click", function () { self.goTo(n); });
        self.dotsEl.appendChild(dot);
      });
      this.dots = $$(".world__dot", this.dotsEl);

      var prevBtn = $("[data-world-prev]");
      var nextBtn = $("[data-world-next]");
      if (prevBtn) prevBtn.addEventListener("click", function () { self.goTo(self.index - 1); });
      if (nextBtn) nextBtn.addEventListener("click", function () { self.goTo(self.index + 1); });

      this.track.addEventListener("scroll", function () {
        if (self.raf) return;
        self.raf = requestAnimationFrame(function () {
          self.syncFromScroll();
          self.raf = null;
        });
      }, { passive: true });

      this.setActive(0);
    },

    goTo: function (n) {
      n = Math.max(0, Math.min(n, this.cards.length - 1));
      var card = this.cards[n];
      var target = card.offsetLeft - (this.track.clientWidth - card.clientWidth) / 2;
      this.track.scrollTo({ left: target, behavior: reduceMotion ? "auto" : "smooth" });
      this.setActive(n);
    },

    /* individua la card più vicina al centro del track durante lo scroll libero */
    syncFromScroll: function () {
      var center = this.track.scrollLeft + this.track.clientWidth / 2;
      var closest = 0, min = Infinity;
      this.cards.forEach(function (card, n) {
        var cardCenter = card.offsetLeft + card.clientWidth / 2;
        var dist = Math.abs(cardCenter - center);
        if (dist < min) { min = dist; closest = n; }
      });
      this.setActive(closest);
    },

    setActive: function (n) {
      this.index = n;
      this.cards.forEach(function (card, i) { card.classList.toggle("is-active", i === n); });
      if (this.dots) this.dots.forEach(function (dot, i) { dot.classList.toggle("is-active", i === n); });
    }
  };


  /* ═══════════ FAQ ═══════════ */

  var Faq = {
    init: function () {
      var list = $("[data-faq]");
      if (!list) return;

      $$(".faq__item", list).forEach(function (item) {
        var btn = $(".faq__q", item);
        var body = $(".faq__a > div", item);
        btn.addEventListener("click", function () {
          Faq.toggle(item, btn, body);
        });
        Faq.sync(item, btn, body);
      });
    },

    toggle: function (item, btn, body) {
      var open = !item.classList.contains("is-open");
      item.classList.toggle("is-open", open);
      this.sync(item, btn, body);
    },

    sync: function (item, btn, body) {
      var open = item.classList.contains("is-open");
      btn.setAttribute("aria-expanded", String(open));
      if (body) body.setAttribute("aria-hidden", String(!open));
    }
  };


  /* ═══════════ REVEAL ALLO SCROLL ═══════════ */

  var Reveal = {
    init: function () {
      var items = $$("[data-reveal]");
      if (!items.length || !("IntersectionObserver" in window)) return;

      document.body.classList.add("can-reveal");

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

      items.forEach(function (el) { io.observe(el); });
    }
  };


  /* ═══════════ CONNESSIONE AL SERVER ═══════════ */

  function connectUrl() {
    var srv = CFG.server || {};
    if (srv.cfxCode) return "fivem://connect/" + srv.cfxCode;
    if (srv.host)    return "fivem://connect/" + srv.host + ":" + (srv.port || 30120);
    return null;
  }

  function wireConnect() {
    var url = connectUrl();
    $$("[data-connect]").forEach(function (el) {
      if (url) {
        el.setAttribute("href", url);
        return;
      }
      /* niente server configurato → manda su Discord se disponibile */
      var dc = (CFG.links || {}).discord;
      if (dc && dc !== "https://discord.gg/") {
        el.setAttribute("href", dc);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          console.warn("[Division] Configura server.cfxCode in assets/js/config.js");
        });
      }
    });
  }

  function wireSocials() {
    var links = CFG.links || {};
    $$("[data-social]").forEach(function (el) {
      var url = links[el.dataset.social];
      if (url && url !== "https://discord.gg/") {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      } else {
        el.style.display = "none";
      }
    });
  }


  /* ═══════════ MENU MOBILE ═══════════ */

  var Drawer = {
    init: function () {
      this.btn  = $("[data-burger]");
      this.root = $("[data-drawer]");
      if (!this.btn || !this.root) return;

      var self = this;
      this.btn.addEventListener("click", function () {
        self.toggle(self.btn.getAttribute("aria-expanded") !== "true");
      });

      $$("a", this.root).forEach(function (a) {
        a.addEventListener("click", function () { self.toggle(false); });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") self.toggle(false);
      });
    },

    toggle: function (open) {
      this.btn.setAttribute("aria-expanded", String(open));
      this.btn.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");

      if (open) {
        this.root.hidden = false;
        requestAnimationFrame(() => this.root.classList.add("is-open"));
      } else {
        this.root.classList.remove("is-open");
        var root = this.root;
        setTimeout(function () { root.hidden = true; }, 400);
      }
    }
  };


  /* ═══════════ MODALE TRAILER ═══════════ */

  var Modal = {
    init: function () {
      this.root = $("[data-modal]");
      if (!this.root) return;

      var self = this;

      $$("[data-open-media]").forEach(function (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          self.open();
        });
      });

      $$("[data-modal-close]", this.root).forEach(function (el) {
        el.addEventListener("click", function () { self.close(); });
      });

      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") self.close();
      });
    },

    open: function () {
      this.root.hidden = false;
      requestAnimationFrame(() => this.root.classList.add("is-open"));
      document.body.style.overflow = "hidden";
      $(".modal__close", this.root).focus();
    },

    close: function () {
      if (this.root.hidden) return;
      this.root.classList.remove("is-open");
      document.body.style.overflow = "";
      var self = this;
      setTimeout(function () { self.root.hidden = true; }, 350);
    }
  };


  /* ═══════════ PARALLASSE LEGGERA SULLO SFONDO ═══════════ */

  function parallax() {
    var stage = $("#stage");
    if (!stage || reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    var raf = null, tx = 0, ty = 0;

    window.addEventListener("mousemove", function (e) {
      tx = (e.clientX / window.innerWidth  - .5) * 16;
      ty = (e.clientY / window.innerHeight - .5) * 12;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        stage.style.transform = "translate3d(" + -tx + "px," + -ty + "px,0) scale(1.03)";
        raf = null;
      });
    });
  }


  /* ═══════════ AVVIO ═══════════ */

  document.addEventListener("DOMContentLoaded", function () {
    Slider.init();
    Status.init();
    World.init();
    Faq.init();
    Reveal.init();
    Drawer.init();
    Modal.init();
    wireConnect();
    wireSocials();
    parallax();

    requestAnimationFrame(function () {
      document.body.classList.remove("is-loading");
    });
  });

})();
