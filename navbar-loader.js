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
      "contactus.html": "navContact"
    };
    const activeId = map[file];
    if (!activeId) return;

    const el = document.getElementById(activeId);
    if (!el) return;

    el.classList.add("text-[#a0d4b2]", "border-b-2", "border-[#a0d4b2]", "pb-1");
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

      // ถ้าอยู่หน้า index อยู่แล้ว -> เปิดตะกร้าทันที
      if (file === "index.html") {
        e.preventDefault();
        window.dispatchEvent(new Event("cart:open"));
        return;
      }

      // ถ้าอยู่หน้าอื่น -> ฝากให้ index เปิดตอนโหลด แล้วค่อยไปหน้า index
      try {
        sessionStorage.setItem("openCartOnLoad_v1", "1");
      } catch {}
      // ปล่อยให้ลิงก์ไป index ตาม href ปกติ
    });
  }

  fetch("navbar.html")
    .then((r) => r.text())
    .then((html) => {
      mount.innerHTML = html;
      setActiveNav();
      wireCartButton();
      renderCartBadge();

      // อัปเดต badge ทุกครั้งที่ตะกร้าเปลี่ยน
      window.addEventListener("cart:updated", renderCartBadge);
    })
    .catch(() => {
      // ถ้า fetch ไม่ได้ (เช่นเปิดแบบ file://) จะไม่ขึ้น navbar
      // แนะนำให้เปิดผ่าน Live Server / local server
    });
})();