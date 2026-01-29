(function () {
  const CART_KEY = "cart_v1";
  const OPEN_KEY = "openCartOnLoad_v1";

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
    const activeId = map[file];
    if (!activeId) return;

    const el = document.getElementById(activeId);
    if (!el) return;

    el.classList.add("text-[#a0d4b2]", "border-b-2", "border-[#a0d4b2]", "pb-1");
    el.classList.remove("text-gray-400");
  }

  function getCartCount() {
    try {
      const cart = JSON.parse(sessionStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(cart) ? cart.length : 0;
    } catch {
      return 0;
    }
  }

  function updateBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (!badge) return;

    const count = getCartCount();
    if (count > 0) {
      badge.textContent = String(count);
      badge.classList.remove("hidden");
      badge.classList.add("flex");
    } else {
      badge.classList.add("hidden");
      badge.classList.remove("flex");
    }
  }

  function openCart() {
    // ถ้าอยู่หน้า index → ส่ง event ให้ React เปิดตะกร้า
    if (currentFile() === "index.html") {
      window.dispatchEvent(new CustomEvent("cart:open"));
      return;
    }
    // ถ้าอยู่หน้าอื่น → เก็บ flag แล้วเด้งไป index เพื่อเปิดตะกร้าอัตโนมัติ
    sessionStorage.setItem(OPEN_KEY, "1");
    location.href = "index.html";
  }

  function wireCartButton() {
    const btn = document.getElementById("navCartBtn");
    if (!btn) return;
    btn.addEventListener("click", openCart);
  }

  fetch("navbar.html", { cache: "no-store" })
    .then((r) => r.text())
    .then((html) => {
      mount.innerHTML = html;
      setActiveNav();
      updateBadge();
      wireCartButton();
    })
    .catch(() => {
      // ถ้า fetch ไม่ได้ (พาธผิด) อย่างน้อยไม่ให้พังทั้งหน้า
    });

  window.addEventListener("cart:updated", updateBadge);
})();