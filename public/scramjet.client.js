// scramjet.client.js
window.$scramjet = {
  rewriteHtml(html, base) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Remove scripts and meta tags
    doc.querySelectorAll("script, meta").forEach(e => e.remove());

    // Rewrite links
    doc.querySelectorAll("a").forEach(a => {
      let href = a.getAttribute("href");
      if (!href) return;

      try {
        const url = new URL(href, base).href;
        a.setAttribute("href", "#");
        a.onclick = () => window.loadPage(url);
      } catch {}
    });

    // Rewrite images
    doc.querySelectorAll("img").forEach(img => {
      const src = img.getAttribute("src");
      if (!src) return;
      try {
        img.src = "/api/proxy?url=" + encodeURIComponent(new URL(src, base).href);
      } catch {}
    });

    // Rewrite CSS files
    doc.querySelectorAll("link[rel='stylesheet']").forEach(link => {
      const href = link.getAttribute("href");
      if (!href) return;
      try {
        link.href = "/api/proxy?url=" + encodeURIComponent(new URL(href, base).href);
      } catch {}
    });

    return doc.body.innerHTML; // Only body content to prevent CSS takeover
  }
};

// Global page loader
window.loadPage = async function(url) {
  try {
    const res = await fetch("/api/proxy?url=" + encodeURIComponent(url));
    let html = await res.text();
    html = window.$scramjet.rewriteHtml(html, url);

    tabs[currentTab].content = html;
    renderPage(html);
  } catch (e) {
    tabs[currentTab].content = "<p style='color:red;'>Failed to load page.</p>";
    renderPage(tabs[currentTab].content);
  }
};
