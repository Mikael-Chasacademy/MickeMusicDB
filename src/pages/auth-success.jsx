import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthSuccess() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      // Spara token i localStorage
      localStorage.setItem("spotify_access_token", token);
      // Redirecta tillbaka till huvudsidan
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Autentisering lyckades! Omdirigerar...</p>
    </div>
  );
}
