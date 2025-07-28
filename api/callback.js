export default async function callbackHandler(req, res) {
  const code = req.query.code;
  console.log("Received code:", code);

  if (!code) {
    return res.status(400).send("No code in query");
  }

  // Token-Austausch-Request
  try {
    const tokenRes = await fetch("https://open.tiktokapis.com/oauth/access_token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_key: process.env.TIKTOK_CLIENT_KEY,
        client_secret: process.env.TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: process.env.TIKTOK_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();
    console.log("Token response:", tokenData);

    if (!tokenData.data || !tokenData.data.access_token) {
      return res.status(500).send("Token exchange failed");
    }

    // Weiterverarbeitung hier

    res.status(200).send("Login success");
  } catch (e) {
    console.error("Error fetching token:", e);
    res.status(500).send("Error during token fetch");
  }
}
