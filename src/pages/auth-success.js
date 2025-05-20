import { useEffect } from "react";
import { useRouter } from "next/router";

export default function AuthSuccess() {
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    if (token) {
      localStorage.setItem("spotify_access_token", token);
      router.push("/");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-xl">Autentisering lyckades! Omdirigerar...</p>
    </div>
  );
}
