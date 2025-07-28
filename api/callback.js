// api/callback.js
export default async function handler(req, res) {
  const { TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET, TIKTOK_REDIRECT_URI } = process.env;

  const code = req.query.code;

  console.log("Received code:", code);

  if (!code) {
    return res.status(400).send("Missing code in query");
  }

  try {
    const tokenRes = await fetch("https://open-api.tiktok.com/oauth/access_token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: TIKTOK_CLIENT_KEY,
        client_secret: TIKTOK_CLIENT_SECRET,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: TIKTOK_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenRes.json();

    console.log("Token response:", tokenData);

    if (tokenData.data && tokenData.data.access_token) {
      res.status(200).send(`
        <h1>✅ TikTok Login Successful</h1>
        <p>Access Token: <code>${tokenData.data.access_token}</code></p>
        <p>You can now close this window.</p>
      `);
    } else {
      res.status(500).send(`
        <h1>⚠️ Token Fetch Failed</h1>
        <pre>${JSON.stringify(tokenData, null, 2)}</pre>
      `);
    }
  } catch (error) {
    console.error("Error fetching token:", error);
    res.status(500).send(`
      <h1>🚨 Callback Error</h1>
      <pre>${error.message}</pre>
    `);
  }
}
