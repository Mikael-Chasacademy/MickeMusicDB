export default function EnvTest() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Miljövariabel Test</h1>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Client ID:</h2>
            <p className="font-mono text-sm break-all">{process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || "Saknas"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Client Secret:</h2>
            <p className="font-mono text-sm break-all">{process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ? "Finns (dold)" : "Saknas"}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Redirect URI:</h2>
            <p className="font-mono text-sm break-all">{process.env.NEXT_PUBLIC_REDIRECT_URI || "Saknas"}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h2 className="font-semibold mb-2">Viktigt att kontrollera:</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Client ID ska vara en 32-tecken lång sträng</li>
            <li>Client Secret ska finnas (visas inte av säkerhetsskäl)</li>
            <li>Redirect URI ska matcha exakt med den i Spotify Dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
