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

  function clearActive(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("active");
    el.style.boxShadow = "none";
    el.style.paddingBottom = "0";
    el.style.paddingLeft = "0";
    el.style.paddingRight = "0";
  }

  function setActiveNav() {
    const file = currentKey();
    const map = {
      "index.html": "navMenu",
      "howtoorder.html": "navHow",
      "contactus.html": "navContact",
    };

    ["navMenu", "navHow", "navContact"].forEach(clearActive);

    const activeId = map[file];
    const el = document.getElementById(activeId);
    if (!el) return;

    el.classList.add("active");
    el.style.display = "inline-block";
    el.style.paddingBottom = "6px";
    el.style.paddingLeft = "2px";
    el.style.paddingRight = "2px";
    el.style.boxShadow = "inset 0 -1px 0 rgba(160, 212, 178, 0.85)";
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

  // ✅ ลองโหลดแบบชัวร์สุด: basePath + navbar.html
  const url = basePath() + "navbar.html?v=" + Date.now();

  fetch(url, { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw new Error("navbar.html not found: " + r.status + " @ " + url);
      return r.text();
    })
    .then((html) => {
      mount.innerHTML = html;

      setActiveNav();
      wireCartButton();
      renderCartBadge();

      window.addEventListener("cart:updated", renderCartBadge);
    })
    .catch((err) => {
      console.error(err);
      // กันหน้าเว็บพัง: ไม่โชว์ 404 แปะบนเว็บอีกต่อไป
      mount.innerHTML = "";
    });
})();