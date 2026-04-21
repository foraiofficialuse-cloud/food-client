import { useEffect, useState } from 'react';
import { getMyListingsAPI, cancelListingAPI, getUploadFileUrl } from '@/lib/api';
import { type FoodListing } from '@/types';
import StatusBadge from '@/components/shared/StatusBadge';
import { Clock, Users, XCircle, ImageIcon } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export default function HotelMyListings() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyListingsAPI().then((res) => setListings(res.data.listings)).finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!window.confirm('Cancel this listing?')) return;
    await cancelListingAPI(id);
    setListings((prev) => prev.map((l) => (l._id === id ? { ...l, status: 'cancelled' } : l)));
  };

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">My Food Listings</h1>
        <p className="text-gray-500 mt-1">{listings.length} total listings</p>
      </div>

      {listings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-gray-400">No listings yet. Upload your first food listing!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white rounded-2xl border border-orange-100 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <StatusBadge status={listing.status} />
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={11} /> Posted {formatDistanceToNow(new Date(listing.createdAt))} ago
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.foodItems.map((item, i) => (
                      <span key={i} className="text-xs bg-orange-50 text-orange-700 px-2.5 py-1 rounded-full font-medium">
                        {item.name} ({item.quantity} {item.unit})
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Users size={13} /> {listing.totalServings} servings</span>
                    <span>Expires: {format(new Date(listing.expiresAt), 'dd MMM, HH:mm')}</span>
                    {listing.images?.length ? (
                      <span className="flex items-center gap-1"><ImageIcon size={13} /> {listing.images.length} photos</span>
                    ) : null}
                  </div>
                </div>

                {listing.status === 'available' && (
                  <button
                    onClick={() => handleCancel(listing._id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-red-500 hover:bg-red-50 rounded-xl text-sm transition-all"
                  >
                    <XCircle size={15} /> Cancel
                  </button>
                )}
              </div>

              {listing.notes && (
                <p className="mt-3 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-lg">{listing.notes}</p>
              )}

              {listing.images?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {listing.images.map((image) => (
                    <a key={image} href={getUploadFileUrl(image)} target="_blank" rel="noreferrer">
                      <img
                        src={getUploadFileUrl(image)}
                        alt="Uploaded food"
                        className="h-16 w-16 rounded-lg object-cover border border-orange-100"
                      />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}