import { useEffect, useState } from 'react';
import { getFoodServedAPI } from '@/lib/api';
import { type FoodRequest, type FoodListing } from '@/types';
import { Users, Utensils, MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function NGOFoodServed() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [totalPeople, setTotalPeople] = useState(0);
  const [totalServings, setTotalServings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFoodServedAPI().then((res) => {
      setRequests(res.data.requests);
      setTotalPeople(res.data.totalPeople);
      setTotalServings(res.data.totalServings);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-title">Food Served History</h1>
        <p className="text-gray-500 mt-1">Your complete donation impact record</p>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <Users size={24} className="mb-2 opacity-80" />
          <p className="text-3xl font-bold">{totalPeople.toLocaleString()}</p>
          <p className="text-green-100 text-sm mt-1">People Fed</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
          <Utensils size={24} className="mb-2 opacity-80" />
          <p className="text-3xl font-bold">{totalServings.toLocaleString()}</p>
          <p className="text-orange-100 text-sm mt-1">Servings Collected</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-16 text-center">
          <p className="text-gray-400">No food served yet. Start collecting from hotels!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => {
            const listing = req.foodListing as FoodListing;
            return (
              <div key={req._id} className="bg-white rounded-2xl border border-green-100 p-5 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">{req.hotelName}</h3>
                    {typeof listing === 'object' && listing?.hotelAddress && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={13} /> {listing.hotelAddress}, {listing.hotelCity}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    <span className="flex items-center gap-1 justify-end">
                      <Calendar size={11} />
                      {req.servedAt ? format(new Date(req.servedAt), 'dd MMM yyyy, HH:mm') : '—'}
                    </span>
                  </div>
                </div>

                {typeof listing === 'object' && listing.foodItems && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {listing.foodItems.map((item, i) => (
                      <span key={i} className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-medium">
                        {item.name} • {item.quantity} {item.unit}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-lg"><Users size={13} className="text-green-600" /></div>
                    <div>
                      <p className="font-semibold text-gray-800">{req.peopleServed || 0}</p>
                      <p className="text-xs text-gray-400">People Served</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-lg"><Utensils size={13} className="text-orange-600" /></div>
                    <div>
                      <p className="font-semibold text-gray-800">{req.servingsCollected || 0}</p>
                      <p className="text-xs text-gray-400">Servings Collected</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
