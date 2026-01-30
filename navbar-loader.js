(function () {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  function currentFile() {
    return (location.pathname.split("/").pop() || "index.html").toLowerCase();
  }

  function setActiveNav() {
    const file = currentFile();
    const map = {
      "index.html": "navMenu",
      "howtoorder.html": "navHow",
      "contactus.html": "navContact",
    };

    // รีเซ็ตทุกเมนู
    ["navMenu", "navHow", "navContact"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove("active");
      // บังคับล้างเส้นใต้เผื่อโดน CSS อื่นทับ
      el.style.borderBottom = "3px solid transparent";
      el.style.paddingBottom = "10px";
      el.style.display = "inline-block";
    });

    const activeId = map[file];
    const el = document.getElementById(activeId);
    if (!el) return;

    // ใส่ active + บังคับเส้นใต้แบบ inline (ยังไงก็ขึ้น)
    el.classList.add("active");
    el.style.borderBottom = "3px solid #a0d4b2";
    el.style.paddingBottom = "10px";
    el.style.display = "inline-block";
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
      const file = currentFile();

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

  fetch("navbar.html")
    .then((r) => r.text())
    .then((html) => {
      mount.innerHTML = html;

      // ต้องเรียกหลัง inject เสร็จ
      setActiveNav();
      wireCartButton();
      renderCartBadge();

      window.addEventListener("cart:updated", renderCartBadge);
    })
    .catch(() => {});
})();