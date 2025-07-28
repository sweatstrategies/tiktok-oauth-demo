// api/tiktok.js

export default async function handler(req, res) {
  const { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI } = process.env;

  if (req.query.path === "login") {
    const scope = "user.info.basic,video.list";
    const state = "random_string";
    const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&response_type=code&scope=${encodeURIComponent(
      scope
    )}&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&state=${state}`;
    res.writeHead(302, { Location: authUrl });
    return res.end();
  }

  if (req.query.path === "callback") {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");

    const tokenRes = await fetch("https://open-api.tiktok.com/oauth/access_token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code,
        grant_type: "authorization_code",
        redirect_uri: TIKTOK_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    return res.status(200).json(tokenData);
  }

  res.status(404).send("Not found");
}
