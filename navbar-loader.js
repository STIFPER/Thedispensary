(function () {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  function currentKey() {
    // รองรับทั้ง /howtoorder, /howtoorder/, /howtoorder.html
    let p = (location.pathname || "/").toLowerCase();
    p = p.replace(/\/+$/, ""); // ตัด / ท้าย
    let last = p.split("/").pop() || "index.html";

    // ถ้าไม่มี .html ให้เติมให้ (เช่น howtoorder -> howtoorder.html)
    if (!last.includes(".")) last = last + ".html";
    return last;
  }

  function clearActive(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("active");
    // ล้างเส้นใต้แบบบังคับ
    el.style.boxShadow = "none";
  }

  function setActiveNav() {
    const file = currentKey();
    const map = {
      "index.html": "navMenu",
      "howtoorder.html": "navHow",
      "contactus.html": "navContact",
    };

    // รีเซ็ตทุกเมนู
    ["navMenu", "navHow", "navContact"].forEach(clearActive);

    const activeId = map[file];
    const el = document.getElementById(activeId);
    if (!el) return;

    // ใส่ active + เส้นใต้แบบ inset (เห็นแน่นอน)
    el.classList.add("active");
    el.style.display = "inline-block";
    el.style.paddingBottom = "10px";
    el.style.boxShadow = "inset 0 -3px 0 #a0d4b2";
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

  // สำคัญ: ใช้ absolute path กันปัญหาอยู่ path ย่อยแล้ว fetch ไม่เจอ
  fetch("/navbar.html")
    .then((r) => r.text())
    .then((html) => {
      mount.innerHTML = html;

      setActiveNav();
      wireCartButton();
      renderCartBadge();

      window.addEventListener("cart:updated", renderCartBadge);
    })
    .catch(() => {});
})();