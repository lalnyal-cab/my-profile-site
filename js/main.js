(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- 1. data.js 내용 렌더링 ---------- */
  function renderProfile() {
    $("#hero-name").textContent = PROFILE.name;
    $("#footer-name").textContent = PROFILE.name;
    $("#hero-role").textContent = PROFILE.role;
    document.title = `프로필 | ${PROFILE.name}`;

    $("#hero-intro").innerHTML = PROFILE.intro.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
    $("#about-text").textContent = PROFILE.about;

    $("#skills-list").innerHTML = PROFILE.skills
      .map(
        (s) => `
        <li class="reveal card !flex-row items-center justify-between !p-4">
          <span class="font-semibold">${escapeHtml(s.name)}</span>
          <span class="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-500">${escapeHtml(s.level)}</span>
        </li>`
      )
      .join("");

    $("#projects-list").innerHTML = PROFILE.projects
      .map(
        (p) => `
        <article class="reveal card">
          <h3 class="text-lg font-bold">${escapeHtml(p.title)}</h3>
          <p class="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">${escapeHtml(p.description)}</p>
          <ul class="mt-4 flex flex-wrap gap-2">
            ${p.tags.map((t) => `<li class="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium dark:bg-slate-800">${escapeHtml(t)}</li>`).join("")}
          </ul>
          <div class="mt-5 flex gap-4 text-sm font-semibold">
            <a href="${escapeHtml(p.github)}" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline dark:text-brand-500">GitHub →</a>
            <a href="${escapeHtml(p.demo)}" target="_blank" rel="noopener noreferrer" class="text-brand-600 hover:underline dark:text-brand-500">Demo →</a>
          </div>
        </article>`
      )
      .join("");

    $("#contact-email").href = `mailto:${PROFILE.contact.email}`;
    $("#contact-github").href = PROFILE.contact.github;
    $("#year").textContent = new Date().getFullYear();
  }

  /* ---------- 2. 다크모드 토글 ---------- */
  function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    document.querySelector(".icon-sun").classList.toggle("hidden", !dark);
    document.querySelector(".icon-moon").classList.toggle("hidden", dark);
  }

  function initTheme() {
    const isDark = () => document.documentElement.classList.contains("dark");
    applyTheme(isDark());

    $("#theme-toggle").addEventListener("click", () => {
      const next = !isDark();
      applyTheme(next);
      try {
        localStorage.setItem("theme", next ? "dark" : "light");
      } catch (e) { /* 저장 실패 시 무시 */ }
    });
  }

  /* ---------- 3. 스크롤 등장 애니메이션 ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- 4. 스크롤 시 상단 바 배경 + 하단 탭 활성 표시 ---------- */
  function initScrollSpy() {
    const navbar = $("#navbar");
    const tabs = document.querySelectorAll("a.tab-link[href^='#']");
    const sections = [...tabs].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

    const onScroll = () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);

      let currentId = "";
      sections.forEach((sec) => {
        if (sec.getBoundingClientRect().top <= 140) currentId = sec.id;
      });
      tabs.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${currentId}`));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 초기화 ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderProfile();
    initTheme();
    initReveal();
    initScrollSpy();
  });
})();
