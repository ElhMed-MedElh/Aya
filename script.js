/* ==============================================================
   CONFIG
   Everything you might want to change lives here. Nothing you
   need to edit is buried further down the file.

   Dates are "YYYY-MM-DD" and are read as local dates.
   ============================================================== */

const CONFIG = {

  /* --- her, and the gate ------------------------------------ */
  herName: "Aya",                  // shown large and italic in the hero

  password: "mohamed",              // set to "" to skip the gate entirely
  passwordHint: "Your first love before me",
  wrongMessage: "So i'm not your first love huh ??",

  /* --- the route and the dates ------------------------------ */
  cityFrom: "my heart",                // where the letter is sent from
  cityTo: "yours",               // where it lands

  metDate: "2024-09-12",            // the day we met

  /* The day both countdowns run to. Nothing on the page names it
     or says what it is — the label only tells her there is one. */
  secretDate: "2031-02-10",

  /* --- the joke line under the stamps (handwritten) ---------- */
  jokeLine: "Same city. Somehow still a logistics problem. (money problem </3)",

  /* --- section 4 · the shoebox ------------------------------ */
  /* Add as many as you like — the grid and the lightbox grow on
     their own, no HTML to touch. Files live in images/. */
  shoebox: [
    { src: "images/box-1.jpg", caption: "We lost count of the kisses here, and you slept on my chest. it felt like heaven" },
    { src: "images/box-2.jpg", caption: "the kind of pics you say they're ugly but i fall in love with." },
    { src: "images/box-3.jpg", caption: "when you posted it as a story i felt like a newborn." },
    { src: "images/box-4.jpg", caption: "No context. None needed.you're just so gorgeous" }
  ],

  /* --- section 6 · the phone -------------------------------- */
  /* { who: "them" | "me", text: "..." } */
  chat: [
    { who: "them", text: "l3art lah lamagolia kifach hahaha" },
    { who: "me",   text: "Kadef3i demande mn site dyal lbarça" },
    { who: "me", text: "Rah chi 3am wla kter bach dfe3t liha w kayb9a tale3 liya ghir pending, tal 9bila ja lfacteur shabni wach chrit chi haja online w nsitha hhhhhh" },
    { who: "them",   text: "hahaha ana rah fach chaftha galt wah mafrasich possible takhodha ghir man site" },
    { who: "them", text: "wach you paid for it yak ?" },
    { who: "me", text: "Db nsift lik ach khas diri étape par étape" },
    { who: "them",   text: "chokran bazaf welah" },
    { who: "me", text: "." },
    { who: "me", text: "." },
    { who: "me", text: "can you imagine our conversation went from this to kissing each other whenever we meet right now" }
  ],

  /* --- section 8 · songs ------------------------------------ */
  songs: [
    { title: "Perfect",   artist: "Ed Sheeran",       why: "a perfect song for a perfect girl like you.",   link: "https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v?si=895d88fcab884c53" },
    { title: "Bana Ellerini Ver",   artist: "Ozdemir Erdogan",  why: "you sang this song for me and said it's your fav turkish song so it became my fav too.",      link: "https://open.spotify.com/track/3Fn2pyvAIvJtdVzgooaBRv?si=e4509796eee34ae6" },
    { title: "Tujh Mein Rab Dikta Hai", artist: "Salim Sulaiman",  why: "indian song that we both love.",             link: "https://open.spotify.com/track/2LcXJP95e4HKydTZ2mYfrx?si=72ec84fffdce4649" }
  ]

};


/* ==============================================================
   Below here is machinery. You shouldn't need to edit it.
   ============================================================== */

