(async function () {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  const res = await fetch("navbar.html", { cache: "no-store" });
  const html = await res.text();
  mount.innerHTML = html;

  // ไฮไลต์หน้าปัจจุบันอัตโนมัติ
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  mount.querySelectorAll("a[data-nav]").forEach(link => {
    if (link.getAttribute("data-nav") === current) {
      link.classList.add("text-[#a0d4b2]", "border-b-2", "border-[#a0d4b2]", "pb-1");
      link.classList.remove("text-gray-400");
    }
  });
})();