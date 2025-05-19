import { getAccessToken } from "../../../../lib/apifetch";

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.redirect("/");
  }

  try {
    const data = await getAccessToken(code);

    // Spara token i localStorage via en redirect med data
    res.redirect(`/auth-success?token=${data.access_token}`);
  } catch (error) {
    console.error("Error getting access token:", error);
    res.redirect("/?error=authentication_failed");
  }
}
