(function () {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  // ✅ base path ของหน้า ณ ตอนนั้น เช่น "/Thedispensary/" หรือ "/Thedispensary/sub/"
  function basePath() {
    const p = location.pathname || "/";
    return p.endsWith("/") ? p : p.replace(/[^/]*$/, "");
  }

  function currentKey() {
    let p = (location.pathname || "/").toLowerCase();
    p = p.replace(/\/+$/, "");
    let last = p.split("/").pop() || "index.html";
    if (!last.includes(".")) last = last + ".html";
    return last;
  }

  function getCartCount() {
    try {
      const arr = JSON.parse(sessionStorage.getItem("cart_v1") || "[]");
      return Array.isArray(arr) ? arr.length : 0;
    } catch {
      return 0;
    }
  }

  function renderCartBadge() {
    const badge = document.getElementById("navCartCount");
    if (!badge) return;
    const n = getCartCount();
    if (n > 0) {
      badge.textContent = String(n);
      badge.classList.remove("hidden");
    } else {
      badge.textContent = "";
      badge.classList.add("hidden");
    }
  }

  function wireCartButton() {
    const btn = document.getElementById("navCartBtn");
    if (!btn) return;

    btn.addEventListener("click", function (e) {
      const file = currentKey();

      if (file === "index.html") {
        e.preventDefault();
        window.dispatchEvent(new Event("cart:open"));
        return;
      }

      try {
        sessionStorage.setItem("openCartOnLoad_v1", "1");
      } catch {}
    });
  }

  // Ported verbatim from Website/public/shop/navbar-loader.js — same ids
  // (#navToggle, #navPanel), same aria-expanded toggle, same behaviour.
  function wireMobileMenu() {
    const btn = document.getElementById("navToggle");
    const panel = document.getElementById("navPanel");
    if (!btn || !panel) return;

    btn.addEventListener("click", function () {
      const open = panel.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });

    // A link inside the panel navigating away should close it, so a visitor
    // coming straight back (browser back button) doesn't land on a page
    // with the mobile menu still stuck open.
    panel.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        panel.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ✅ ลองโหลดแบบชัวร์สุด: basePath + navbar.html
  const url = basePath() + "navbar.html?v=" + Date.now();

  fetch(url, { cache: "no-store" })
    .then((r) => {
      if (!r.ok)
        throw new Error("navbar.html not found: " + r.status + " @ " + url);
      return r.text();
    })
    .then((html) => {
      mount.innerHTML = html;

      wireCartButton();
      renderCartBadge();
      wireMobileMenu();

      window.addEventListener("cart:updated", renderCartBadge);
    })
    .catch((err) => {
      console.error(err);
      // กันหน้าเว็บพัง: ไม่โชว์ 404 แปะบนเว็บอีกต่อไป
      mount.innerHTML = "";
    });
})();
