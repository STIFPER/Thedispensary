(function () {
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

  fetch("navbar.html")
    .then(r => r.text())
    .then(html => {
      mount.innerHTML = html;
      setActiveNav();
    });
})();