(function () {
  const CART_KEY = "cart_v1";
  const mount = document.getElementById("navbar");
  if (!mount) return;

  function setActiveNav() {
    const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const map = { "index.html": "navMenu", "howtoorder.html": "navHow", "contactus.html": "navContact" };
    const activeId = map[file];
    if (!activeId) return;

    const el = document.getElementById(activeId);
    if (!el) return;

    el.classList.add("text-[#a0d4b2]", "border-b-2", "border-[#a0d4b2]", "pb-1");
  }

  function updateBadge() {
    const badge = document.getElementById("cartCountBadge");
    if (!badge) return;
    let count = 0;
    try {
      const cart = JSON.parse(sessionStorage.getItem(CART_KEY) || "[]");
      count = Array.isArray(cart) ? cart.length : 0;
    } catch {}
    if (count > 0) {
      badge.textContent = String(count);
      badge.classList.remove("hidden");
      badge.classList.add("flex");
    } else {
      badge.classList.add("hidden");
      badge.classList.remove("flex");
    }
  }

  fetch("navbar.html")
    .then(r => r.text())
    .then(html => {
      mount.innerHTML = html;
      setActiveNav();
      updateBadge();

      const btn = document.getElementById("cartButton");
      if (btn) {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const isIndex = (location.pathname.split("/").pop() || "index.html").toLowerCase() === "index.html";
          if (isIndex) {
            window.dispatchEvent(new Event("cart:open"));
          } else {
            sessionStorage.setItem("openCartOnLoad_v1", "1");
            location.href = "index.html";
          }
        });
      }
    });

  window.addEventListener("cart:updated", updateBadge);
})();