(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;

  /* keep up if she changes the system setting mid-visit */
  if (motionQuery.addEventListener) {
    motionQuery.addEventListener("change", function (event) {
      reduceMotion = event.matches;
    });
  }

  var gate     = document.getElementById("gate");
  var gateCard = document.getElementById("gate-form");   // the form is the card
  var input    = document.getElementById("gate-input");
  var hintEl   = document.getElementById("gate-hint");
  var errorEl  = document.getElementById("gate-error");
  var site     = document.getElementById("site");
  var heroTitle = document.getElementById("hero-title");


  /* ---- helpers --------------------------------------------- */

  /* "YYYY-MM-DD" → local Date at midnight (avoids the UTC shift
     you get from passing the string straight to new Date()). */
  function parseDate(str) {
    var parts = String(str).split("-");
    return new Date(+parts[0], +parts[1] - 1, +parts[2]);
  }

  /* Whole days between two dates, ignoring time of day. */
  function daysBetween(from, to) {
    var a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
    var b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
    return Math.round((b - a) / 86400000);
  }

  /* Fill any [data-config="key"] element with its config value. */
  function fillConfigText() {
    var nodes = document.querySelectorAll("[data-config]");
    Array.prototype.forEach.call(nodes, function (node) {
      var value = CONFIG[node.getAttribute("data-config")];
      if (value != null) { node.textContent = value; }
    });
    if (hintEl) { hintEl.textContent = CONFIG.passwordHint; }
  }


  /* ---- hero numbers ---------------------------------------- */

  function heroValues() {
    var today = new Date();
    return {
      since: Math.max(0, daysBetween(parseDate(CONFIG.metDate), today)),
      secret: Math.max(0, daysBetween(today, parseDate(CONFIG.secretDate)))
    };
  }

  function countUp(el, target) {
    var duration = 1200;
    var start = null;

    function frame(now) {
      if (start === null) { start = now; }
      var t = Math.min(1, (now - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);          // ease out, no overshoot
      el.textContent = Math.round(target * eased).toLocaleString();
      if (t < 1) { window.requestAnimationFrame(frame); }
    }

    window.requestAnimationFrame(frame);
  }

  /* Counts every [data-count] inside `root` that hasn't run yet.
     The hero fires on open; the closing countdown fires when it
     scrolls into view, so she actually sees it happen. */
  function startCounts(root) {
    var scope = root || document;
    var nodes = scope.querySelectorAll("[data-count]:not([data-counted])");

    var values = heroValues();

    Array.prototype.forEach.call(nodes, function (node) {
      var target = values[node.getAttribute("data-count")] || 0;
      node.setAttribute("data-counted", "true");
      if (reduceMotion) {
        node.textContent = target.toLocaleString();
      } else {
        countUp(node, target);
      }
    });
  }


  /* ---- opening the letter ----------------------------------- */

  function openSite() {
    document.body.classList.remove("is-locked");
    site.hidden = false;

    window.requestAnimationFrame(function () {
      site.classList.add("is-revealed");
    });

    startCounts(document.getElementById("hero"));

    if (gate) {
      gate.classList.add("is-open");
      gate.setAttribute("aria-hidden", "true");
      window.setTimeout(function () {
        if (gate && gate.parentNode) { gate.parentNode.removeChild(gate); }
      }, reduceMotion ? 0 : 800);
    }

    if (heroTitle) { heroTitle.focus({ preventScroll: true }); }
  }

  function wrongAnswer() {
    errorEl.textContent = CONFIG.wrongMessage;
    gateCard.classList.remove("is-wrong");
    void gateCard.offsetWidth;              // restart the animation
    gateCard.classList.add("is-wrong");
    input.value = "";
    input.focus();
  }


  /* ---- scroll reveal ---------------------------------------- */

  function initReveal() {
    var targets = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(targets, function (el) {
        el.classList.add("is-in");
        startCounts(el);
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) { return; }
        entry.target.classList.add("is-in");
        startCounts(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* One-shot "transition finished" helper, with a timeout in case
     transitionend never arrives (reduced motion, hidden tabs). */
  function onTransitionEnd(el, fn) {
    var done = false;

    function finish(event) {
      if (event && event.target !== el) { return; }
      if (done) { return; }
      done = true;
      el.removeEventListener("transitionend", finish);
      fn();
    }

    el.addEventListener("transitionend", finish);
    window.setTimeout(finish, 700);
  }


  /* ---- 3 · polaroids ---------------------------------------- */

  function initPolaroids() {
    var cards = document.querySelectorAll(".polaroid");

    Array.prototype.forEach.call(cards, function (card) {
      var img = card.querySelector("img");

      /* no file there yet → soft colour block, never a broken icon */
      if (img) {
        img.addEventListener("error", function () {
          card.classList.add("is-missing");
        });
        if (img.complete && img.naturalWidth === 0) {
          card.classList.add("is-missing");
        }
      }

      card.addEventListener("click", function () {
        var flipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", flipped ? "true" : "false");
      });
    });
  }


  /* ---- 4 · the shoebox + lightbox ---------------------------- */

  var shoeboxItems = CONFIG.shoebox || [];
  var lightboxIndex = 0;
  var lastThumb = null;

  function renderShoebox() {
    var grid = document.getElementById("shoebox-grid");
    if (!grid) { return; }

    shoeboxItems.forEach(function (photo, i) {
      var item = document.createElement("li");

      var button = document.createElement("button");
      button.type = "button";
      button.className = "shoebox__item";
      button.setAttribute("aria-label", "Open photo: " + (photo.caption || "untitled"));

      var img = document.createElement("img");
      img.src = photo.src;
      img.alt = "";
      img.loading = "lazy";
      img.addEventListener("error", function () {
        button.classList.add("is-missing");
      });

      button.appendChild(img);
      button.addEventListener("click", function () { openLightbox(i, button); });

      item.appendChild(button);
      grid.appendChild(item);
    });
  }

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");

  function showPhoto(i) {
    var count = shoeboxItems.length;
    if (!count) { return; }
    lightboxIndex = (i + count) % count;          /* wraps both ways */
    var photo = shoeboxItems[lightboxIndex];
    lightbox.classList.remove("is-missing");
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption || "";
    lightboxCaption.textContent = photo.caption || "";
  }

  function openLightbox(i, opener) {
    if (!lightbox) { return; }
    lastThumb = opener || null;
    showPhoto(i);
    lightbox.hidden = false;
    document.body.classList.add("is-locked");
    document.getElementById("lightbox-close").focus();
  }

  function closeLightbox() {
    if (!lightbox || lightbox.hidden) { return; }
    lightbox.hidden = true;
    document.body.classList.remove("is-locked");
    if (lastThumb) { lastThumb.focus(); }          /* back where she was */
  }

  function initLightbox() {
    if (!lightbox) { return; }

    lightboxImg.addEventListener("error", function () {
      lightbox.classList.add("is-missing");
    });

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox-prev").addEventListener("click", function () {
      showPhoto(lightboxIndex - 1);
    });
    document.getElementById("lightbox-next").addEventListener("click", function () {
      showPhoto(lightboxIndex + 1);
    });

    /* a click on the backdrop, but not on the picture itself */
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.id === "lightbox-stage") {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (lightbox.hidden) { return; }

      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPhoto(lightboxIndex - 1);
      } else if (event.key === "ArrowRight") {
        showPhoto(lightboxIndex + 1);
      } else if (event.key === "Tab") {
        /* keep focus inside the dialog while it's open */
        var stops = lightbox.querySelectorAll("button");
        var first = stops[0];
        var last = stops[stops.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }


  /* ---- 5 · videos -------------------------------------------- */

  function initVideos() {
    var players = document.querySelectorAll(".video__frame video");

    Array.prototype.forEach.call(players, function (video) {
      var overlay = video.parentNode.querySelector(".video__play");

      if (overlay) {
        overlay.addEventListener("click", function () {
          overlay.hidden = true;
          var attempt = video.play();
          /* no file there yet — put the play button back rather than
             leaving her looking at a dead black rectangle */
          if (attempt && attempt.catch) {
            attempt.catch(function () { overlay.hidden = false; });
          }
        });
      }

      /* one at a time */
      video.addEventListener("play", function () {
        Array.prototype.forEach.call(players, function (other) {
          if (other !== video) { other.pause(); }
        });
      });
    });
  }


  /* ---- 6 · the phone ---------------------------------------- */

  function initPhone() {
    var log = document.getElementById("chat-log");
    var button = document.getElementById("chat-next");
    if (!log || !button) { return; }

    var messages = CONFIG.chat || [];
    var index = 0;

    function sideClass(who) {
      return who === "me" ? "bubble--me" : "bubble--them";
    }

    function scrollDown() { log.scrollTop = log.scrollHeight; }

    function reset() {
      log.textContent = "";
      index = 0;
      button.textContent = "Read the first message";
    }

    function step() {
      if (index >= messages.length) { reset(); return; }

      var message = messages[index];
      button.disabled = true;

      /* the ••• bubble, on the side the message will land on */
      var typing = document.createElement("p");
      typing.className = "bubble bubble--typing " + sideClass(message.who);
      typing.setAttribute("aria-hidden", "true");
      for (var i = 0; i < 3; i++) {
        typing.appendChild(document.createElement("span")).className = "dot";
      }
      log.appendChild(typing);
      scrollDown();

      window.setTimeout(function () {
        log.removeChild(typing);

        var bubble = document.createElement("p");
        bubble.className = "bubble " + sideClass(message.who);
        bubble.textContent = message.text;
        log.appendChild(bubble);
        scrollDown();

        index++;
        button.textContent = index >= messages.length ? "Start over" : "Next message";
        button.disabled = false;
      }, 700);
    }

    button.addEventListener("click", step);
    reset();
  }


  /* ---- 7 · open when… --------------------------------------- */

  function initLetters() {
    var heads = document.querySelectorAll(".letter__head");

    Array.prototype.forEach.call(heads, function (head) {
      var body = document.getElementById(head.getAttribute("aria-controls"));
      if (!body) { return; }

      head.addEventListener("click", function () {
        var isOpen = head.getAttribute("aria-expanded") === "true";

        if (isOpen) {
          body.style.maxHeight = body.scrollHeight + "px";   /* from none, so it can animate */
          void body.offsetHeight;
          body.style.maxHeight = "0px";
          head.setAttribute("aria-expanded", "false");
          onTransitionEnd(body, function () { body.hidden = true; });
        } else {
          body.hidden = false;
          body.style.maxHeight = "0px";
          void body.offsetHeight;
          body.style.maxHeight = body.scrollHeight + "px";
          head.setAttribute("aria-expanded", "true");
          /* release the cap once open, so reflow can't clip the text */
          onTransitionEnd(body, function () { body.style.maxHeight = "none"; });
        }
      });
    });
  }


  /* ---- 8 · songs -------------------------------------------- */

  function renderSongs() {
    var list = document.getElementById("songs-list");
    if (!list) { return; }

    (CONFIG.songs || []).forEach(function (song) {
      var item = document.createElement("li");
      item.className = "song";

      var title = document.createElement("p");
      title.className = "song__title";
      title.textContent = song.title;

      var artist = document.createElement("span");
      artist.className = "song__artist";
      artist.textContent = song.artist;
      title.appendChild(artist);
      item.appendChild(title);

      if (song.why) {
        var why = document.createElement("p");
        why.className = "song__why";
        why.textContent = song.why;
        item.appendChild(why);
      }

      if (song.link) {
        var link = document.createElement("a");
        link.className = "song__link";
        link.href = song.link;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "listen";
        link.setAttribute("aria-label", "Listen to " + song.title + " by " + song.artist);
        item.appendChild(link);
      }

      list.appendChild(item);
    });
  }


  /* ---- 10 · footer ------------------------------------------ */

  var PRESS_LABELS = [
    "do not press",
    "please don't",
    "that's twice now",
    "I'm not going to stop you",
    "okay, last one",
    "that was not the last one",
    "you're enjoying this",
    "fine. carry on"
  ];

  function confettiBurst(origin) {
    if (reduceMotion) { return; }

    var rect = origin.getBoundingClientRect();
    var x = rect.left + rect.width / 2;
    var y = rect.top + rect.height / 2;
    var colours = ["var(--rose)", "var(--peri)", "var(--blush)"];

    for (var i = 0; i < 26; i++) {
      var piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = x + "px";
      piece.style.top = y + "px";
      piece.style.background = colours[i % colours.length];
      piece.style.setProperty("--dx", Math.round(Math.random() * 260 - 130) + "px");
      piece.style.setProperty("--dy", Math.round(Math.random() * 200 + 130) + "px");
      piece.style.setProperty("--rot", Math.round(Math.random() * 720 - 360) + "deg");
      piece.style.setProperty("--dur", Math.round(900 + Math.random() * 700) + "ms");
      piece.addEventListener("animationend", function () {
        if (this.parentNode) { this.parentNode.removeChild(this); }
      });
      document.body.appendChild(piece);
    }
  }

  function initFooter() {
    var press = document.getElementById("do-not-press");
    var toggle = document.getElementById("terms-toggle");
    var list = document.getElementById("terms-list");
    var presses = 0;

    if (press) {
      press.addEventListener("click", function () {
        confettiBurst(press);
        presses++;
        press.textContent = PRESS_LABELS[presses % PRESS_LABELS.length];
      });
    }

    if (toggle && list) {
      toggle.addEventListener("click", function () {
        var isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", isOpen ? "false" : "true");
        list.hidden = isOpen;
      });
    }
  }


  /* ---- go --------------------------------------------------- */

  fillConfigText();
  initPolaroids();
  renderShoebox();
  initLightbox();
  initVideos();
  renderSongs();
  initPhone();
  initLetters();
  initFooter();
  initReveal();

  if (!CONFIG.password) {
    /* no password set — skip the gate entirely */
    if (gate && gate.parentNode) { gate.parentNode.removeChild(gate); }
    gate = null;
    openSite();
  } else {
    gateCard.addEventListener("submit", function (event) {
      event.preventDefault();               // Enter and the button both land here
      var typed = input.value.trim().toLowerCase();
      if (typed === String(CONFIG.password).trim().toLowerCase()) {
        openSite();
      } else if (typed !== "") {
        wrongAnswer();
      }
    });

    gateCard.addEventListener("animationend", function () {
      gateCard.classList.remove("is-wrong");
    });

    input.focus({ preventScroll: true });
  }

}());
