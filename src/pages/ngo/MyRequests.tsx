import { useEffect, useState } from "react";
import { getMyRequestsAPI, updateRequestStatusAPI, getUploadFileUrl } from "@/lib/api";
import { type FoodRequest, type FoodListing } from "@/types";
import StatusBadge from "@/components/shared/StatusBadge";
import { MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

const STATUS_FLOW: Record<
  string,
  { next: string; label: string; color: string }
> = {
  accepted: {
    next: "picking_up",
    label: "🚗 Start Pickup",
    color: "bg-blue-500",
  },
  picking_up: {
    next: "picked",
    label: "✅ Mark Picked",
    color: "bg-purple-500",
  },
  picked: { next: "served", label: "🍽️ Mark Served", color: "bg-green-600" },
};

export default function NGOMyRequests() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [serveData, setServeData] = useState<
    Record<string, { servings: string; people: string }>
  >({});
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    getMyRequestsAPI()
      .then((res) => setRequests(res.data.requests))
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (req: FoodRequest, nextStatus: string) => {
    setUpdating(req._id);
    try {
      const data: Record<string, unknown> = { status: nextStatus };
      if (nextStatus === "served") {
        data.servingsCollected = Number(serveData[req._id]?.servings || 0);
        data.peopleServed = Number(serveData[req._id]?.people || 0);
      }
      await updateRequestStatusAPI(req._id, data);
      setRequests((prev) =>
        prev.map((r) =>
          r._id === req._id
            ? { ...r, status: nextStatus as FoodRequest["status"] }
            : r,
        ),
      );
    } finally {
      setUpdating(null);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Loading...
      </div>
    );

  const active = requests.filter(
    (r) => !["served", "cancelled", "rejected"].includes(r.status),
  );
  const past = requests.filter((r) =>
    ["served", "cancelled", "rejected"].includes(r.status),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Requests</h1>
        <p className="text-gray-500 mt-1">
          {active.length} active, {past.length} completed
        </p>
      </div>

      {active.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">Active Requests</h2>
          {active.map((req) => {
            const listing = req.foodListing as FoodListing;
            const flowItem = STATUS_FLOW[req.status];
            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl border-2 border-green-200 p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {req.hotelName}
                    </h3>
                    {listing?.hotelAddress && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} /> {listing.hotelAddress}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={req.status} />
                </div>

                {typeof listing === "object" && listing.foodItems && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.foodItems.map((item, i) => (
                      <span
                        key={i}
                        className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full"
                      >
                        {item.name} • {item.quantity} {item.unit}
                      </span>
                    ))}
                  </div>
                )}

                {typeof listing === "object" && listing.images?.length ? (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.images.map((image) => (
                      <a key={image} href={getUploadFileUrl(image)} target="_blank" rel="noreferrer">
                        <img
                          src={getUploadFileUrl(image)}
                          alt="Listing food"
                          className="h-14 w-14 rounded-lg object-cover border border-green-100"
                        />
                      </a>
                    ))}
                  </div>
                ) : null}

                {req.status === "picked" && (
                  <div className="bg-amber-50 rounded-xl p-3 mb-3 flex gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">
                        Servings Collected
                      </label>
                      <input
                        type="number"
                        value={serveData[req._id]?.servings || ""}
                        onChange={(e) =>
                          setServeData({
                            ...serveData,
                            [req._id]: {
                              ...serveData[req._id],
                              servings: e.target.value,
                            },
                          })
                        }
                        placeholder="0"
                        className="w-28 px-3 py-1.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">
                        People Served
                      </label>
                      <input
                        type="number"
                        value={serveData[req._id]?.people || ""}
                        onChange={(e) =>
                          setServeData({
                            ...serveData,
                            [req._id]: {
                              ...serveData[req._id],
                              people: e.target.value,
                            },
                          })
                        }
                        placeholder="0"
                        className="w-28 px-3 py-1.5 border border-amber-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} /> Requested{" "}
                    {format(new Date(req.createdAt), "dd MMM, HH:mm")}
                  </span>
                  {flowItem && (
                    <button
                      onClick={() => handleUpdate(req, flowItem.next)}
                      disabled={updating === req._id}
                      className={`${flowItem.color} text-white px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-60`}
                    >
                      {updating === req._id ? "Updating..." : flowItem.label}
                    </button>
                  )}
                  {req.status === "pending" && (
                    <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl">
                      ⏳ Waiting for hotel response
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-semibold text-gray-700">Past Requests</h2>
          {past.map((req) => (
            <div
              key={req._id}
              className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800 text-sm">
                  {req.hotelName}
                </p>
                <p className="text-xs text-gray-400">
                  {format(new Date(req.createdAt), "dd MMM yyyy")}
                </p>
              </div>
              <div className="text-right">
                <StatusBadge status={req.status} />
                {req.status === "served" && req.peopleServed && (
                  <p className="text-xs text-gray-400 mt-1">
                    {req.peopleServed} people served
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
