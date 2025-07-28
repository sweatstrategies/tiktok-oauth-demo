export default function handler(req, res) {
  const { TIKTOK_CLIENT_KEY, TIKTOK_REDIRECT_URI } = process.env;

  if (!TIKTOK_CLIENT_KEY || !TIKTOK_REDIRECT_URI) {
    return res.status(500).send("Missing environment variables");
  }

  const scope = "user.info.basic,video.list";
  const state = "some_state";

  const authUrl = `https://www.tiktok.com/auth/authorize/?client_key=${TIKTOK_CLIENT_KEY}&response_type=code&scope=${encodeURIComponent(
    scope
  )}&redirect_uri=${encodeURIComponent(TIKTOK_REDIRECT_URI)}&state=${state}`;

  res.writeHead(302, { Location: authUrl });
  res.end();
}
