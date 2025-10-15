"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";


export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [song, setSong] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingFavorites, setFetchingFavorites] = useState(true);

  // ✅ Fetch user's favorites
  useEffect(() => {
    if (status === "authenticated") {
      fetchFavorites();
    }
  }, [status]);

  const fetchFavorites = async () => {
    setFetchingFavorites(true);
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      setFavorites(data);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setFetchingFavorites(false);
    }
  };

  // ✅ Add new favorite song
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!song.trim()) {
      toast.error("Please enter a song name");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Adding song...");
    
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ song }),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        setSong("");
        await fetchFavorites();
        toast.success("Song added successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add song");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error adding favorite");
      console.error("Error adding favorite:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id) => {
    const loadingToast = toast.loading("Deleting song...");
    
    try {
      const res = await fetch("/api/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== id));
        toast.success("Song deleted");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error deleting favorite");
      console.error("Error deleting favorite:", error);
    }
  };


  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4">🎵 My Favorite Songs</h1>
        <p className="text-center text-gray-600 mb-6">
          Welcome, <span className="font-medium">{session?.user?.name || session?.user?.email}</span>
        </p>

        {/* Add Song Form */}
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
          <input
            type="text"
            value={song}
            onChange={(e) => setSong(e.target.value)}
            placeholder="Enter song name"
            className="flex-1 border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add"}
          </button>
        </form>

        {/* Favorites List */}
        {fetchingFavorites ? (
          // Loading skeleton/spinner while fetching
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading your favorites...</p>
          </div>
        ) : (
          <ul className="space-y-2 transition-all">
            {favorites.length === 0 ? (
              <p className="text-gray-500 text-center">No favorites yet.</p>
            ) : (
              favorites.map((fav) => (
                <li
                  key={fav.id}
                  className="flex items-center justify-between border border-gray-200 rounded-xl p-3 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <span className="truncate">{fav.song}</span>
                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="text-red-500 hover:text-red-700 font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </li>
              ))
            )}
          </ul>
        )}


        {/* Logout Button */}
        <button
          onClick={() => signOut()}
          className="mt-6 w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
