import SearchBar from "./searchbar";

export default function Navbar({ 
  onTrackSelect, 
  isAuthenticated, 
  onLogout
}) {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-gray-800">MickeMusicDB</h1>
            <SearchBar onTrackSelect={onTrackSelect} />
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <button
                onClick={onLogout}
                className="text-gray-600 px-4 py-2 rounded-lg hover:cursor-pointer hover:text-gray-800 hover:bg-gray-100"
              >
                Logga ut
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
