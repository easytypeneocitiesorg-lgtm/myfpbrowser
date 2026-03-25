window.$scramjet = {
  rewriteHtml(html, base) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Rewrite links
    doc.querySelectorAll("a").forEach(a => {
      let href = a.getAttribute("href");
      if (!href) return;

      try {
        let url = new URL(href, base).href;
        a.setAttribute("href", "#");
        a.onclick = () => window.loadPage(url);
      } catch {}
    });

    // Rewrite images
    doc.querySelectorAll("img").forEach(img => {
      let src = img.getAttribute("src");
      if (!src) return;

      try {
        img.src = "/api/proxy?url=" + encodeURIComponent(new URL(src, base).href);
      } catch {}
    });

    // Rewrite scripts (basic)
    doc.querySelectorAll("script").forEach(s => s.remove());

    return doc.documentElement.innerHTML;
  }
};

// allow navigation
window.loadPage = async function(url) {
  const res = await fetch("/api/proxy?url=" + encodeURIComponent(url));
  let html = await res.text();

  html = window.$scramjet.rewriteHtml(html, url);

  document.getElementById("frame").innerHTML = html;
};
