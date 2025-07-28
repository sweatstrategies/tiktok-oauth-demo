import querystring from "querystring";

export default async function callbackHandler(req, res) {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send("Missing code");
  }

  const params = {
    client_key: process.env.TIKTOK_CLIENT_KEY,
    client_secret: process.env.TIKTOK_CLIENT_SECRET,
    code,
    grant_type: "authorization_code",
    redirect_uri: process.env.TIKTOK_REDIRECT_URI,
  };

  console.log("Token request params:", { ...params, client_secret: "hidden" });

  try {
    const response = await fetch(
      "https://open-api.tiktok.com/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: querystring.stringify(params),
      }
    );

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      if (data.error_code && data.error_code !== 0) {
        console.error("TikTok API error:", data);
        return res.status(500).json(data);
      }
      return res.status(200).json(data);
    } catch {
      console.error("Non-JSON response:", text);
      return res.status(500).send("Invalid token response");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).send("Internal server error");
  }
}
