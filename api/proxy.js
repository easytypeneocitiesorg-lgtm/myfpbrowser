export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Missing URL");
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    let text = await response.text();

    res.setHeader("Content-Type", "text/html");
    res.send(text);

  } catch (e) {
    res.status(500).send("Proxy error");
  }
}
