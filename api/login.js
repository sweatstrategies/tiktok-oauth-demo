export default function handler(req, res) {
  const { TIKTOK_CLIENT_KEY, TIKTOK_REDIRECT_URI } = process.env;

  console.log("Login handler gestartet");
  console.log("Client Key:", TIKTOK_CLIENT_KEY);
  console.log("Redirect URI:", TIKTOK_REDIRECT_URI);

  if (!TIKTOK_CLIENT_KEY || !TIKTOK_REDIRECT_URI) {
    console.error("Missing environment variables!");
    return res.status(500).send("Missing environment variables");
  }

  const scope = "user.info.basic,video.list";

  const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&response_type=code&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}`;

  console.log("Auth URL:", authUrl);

  res.writeHead(302, { Location: authUrl });
  res.end();
}
