import { useEffect, useState } from "react";
import { getAvailableFoodAPI, requestFoodAPI, getUploadFileUrl } from "@/lib/api";
import { type FoodListing } from "@/types";
import { MapPin, Clock, Users, Phone, Send } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function NGOAvailableFood() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [requesting, setRequesting] = useState<string | null>(null);
  const [msg, setMsg] = useState<{
    id: string;
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await getAvailableFoodAPI(showAll ? { all: true } : {});
        setListings(res.data.listings);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [showAll]);
  const handleRequest = async (id: string) => {
    setRequesting(id);
    try {
      await requestFoodAPI(id, { ngoNotes: notes[id] });
      setMsg({ id, text: "Request sent to hotel!", type: "success" });
      setListings((prev) => prev.filter((l) => l._id !== id));
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setMsg({
        id,
        text: axiosErr.response?.data?.message || "Failed to request",
        type: "error",
      });
    } finally {
      setRequesting(null);
      setTimeout(() => setMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="page-title">Available Food</h1>
          <p className="text-gray-500 mt-1">
            {listings.length} listings available
          </p>
        </div>
        <button
          onClick={() => setShowAll(!showAll)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            showAll
              ? "bg-green-600 text-white"
              : "bg-green-50 text-green-700 hover:bg-green-100"
          }`}
        >
          {showAll ? "Show Nearby Only" : "🌍 Show All Cities"}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 text-gray-400">
          Loading...
        </div>
      ) : listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-gray-400">
            No food available {showAll ? "anywhere right now" : "in your city"}.
          </p>
          {!showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 text-green-600 text-sm underline"
            >
              Search all cities?
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">
                    {listing.hotelName}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {listing.hotelAddress},{" "}
                      {listing.hotelCity}
                    </span>
                    <a
                      href={`tel:${listing.hotelPhone}`}
                      className="flex items-center gap-1 text-blue-500 hover:underline"
                    >
                      <Phone size={13} /> {listing.hotelPhone}
                    </a>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <span className="flex items-center gap-1 justify-end">
                    <Clock size={11} /> Expires{" "}
                    {formatDistanceToNow(new Date(listing.expiresAt))}
                  </span>
                  <span className="text-red-500 font-medium">
                    {format(new Date(listing.expiresAt), "dd MMM, HH:mm")}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {listing.foodItems.map((item, i) => (
                  <span
                    key={i}
                    className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium"
                  >
                    {item.name} • {item.quantity} {item.unit}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Users size={13} /> {listing.totalServings} total servings
                </span>
              </div>

              {listing.images?.length ? (
                <div className="flex flex-wrap gap-2 mb-3">
                  {listing.images.map((image) => (
                    <a key={image} href={getUploadFileUrl(image)} target="_blank" rel="noreferrer">
                      <img
                        src={getUploadFileUrl(image)}
                        alt="Food listing"
                        className="h-16 w-16 rounded-lg object-cover border border-green-100"
                      />
                    </a>
                  ))}
                </div>
              ) : null}

              {listing.notes && (
                <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 mb-3">
                  {listing.notes}
                </p>
              )}

              {msg?.id === listing._id && (
                <div
                  className={`px-3 py-2 rounded-xl text-sm mb-3 ${
                    msg.type === "success"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {msg.text}
                </div>
              )}

              <div className="flex gap-3">
                <textarea
                  placeholder="Add a note to the hotel (optional)"
                  value={notes[listing._id] || ""}
                  onChange={(e) =>
                    setNotes({ ...notes, [listing._id]: e.target.value })
                  }
                  rows={2}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
                />
                <button
                  onClick={() => handleRequest(listing._id)}
                  disabled={requesting === listing._id}
                  className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-all disabled:opacity-60 self-end"
                >
                  <Send size={14} />
                  {requesting === listing._id
                    ? "Requesting..."
                    : "Request Food"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
